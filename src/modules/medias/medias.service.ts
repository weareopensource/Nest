import { MediaDto } from './media.dto';
import { Injectable } from '@nestjs/common';
import { Media } from './media.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';
import { Command } from '../commands/command.entity';
import { InjectRepository } from '@nestjs/typeorm';

function toMediaDto(media: Media): MediaDto {
  const commandId = media.command.id;
  delete media.command;
  return { ...media, commandId } as MediaDto;
}

@Injectable()
export class MediasService implements Service<any> {

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Command)
    private readonly commandRepository: Repository<Command>,
  ) { }

  private async seed() {
    const mediaRepository = await this.mediaRepository;
    const count = await mediaRepository.count();
    if (count === 0) {
//            const medias = await mediaRepository.save([new Media('John Doe', 30), new Media('Jane Doe', 40)]);
            // console.log('Seeded Medias.');
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
    const mediasEntities = mediasDto.map(async (mediaDto) => {
      const mediaEntity = await mediaRepository.create(mediaDto);
      const commandEntity = await commandRepository.findOne({id: mediaDto.commandId});
      mediaEntity.command = commandEntity;
      return mediaEntity;
    });
    return Promise.all(mediasEntities)
    .then(medias => mediaRepository.save(medias))
    .then(medias => ({ medias: medias.map(media => toMediaDto(media)) }));
  }

  public async deleteAll(mediaIds: number[]): Promise<{ commandId: number, mediaIds: number[] }> {
    const mediaRepository = await this.mediaRepository;
    const media = await mediaRepository.findByIds(mediaIds, { relations: ['command'] });
    const command = media[0].command;
    const commandId = command.id;
    await mediaRepository.delete(mediaIds);
    return { commandId, mediaIds };
  }

  public async getAll(): Promise<any> {
    return (await this.mediaRepository)
      .find({ relations: ['command'] })
      .then(medias => ({ medias: medias.map(media => toMediaDto(media)) }));
  }

  public async get(id: number): Promise<any> {
    return (await this.mediaRepository).findByIds([id], { relations: ['command'] })
    .then(media => toMediaDto(media[0]));
  }

  public async update(media: Media): Promise<MediaDto> {
    return (await this.mediaRepository).save(media)
    .then((media: any) => toMediaDto(media));
  }

  public async remove(mediaId: number): Promise<MediaDto> {
    const mediaRepository = (await this.mediaRepository);
    const media = await mediaRepository.findByIds([mediaId]);
    return mediaRepository.remove(media)
    .then(medias => {
      medias[0].id = mediaId;
      return toMediaDto(media[0]);
    });
  }
}
