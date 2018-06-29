import { mapKeys, pickBy, forEach, merge } from 'lodash';
import { set } from 'object-path';
import { join } from 'path';

const currentEnv = process.env.NODE_ENV || 'developement';
const defaultConfig = require(join(process.cwd(), './config', 'defaults', currentEnv)) || {};

// Get the config from  process.env.WAOS_BACK_*
const environmentVars = mapKeys(
  pickBy(process.env, (_value, key) => key.startsWith('WAOS_BACK_')),
  (_v, k) => k.split('_').slice(2).join('.'),
);
const environmentConfigVars = {};
forEach(environmentVars, (v, k) => set(environmentConfigVars, k, v));

// Merge config files
export const config = merge(defaultConfig, environmentConfigVars);
