import { isHttpUri, isHttpsUri } from 'valid-url';

const types: any = {};

types.isNonEmpty = {
  validate: (value) => {
    return value !== '' && value !== undefined && value !== null;
  },
  error: 'The value cannot be empty',
};

types.isTypeLegal = {
  validate: (value) => {
    return value === 'id_token' || value === 'id_token code' || value === 'code id_token' || value === 'code';
  },
  error: 'The responseType: must be either id_token, id_token code, code id_token or code.',
};

types.isModeLegal = {
  validate: (value) => {
    return value === 'query' || value === 'form_post';
  },
  error: 'The responseMode: must be either query or form_post.',
};

types.isURL = {
  validate: (value) => {
    return isHttpUri(value) || isHttpsUri(value);
  },
  error: 'The URL must be valid and be https:// or http://',
};

types.isHttpURL = {
  validate: (value) => {
    return isHttpUri(value);
  },
  error: 'The URL must be valid and be http://',
};

types.isHttpsURL = {
  validate: (value) => {
    return isHttpsUri(value);
  },
  error: 'The URL must be valid and be https://',
};

types.isHttpsURLIfExists = {
  validate: (value) => {
    if (value)
      return isHttpsUri(value);
    else
      return true;
  },
  error: 'The URL must be valid and be https://',
};

class Validator {
  private config: any;
  constructor(config: any) {
    this.config = config;
  }

  validate(options) {
    const opts = options || {};

    Object.keys(this.config).forEach((item) => {
      if (!this.config.hasOwnProperty(item)) {
        throw new TypeError(`Missing value for ${item}`);
      }
      const type = this.config[item];
      if (!type) {
        return; // no need to validate
      }
      const checker = types[type];
      if (!checker) { // missing required checker
        throw new TypeError(`No handler to validate type ${type} for item ${item}`);
      }

      if (!checker.validate(opts[item])) {
        throw new TypeError(`Invalid value for ${item}.${checker.error}`);
      }
    });
  }

  public static isNonEmpty = 'isNonEmpty';
  public static isTypeLegal = 'isTypeLegal';
  public static isModeLegal = 'isModeLegal';
  public static isURL = 'isURL';
  public static isHttpURL = 'isHttpURL';
  public static isHttpsURL = 'isHttpsURL';
  public static isHttpsURLIfExists = 'isHttpsURLIfExists';
}

export { Validator };
