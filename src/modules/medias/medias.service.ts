import { MediaDto } from './media.dto';
import { Component } from '@nestjs/common';
import { TypeOrmDatabaseService } from '../database/typeOrm.database.service';
import { Media } from './media.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';
import { Command } from '../commands/command.entity';

function toMediaDto(media: Media): MediaDto {
  const commandId = media.command.id;
  delete media.command;
  return { ...media, commandId } as MediaDto;
}

@Component()
export class MediasService implements Service<any> {

  constructor(private databaseService: TypeOrmDatabaseService) { }

  private get mediaRepository(): Promise<Repository<Media>> {
    return this.databaseService.getRepository(Media);
  }

  private get commandRepository(): Promise<Repository<Command>> {
    return this.databaseService.getRepository(Command);
  }

  private async seed() {
    const mediaRepository = await this.mediaRepository;
    const count = await mediaRepository.count();
    if (count === 0) {
//            const medias = await mediaRepository.save([new Media('John Doe', 30), new Media('Jane Doe', 40)]);
            console.log('Seeded Medias.');
//            console.log(medias);
    }
  }

  public async add(mediaDto: MediaDto): Promise<MediaDto> {
    const mediaRepository = await this.mediaRepository;
    const mediaEntity = await mediaRepository.create(mediaDto);
    return mediaRepository.save(mediaEntity).then((savedMedia: Media): MediaDto => toMediaDto(savedMedia));
  }

  public async addAll(mediasDto: MediaDto[]): Promise<{ medias: MediaDto[]; }> {
    const mediaRepository = await this.mediaRepository;
    const commandRepository = await this.commandRepository;
    const mediasEntities = mediasDto.map(async function(mediaDto) {
      const mediaEntity = await mediaRepository.create(mediaDto);
      const commandEntity = await commandRepository.findOne({id: mediaDto.commandId})
      mediaEntity.command = commandEntity;
      return mediaEntity;
    })
    return Promise.all(mediasEntities)
    .then(medias => mediaRepository.save(medias))
    .then(medias => ({ medias: medias.map(media => toMediaDto(media)) }))
  }

  public async deleteAll(mediaIds: number[]): Promise<{ commandId: number, mediaIds: number[] }> {
    const mediaRepository = await this.mediaRepository;
    const media = await mediaRepository.findOneById(mediaIds[0], { relations: ['command'] });
    const command = media.command;
    const commandId = command.id;
    await mediaRepository.removeByIds(mediaIds);
    return { commandId, mediaIds };
  }

  public async getAll(): Promise<any> {
    return (await this.mediaRepository)
      .find({ relations: ['command'] })
      .then(medias => ({ medias: medias.map(media => toMediaDto(media)) }));
  }

  public async get(id: number): Promise<any> {
    return (await this.mediaRepository).findOneById(id, { relations: ['command'] })
    .then(media => toMediaDto(media));
  }

  public async update(media: Media): Promise<MediaDto> {
    return (await this.mediaRepository).save(media)
    .then(media => toMediaDto(media));
  }

  public async remove(mediaId: number): Promise<MediaDto> {
    const repository = (await this.mediaRepository);
    const media = await repository.findOneById(mediaId);
    return repository.remove(media)
    .then(media => {
      media.id = mediaId;
      return toMediaDto(media);
    });
  }
}
