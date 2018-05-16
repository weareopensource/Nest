import { CommandDto } from './command.dto';
import { Middleware, NestMiddleware, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/core';
import { CommandsService } from './commands.service';
import { Command } from './command.entity';

@Middleware()
export class CommandFindMiddleware implements NestMiddleware {

  constructor(private commandsService: CommandsService) { }

  resolve() {
    return async (req, res, next) => {
      if (!req.params.id) {
        throw new HttpException({ error: 'Oops, something went wrong.' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const command = await this.commandsService.get(req.params.id);
      if (!command) {
        throw new HttpException('Command not found.', 404);
      }
      req.command = command;
      next();
    };
  }
}
