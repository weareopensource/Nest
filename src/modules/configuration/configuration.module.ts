import { Module } from '@nestjs/common';
import { ConfigurationService } from './services/configuration.service';

@Module({
  providers: [{
    provide: ConfigurationService,
    useValue: new ConfigurationService(`./src/modules/configuration/defaults/${process.env.NODE_ENV}.env`),
  }],
  exports: [ConfigurationService],
})
export class ConfigurationModule { }
