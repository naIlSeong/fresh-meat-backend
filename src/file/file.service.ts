import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Repository } from 'typeorm';
import { File } from './file.entity';
import { v4 as uuid } from 'uuid';
import { CommonOutput } from 'src/common/common.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer): Promise<CommonOutput> {
    try {
      const s3 = new S3();
      const uploadResult = await s3
        .upload({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Body: dataBuffer,
          Key: `${uuid()}`,
        })
        .promise();

      const newFile = this.fileRepo.create({
        uuid: uploadResult.Key,
        url: uploadResult.Location,
      });
      await this.fileRepo.save(newFile);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }
}
