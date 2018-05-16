import { MediaDto } from './media.dto';
import { Middleware, NestMiddleware, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/core';
import { MediasService } from './medias.service';
import { Media } from './media.entity';

@Middleware()
export class MediaFindMiddleware implements NestMiddleware {

  constructor(private readonly mediasService: MediasService) { }

  resolve() {
    return async (req, res, next) => {
      if (!req.params.id) {
        throw new HttpException({ error: 'Oops, something went wrong.' }, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const media = await this.mediasService.get(req.params.id);
      if (!media) {
        throw new HttpException('Media not found.', 404);
      }
      req.media = media;
      next();
    };
  }
}
