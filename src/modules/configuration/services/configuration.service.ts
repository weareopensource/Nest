import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  ObjectSchema,
  object,
  string,
  number,
  boolean,
  validate,
} from 'joi';

export interface EnvConfig {
  [prop: string]: string;
}

export class ConfigurationService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    const config = parse(readFileSync(resolve(filePath)));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: ObjectSchema = object({
      NODE_ENV: string()
        .valid(['development', 'production', 'test', 'provision'])
        .default('development'),
      PORT: number().default(3000),
//      API_AUTH_ENABLED: boolean().required(),
    });

    const { error, value: validatedEnvConfig } = validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
