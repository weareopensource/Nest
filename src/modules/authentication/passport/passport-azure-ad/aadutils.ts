import * as base64url from 'base64url';
import { randomBytes, createHash } from 'crypto';
// rrr import _extend from 'util';

const getLibraryProduct = () => 'passport-azure-ad';
const getLibraryVersionParameterName = () => 'x-client-Ver';
const getLibraryProductParameterName = () => 'x-client-SKU';
const getLibraryVersion = () => {
  return '3.0.12';
};

const getElement = (parentElement, elementName) => {
  if (parentElement[`saml:${elementName}`]) {
    return parentElement[`saml:${elementName}`];
  } else if (parentElement[`samlp:${elementName}`]) {
    return parentElement[`samlp:${elementName}`];
  } else if (parentElement[`wsa:${elementName}`]) {
    return parentElement[`wsa:${elementName}`];
  }
  return parentElement[elementName];
};

const getFirstElement = (parentElement, elementName) => {
  const element = exports.getElement(parentElement, elementName);
  return Array.isArray(element) ? element[0] : element;
};

/**
 * Reconstructs the original URL of the request.
 *
 * This function builds a URL that corresponds the original URL requested by the
 * client, including the protocol (http or https) and host.
 *
 * If the request passed through any proxies that terminate SSL, the
 * `X-Forwarded-Proto` header is used to detect if the request was encrypted to
 * the proxy.
 *
 * @return {String}
 * @api private
 */
const originalURL = (req) => {
  const headers = req.headers;
  const protocol = (req.connection.encrypted || req.headers['x-forwarded-proto'] === 'https') ? 'https' : 'http';
  const host = headers.host;
  const path = req.url || '';
  return `${protocol}://${host}${path}`;
};

/**
 * Merge object b with object a.
 *
 *     var a = { something: 'bar' }
 *       , b = { bar: 'baz' };
 *
 *     utils.merge(a, b);
 *     // => { something: 'bar', bar: 'baz' }
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

const merge = (a, b) => {
//  return util._extend(a, b); // eslint-disable-line no-underscore-dangle
  return Object.assign(a, b); // eslint-disable-line no-underscore-dangle
};

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * CREDIT: Connect -- utils.uid
 *         https://github.com/senchalabs/connect/blob/2.7.2/lib/utils.js
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */

const uid = (len) => {
  const bytes = randomBytes(Math.ceil(len * 3 / 4));
  return base64url.encode(bytes).slice(0, len);
};

function prepadSigned(hexStr) {
  const msb = hexStr[0];
  if (msb < '0' || msb > '7') {
    return `00${hexStr}`;
  }
  return hexStr;
}

function toHex(number) {
  const nstr = number.toString(16);
  if (nstr.length % 2) {
    return `0${nstr}`;
  }
  return nstr;
}

// encode ASN.1 DER length field
// if <=127, short form
// if >=128, long form
function encodeLengthHex(n) {
  if (n <= 127) {
    return toHex(n);
  }
  const nHex = toHex(n);
  const lengthOfLengthByte = 128 + nHex.length / 2; // 0x80+numbytes
  return toHex(lengthOfLengthByte) + nHex;
}

// http://stackoverflow.com/questions/18835132/xml-to-pem-in-node-js
const rsaPublicKeyPem = (modulusB64, exponentB64) => {
  const modulus = new Buffer(modulusB64, 'base64');
  const exponent = new Buffer(exponentB64, 'base64');

  const modulusHex = prepadSigned(modulus.toString('hex'));
  const exponentHex = prepadSigned(exponent.toString('hex'));

  const modlen = modulusHex.length / 2;
  const explen = exponentHex.length / 2;

  const encodedModlen = encodeLengthHex(modlen);
  const encodedExplen = encodeLengthHex(explen);
  const encodedPubkey = `30${encodeLengthHex(
          modlen +
          explen +
          encodedModlen.length / 2 +
          encodedExplen.length / 2 + 2,
        )}02${encodedModlen}${modulusHex}02${encodedExplen}${exponentHex}`;

  const derB64 = new Buffer(encodedPubkey, 'hex').toString('base64');

  const pem = `-----BEGIN RSA PUBLIC KEY-----\n${derB64.match(/.{1,64}/g).join('\n')}\n-----END RSA PUBLIC KEY-----\n`;

  return pem;
};

// used for c_hash and at_hash validation
// case (1): content = access_token, hashProvided = at_hash
// case (2): content = code, hashProvided = c_hash
const checkHashValueRS256 = (content, hashProvided) => {
  if (!content)
    return false;

  // step 1. hash the content
  const digest = createHash('sha256').update(content, 'ascii').digest();

  // step2. take the first half of the digest, and save it in a buffer
  const buffer = new Buffer(digest.length / 2);
  for (let i = 0; i < buffer.length; i++)
    buffer[i] = digest[i];

  // step 3. base64url encode the buffer to get the hash
  const hashComputed = base64url(buffer);

  return (hashProvided === hashComputed);
};

// This function is used for handling the tuples containing nonce/state/policy/timeStamp in session
// remove the additional tuples from array starting from the oldest ones
// remove expired tuples in array
const processArray = (array, maxAmount, maxAge) => {
  // remove the additional tuples, start from the oldest ones
  if (array.length > maxAmount)
    array.splice(0, array.length - maxAmount);

  // count the number of those already expired
  let count = 0;
  for (let i; i < array.length; i++) {
    const tuple = array[i];
    if (tuple.timeStamp + maxAge * 1000 <= Date.now())
      count++;
    else
      break;
  }

  // remove the expired ones
  if (count > 0)
    array.splice(0, count);
};

// This function is used to find the tuple matching the given state, remove the tuple
// from the array and return the tuple
// @array        - array of {state: x, nonce: x, policy: x, timeStamp: x} tuples
// @state        - the tuple which matches the given state
const findAndDeleteTupleByState = (array, state) => {
  if (!array)
    return null;

  for (let i = 0; i < array.length; i++) {
    const tuple = array[i];
    if (tuple.state === state) {
      // remove the tuple from the array
      array.splice(i, 1);
      return tuple;
    }
  }

  return null;
};

// copy the fields from source to dest
const copyObjectFields = (source, dest, fields) => {
  if (!source || !dest || !fields || !Array.isArray(fields))
    return;

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < fields.length; i++) {
    dest[fields[i]] = source[fields[i]];
  }
};

const getErrorMessage = (err) => {
  if (typeof err === 'string')
    return err;
  if (err instanceof Error)
    return err.message;

  // if not string or Error, we try to stringify it
  let str;
  try {
    str = JSON.stringify(err);
  } catch (ex) {
    return err;
  }
  return str;
};

const concatUrl = (url, rest) => {
  if (typeof rest === 'string' || rest instanceof String) {
    rest = [rest];
  }

  if (!url) {
    return `?${rest.join('&')}`;
  }

  const hasParam = url.indexOf('?') !== -1;
  return rest ? url.concat(hasParam ? '&' : '?').concat(rest.join('&')) : url;
};

export {
  getLibraryProduct,
  getLibraryVersionParameterName,
  getLibraryProductParameterName,
  getLibraryVersion,
  getElement,
  getFirstElement,
  originalURL,
  merge,
  uid,
  prepadSigned,
  toHex,
  encodeLengthHex,
  rsaPublicKeyPem,
  checkHashValueRS256,
  processArray,
  findAndDeleteTupleByState,
  copyObjectFields,
  getErrorMessage,
  concatUrl,
};
