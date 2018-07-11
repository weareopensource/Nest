import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

export interface EnvConfig {
  [prop: string]: string;
}
@Injectable()
export class ConfigurationService {

  constructor(filePath: string) {
    config({ path: filePath });
  }

  get(key: string): string {
    return process.env[key];
  }
}
