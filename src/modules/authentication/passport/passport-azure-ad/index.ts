import * as passport from 'passport';
import CONSTANTS from './constants';
import * as aadutils from './aadutils';
import { Validator } from './validator';
import { isHttpUri } from 'valid-url';
import { inherits } from 'util';
import { decode } from 'jws';
import * as jwt from './jsonwebtoken';
import * as base64url from 'base64url';
import * as async from 'async';
import * as jwe from './jwe';
import * as jws from 'jws';
import * as cacheManager from 'cache-manager';
import * as url from 'url';
import Metadata from './metadata';

const memoryCache = cacheManager.caching({ store: 'memory', max: 3600, ttl: 1800 /* seconds */ });
const ttl = 1800; // 30 minutes cache

function Strategy(options, verify) {
  passport.Strategy.call(this);

  this._options = options;
  this.name = 'azuread-openidconnect';

  // stuff related to the verify function
  this._verify = verify;
  this._passReqToCallback = !!options.passReqToCallback;

  if (options.useCookieInsteadOfSession === true)
    this._useCookieInsteadOfSession = true;
  else
    this._useCookieInsteadOfSession = false;

  this._key = options.sessionKey || ('OIDC: ' + options.clientID);

  if (!options.identityMetadata) {
    // default value should be https://login.microsoftonline.com/common/.well-known/openid-configuration
    throw new TypeError(`OIDCStrategy requires a metadata location that contains cert data for RSA and ECDSA callback.`);
  }

  if (options.loggingNoPII !== false)
    options.loggingNoPII = true;

  // clock skew. Must be a postive integer
  if (options.clockSkew && (typeof options.clockSkew !== 'number' || options.clockSkew <= 0 || options.clockSkew % 1 !== 0))
    throw new Error('clockSkew must be a positive integer');
  if (!options.clockSkew)
    options.clockSkew = CONSTANTS.CLOCK_SKEW;

  // check existence
  if (!options.identityMetadata) {
    throw new TypeError(`OIDCStrategy requires a metadata location that contains cert data for RSA and ECDSA callback.`);
  }

  // check if we are using the common endpoint
  options.isCommonEndpoint = (options.identityMetadata.indexOf('/common/') !== -1);

  // isB2C is false by default
  if (options.isB2C !== true)
    options.isB2C = false;

  // add telemetry
  options.identityMetadata = aadutils.concatUrl(
    options.identityMetadata,
    [
      `${aadutils.getLibraryProductParameterName()}=${aadutils.getLibraryProduct()}`,
      `${aadutils.getLibraryVersionParameterName()}=${aadutils.getLibraryVersion()}`,
    ],
  );

  /****************************************************************************************
   * Take care of issuer and audience
   * (1) We use user provided `issuer`, and the issuer value from metadata if the metadata
   *     comes from tenant-specific endpoint (in other words, either the identityMetadata
   *     is tenant-specific, or it is common but you provide tenantIdOrName in
   *     passport.authenticate).
   *
   *     For common endpoint, if `issuer` is not provided by user, and `tenantIdOrName` is
   *     not used in passport.authenticate, then we don't know the issuer, and `validateIssuer`
   *     must be set to false
   * (2) `validateIssuer` is true by default. we validate issuer unless validateIssuer is set false
   * (3) `audience` must be the clientID of this app
   ***************************************************************************************/
  if (options.validateIssuer !== false)
    options.validateIssuer = true;

  if (options.issuer === '')
    options.issuer = null;
  // make issuer an array
  if (options.issuer && !Array.isArray(options.issuer))
    options.issuer = [options.issuer];

  options.audience = options.clientID;
  options.allowMultiAudiencesInToken = false;

  /****************************************************************************************
   * Take care of scope
   ***************************************************************************************/
   // make scope an array
  if (!options.scope)
    options.scope = [];
  if (!Array.isArray(options.scope))
    options.scope = [options.scope];
  // always have 'openid' scope for openID Connect
  if (options.scope.indexOf('openid') === -1)
    options.scope.push('openid');
  options.scope = options.scope.join(' ');

  /****************************************************************************************
   * Check if we are using v2 endpoint, v2 doesn't have an userinfo endpoint
   ***************************************************************************************/
  if (options.identityMetadata.indexOf('/v2.0/') !== -1)
    options._isV2 = true;

  /****************************************************************************************
   * validate other necessary option items provided, we validate them here and only once
   ***************************************************************************************/

  const itemsToValidate = {};
  aadutils.copyObjectFields(options, itemsToValidate, ['clientID', 'redirectUrl', 'responseType', 'responseMode', 'identityMetadata']);

  const validatorConfiguration: any = {
    clientID: Validator.isNonEmpty,
    responseType: Validator.isTypeLegal,
    responseMode: Validator.isModeLegal,
    identityMetadata: Validator.isHttpsURL,
  };

  // redirectUrl is https by default
  if (options.allowHttpForRedirectUrl === true)
    validatorConfiguration.redirectUrl = Validator.isURL;
  else
    validatorConfiguration.redirectUrl = Validator.isHttpsURL;

  // validator will throw exception if a required option is missing
  const validator = new Validator(validatorConfiguration);
  validator.validate(itemsToValidate);
}

// Inherit from `passport.Strategy`.
inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function authenticateStrategy(req, options) {
  const self = this;

  const resource = options && options.resourceURL;
  const customState = options && options.customState;
  const tenantIdOrName = options && options.tenantIdOrName;
  const login_hint = options && options.login_hint;
  const domain_hint = options && options.domain_hint;
  const prompt = options && options.prompt;
  const extraAuthReqQueryParams = options && options.extraAuthReqQueryParams;
  const extraTokenReqQueryParams = options && options.extraTokenReqQueryParams;
  const response = options && options.response || req.res;

  // 'params': items we get from the request or metadata, such as id_token, code, policy, metadata, cacheKey, etc
  const params: any = { tenantIdOrName, extraAuthReqQueryParams, extraTokenReqQueryParams };
  // 'oauthConfig': items needed for oauth flow (like redirection, code redemption), such as token_endpoint, userinfo_endpoint, etc
  const oauthConfig = { resource, customState, domain_hint, login_hint, prompt, response };
  // 'optionsToValidate': items we need to validate id_token against, such as issuer, audience, etc
  const optionsToValidate = {};

  async.waterfall(
    [
      /*****************************************************************************
       * Step 1. Collect information from the req and save the info into params
       ****************************************************************************/
      (next) => {
        return self.collectInfoFromReq(params, req, next, response);
      },

      /*****************************************************************************
       * Step 2. Load metadata, use the information from 'params' and 'self._options'
       * to configure 'oauthConfig' and 'optionsToValidate'
       ****************************************************************************/
      (next) => {
        return self.setOptions(params, oauthConfig, optionsToValidate, next);
      },

      /*****************************************************************************
       * Step 3. Handle the flows
       *----------------------------------------------------------------------------
       * (1) implicit flow (response_type = 'id_token')
       *     This case we get a 'id_token'
       * (2) hybrid flow (response_type = 'id_token code')
       *     This case we get both 'id_token' and 'code'
       * (3) authorization code flow (response_type = 'code')
       *     This case we get a 'code', we will use it to get 'access_token' and 'id_token'
       * (4) for any other request, we will ask for authorization and initialize
       *     the authorization process
       ****************************************************************************/
      (next) => {

        if (params.err) {
//          // handle the error
//          return self._errorResponseHandler(params.err, params.err_description, next);
        } else {
          // handle implicit flow
         return self._implicitFlowHandler(params, optionsToValidate, req, next);
        }
      },
    ],

    (waterfallError) => {
      // this code gets called after the three steps above are done
      if (waterfallError) {
        return self.failWithLog(`${aadutils.getErrorMessage(waterfallError)}`);
      }
      return true;
    });
};

Strategy.prototype._validateResponse = function validateResponse(params, optionsToValidate, req, next, callback) {
    const self = this;

    const id_token = params.id_token;
    const code = params.code;
    const access_token = params.access_token;

    // decode id_token
    const decoded: any = decode(id_token);
    if (decoded == null)
      return next(new Error('In _validateResponse: Invalid JWT token'));

    // get Pem Key
    let PEMkey = null;
    try {
      if (decoded.header.kid) {
        PEMkey = params.metadata.generateOidcPEM(decoded.header.kid);
      } else if (decoded.header.x5t) {
        PEMkey = params.metadata.generateOidcPEM(decoded.header.x5t);
      } else {
        return next(new Error('In _validateResponse: We did not receive a token we know how to validate'));
      }
    } catch (error) {
      return next(new Error('In _validateResponse: failed to generate PEM key due to: ' + error.message));
    }

  // verify id_token signature and claims
    return jwt.verify(id_token, PEMkey, optionsToValidate, (err, jwtClaims: any) => {
      if (err)
      return next(new Error(`In _validateResponse: ${aadutils.getErrorMessage(err)}`));

    // jwt checks the 'nbf', 'exp', 'aud', 'iss' claims
    // there are a few other things we will check below

    // For B2C, check the policy

      if (self._options.isB2C) {
        let policy_in_idToken;

        if (jwtClaims.acr && CONSTANTS.POLICY_REGEX.test(jwtClaims.acr))
          policy_in_idToken = jwtClaims.acr;
        else if (jwtClaims.tfp && CONSTANTS.POLICY_REGEX.test(jwtClaims.tfp))
          policy_in_idToken = jwtClaims.tfp.toLowerCase();
        else
          return next(new Error('In _validateResponse: invalid B2C policy in id_token'));

        if (params.policy !== policy_in_idToken)
          return next(new Error('In _validateResponse: policy in id_token does not match the policy used'));
      }

    // check nonce
// !!!!!!!      if (!jwtClaims.nonce || jwtClaims.nonce === '' || jwtClaims.nonce !== optionsToValidate.nonce)
// !!!!!!!      return next(new Error('In _validateResponse: invalid nonce'));

    // check c_hash
      if (jwtClaims.c_hash) {
      // checkHashValueRS256 checks if code is null, so we don't bother here
      if (!aadutils.checkHashValueRS256(code, jwtClaims.c_hash))
        return next(new Error('In _validateResponse: invalid c_hash'));
    }

    // check at_hash
      if (jwtClaims.at_hash) {
      // checkHashValueRS256 checks if access_token is null, so we don't bother here
      if (!aadutils.checkHashValueRS256(access_token, jwtClaims.at_hash))
        return next(new Error('In _validateResponse: invalid at_hash'));
    }

    // return jwt claims and jwt claims string
      const idTokenSegments = id_token.split('.');
      const jwtClaimsStr = base64url.decode(idTokenSegments[1]);
      return callback(jwtClaimsStr, jwtClaims);
  });
};

Strategy.prototype._implicitFlowHandler = function implicitFlowHandler(params, optionsToValidate, req, next) {
  /* we will do the following things in order
   * (1) validate id_token
   * (2) use the claims in the id_token for user's profile
   */

  const self = this;

  // validate the id_token
  return self._idTokenHandler(params, optionsToValidate, req, next, (jwtClaimsStr, jwtClaims) => {
    const sub = jwtClaims.sub;
    const iss = jwtClaims.iss;

    // we are in implicit flow, use the content in id_token as the profile'

    return onProfileLoaded(self, {
      req,
      sub,
      iss,
      profile: makeProfileObject(jwtClaims, jwtClaimsStr),
      jwtClaims,
      access_token: null,
      refresh_token: null,
      params: null,
    });
  });
};

Strategy.prototype._idTokenHandler = function idTokenHandler(params, optionsToValidate, req, next, callback) {

  const self = this;

  const id_token = params.id_token;

  const parts = id_token.split('.');

  if (parts.length === 3)
    return self._validateResponse(params, optionsToValidate, req, next, callback);
  else if (parts.length === 5) {

  // In _idTokenHandler: we received an id_token of JWE format, we are decrypting it
    return jwe.decrypt(id_token, optionsToValidate.jweKeyStore, console.log, (err, decrypted_token) => {
      if (err)
        return next(err);

      params.id_token = decrypted_token;
      return self._validateResponse(params, optionsToValidate, req, next, callback);
    });
  } else
    return next(new Error(`id_token has ${parts.length} parts, it is neither jwe nor jws`));
};

function onProfileLoaded(strategy, args) {

  function verified(err, user, info) {
    if (err) {
      return strategy.error(err);
    }
    if (!user) {
      return strategy.failWithLog(info);
    }
    return strategy.success(user, info);
  }

  const verifyArityArgsMap = {
    8: 'iss sub profile jwtClaims access_token refresh_token params',
    7: 'iss sub profile access_token refresh_token params',
    6: 'iss sub profile access_token refresh_token',
    4: 'iss sub profile',
    3: 'iss sub',
  };

  const arity = (strategy._passReqToCallback) ? strategy._verify.length - 1 : strategy._verify.length;
  let verifyArgs = [args.profile, verified];

  if (verifyArityArgsMap[arity]) {
    verifyArgs = verifyArityArgsMap[arity]
      .split(' ')
      .map((argName) => {
        return args[argName];
      })
      .concat([verified]);
  }

  if (strategy._passReqToCallback) {
    verifyArgs.unshift(args.req);
  }

  return strategy._verify.apply(strategy, verifyArgs);
}

function makeProfileObject(src, raw) {
  return {
    sub: src.sub,
    oid: src.oid,
    upn: src.upn,
    displayName: src.name,
    name: {
      familyName: src.family_name,
      givenName: src.given_name,
      middleName: src.middle_name,
    },
    emails: src.emails,
    _raw: raw,
    _json: src,
  };
}

Strategy.prototype.setOptions = function setOptions(params, oauthConfig, optionsToValidate, done) {
  const self = this;

  async.waterfall([
    // ------------------------------------------------------------------------
    // load metadata
    // ------------------------------------------------------------------------
    (next) => {
      memoryCache.wrap(params.cachekey, (cacheCallback) => {
        params.metadata.fetch((fetchMetadataError) => {
          if (fetchMetadataError) {
            return cacheCallback(fetchMetadataError, undefined);
          }

          return cacheCallback(null, params.metadata);
        });
      }, { ttl }, next);
    },

    // ------------------------------------------------------------------------
    // set oauthConfig: the information we need for oauth flow like redeeming code/access_token
    // ------------------------------------------------------------------------
    (metadata, next) => {
      if (!metadata.oidc)
        return next(new Error('In setOptions: failed to load metadata'));
      params.metadata = metadata;

      // copy the fields needed into 'oauthConfig'
      aadutils.copyObjectFields(metadata.oidc, oauthConfig, ['authorization_endpoint', 'token_endpoint', 'userinfo_endpoint']);
      aadutils.copyObjectFields(self._options, oauthConfig, ['clientID', 'clientSecret', 'privatePEMKey', 'thumbprint', 'responseType', 'responseMode', 'scope', 'redirectUrl']);
      oauthConfig.tenantIdOrName = params.tenantIdOrName;
      oauthConfig.extraAuthReqQueryParams = params.extraAuthReqQueryParams;
      oauthConfig.extraTokenReqQueryParams = params.extraTokenReqQueryParams;

      // validate oauthConfig
      const validatorConfig = {
        authorization_endpoint: Validator.isHttpsURL,
        token_endpoint: Validator.isHttpsURL,
        userinfo_endpoint: Validator.isHttpsURLIfExists,
      };

      try {
        // validator will throw exception if a required option is missing
        const checker = new Validator(validatorConfig);
        checker.validate(oauthConfig);
      } catch (ex) {
        return next(new Error(`In setOptions: ${aadutils.getErrorMessage(ex)}`));
      }

      // for B2C, verify the endpoints in oauthConfig has the correct policy
      if (self._options.isB2C){
        const policyChecker = (endpoint, policy) => {
          let u: any = {};
          try {
            u = url.parse(endpoint, true);
          } catch (ex) {
          }
          return u.query && u.query.p && (policy.toLowerCase() === u.query.p.toLowerCase());
        };
        // B2C has no userinfo_endpoint, so no need to check it
        if (!policyChecker(oauthConfig.authorization_endpoint, params.policy)) {
          if (self._options.loggingNoPII)
            return next(new Error('invalid policy'));
          else
            return next(new Error(`policy in ${oauthConfig.authorization_endpoint} should be ${params.policy}`));
        }
        if (!policyChecker(oauthConfig.token_endpoint, params.policy)) {
          if (self._options.loggingNoPII)
            return next(new Error('invalid policy'));
          else
            return next(new Error(`policy in ${oauthConfig.token_endpoint} should be ${params.policy}`));
        }
      }

      return next(null, metadata);
    },

    // ------------------------------------------------------------------------
    // set optionsToValidate: the information we need for id_token validation.
    // we do this only if params has id_token or code, otherwise there is no
    // id_token to validate
    // ------------------------------------------------------------------------
    (metadata, next) => {
      if (!params.id_token && !params.code)
        return next(null);

      // set items from self._options
      aadutils.copyObjectFields(self._options, optionsToValidate,
        ['validateIssuer', 'audience', 'allowMultiAudiencesInToken', 'ignoreExpiration', 'allowMultiAudiencesInToken']);

      // algorithms
      const algorithms = metadata.oidc.algorithms;
      if (!algorithms)
        return next(new Error('In setOptions: algorithms is missing in metadata'));
      if (!Array.isArray(algorithms) || algorithms.length === 0 || (algorithms.length === 1 && algorithms[0] === 'none'))
        return next(new Error('In setOptions: algorithms must be an array containing at least one algorithm'));
      optionsToValidate.algorithms = algorithms;

      // nonce
///    !!!!!!!!      optionsToValidate.nonce = params.nonce;

      // clock skew
      optionsToValidate.clockSkew = self._options.clockSkew;

      // jweKeyStore
      optionsToValidate.jweKeyStore = self._options.jweKeyStore;

      // issuer
      // if the metadata is not coming from common endpoint, we record the issuer value from metadata
      if (!self._options.isCommonEndpoint || (self._options.isCommonEndpoint && params.tenantIdOrName))
        optionsToValidate.issuer = [metadata.oidc.issuer];
      else
        optionsToValidate.issuer = [];
      // if user provided issuer, we also record these issuer values
      if (self._options.issuer)
        optionsToValidate.issuer = optionsToValidate.issuer.concat(self._options.issuer);
      // if we don't get any issuer value and we want to validate issuer, we should fail
      if (optionsToValidate.issuer.length === 0 && self._options.validateIssuer)
        return next(new Error('In setOptions: we want to validate issuer but issuer is not found'));

      return next(null);
    },
  ], done);
};

Strategy.prototype.collectInfoFromReq = function(params, req, next, response) {
  const self = this;

  // the things we will put into 'params':
  // err, err_description, id_token, code, policy, state, nonce, cachekey, metadata

  // -------------------------------------------------------------------------
  // we shouldn't get any access_token or refresh_token from the request
  // -------------------------------------------------------------------------
  if ((req.query && (req.query.access_token || req.query.refresh_token)) ||
    (req.body && (req.body.access_token || req.body.refresh_token)))
    return next(new Error('In collectInfoFromReq: neither access token nor refresh token is expected in the incoming request'));

  // -------------------------------------------------------------------------
  // we might get err, id_token, code, state from the request
  // -------------------------------------------------------------------------
  let source = null;

  if (req.query && (req.query.error || req.query.id_token || req.query.code))
    source = req.query;
  else if (req.body && (req.body.error || req.body.id_token || req.body.code))
    source = req.body;

  if (source) {
    params.err = source.error;
    params.err_description = source.error_description;
    params.id_token = source.id_token;
    params.code = source.code;
  }

  // -------------------------------------------------------------------------
  // If we received code, id_token or err, we must have received state, now we
  // find the state/nonce/policy tuple from session.
  // If we received none of them, find policy in query
  // -------------------------------------------------------------------------
  if (params.id_token || params.code || params.err) {

/* xxx
    let tuple;
    if (!self._useCookieInsteadOfSession)
      tuple = self._sessionContentHandler.findAndDeleteTupleByState(req, self._key, params.state);
    else
      tuple = self._cookieContentHandler.findAndDeleteTupleByState(req, response, params.state);

    if (!tuple)
      return next(new Error('In collectInfoFromReq: invalid state received in the request'));

    params.nonce = tuple.nonce;
    params.policy = tuple.policy;
    params.resource = tuple.resource;
*/
  } else {
    params.policy = req.query.p ? req.query.p.toLowerCase() : null;
  }

  // if we are not using the common endpoint, but we have tenantIdOrName, just ignore it
  if (!self._options.isCommonEndpoint && params.tenantIdOrName) {
    params.tenantIdOrName = null;
  }

  // if we are using the common endpoint and we want to validate issuer, then user has to
  // provide issuer in config, or provide tenant id or name using tenantIdOrName option in
  // passport.authenticate. Otherwise we won't know the issuer.
  if (self._options.isCommonEndpoint && self._options.validateIssuer &&
    (!self._options.issuer && !params.tenantIdOrName))
    return next(new Error('In collectInfoFromReq: issuer or tenantIdOrName must be provided in order to validate issuer on common endpoint'));

  // for B2C, we must have policy
  if (self._options.isB2C && !params.policy)
    return next(new Error('In collectInfoFromReq: policy is missing'));
  // for B2C, if we are using common endpoint, we must have tenantIdOrName provided
  if (self._options.isB2C && self._options.isCommonEndpoint && !params.tenantIdOrName)
    return next(new Error('In collectInfoFromReq: we are using common endpoint for B2C but tenantIdOrName is not provided'));

  // -------------------------------------------------------------------------
  // calculate metadataUrl, create a cachekey and an Metadata object instance
  // we will fetch the metadata, save it into the object using the cachekey
  // -------------------------------------------------------------------------
  let metadataUrl = self._options.identityMetadata;

  // if we are using common endpoint and we are given the tenantIdOrName, let's replace it
  if (self._options.isCommonEndpoint && params.tenantIdOrName) {
    metadataUrl = metadataUrl.replace('/common/', `/${params.tenantIdOrName}/`);
 //   if (self._options.loggingNoPII);
// rrr      log.info(`we are replacing 'common' with the tenantIdOrName provided`);
 //   else;
//  rrr    log.info(`we are replacing 'common' with the tenantIdOrName ${params.tenantIdOrName}`);
  }

  // add policy for B2C
  if (self._options.isB2C)
    metadataUrl = metadataUrl.concat(`&p=${params.policy}`);

  // we use the metadataUrl as the cachekey
  params.cachekey = metadataUrl;
  params.metadata = new Metadata(metadataUrl, 'oidc', self._options);

  return next();
};

export default Strategy;
