import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { CommonOutput } from 'src/common/common.dto';
import { Product } from 'src/product/product.entity';
import { Repository } from 'typeorm';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { v4 as uuid } from 'uuid';
import { File } from './file.entity';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
  ) {}

  async uploadImage(
    stream: ReadStream,
    filename: string,
    mimetype: string,
    productId: number,
  ): Promise<CommonOutput> {
    try {
      const product = await this.productRepo.findOne({ id: productId });

      const s3 = new S3();
      const { Location, Key } = await s3
        .upload({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Body: stream,
          Key: `${uuid()}-${filename}`,
          ContentType: mimetype,
        })
        .promise();

      const picture = this.fileRepo.create({
        product,
        url: Location,
        key: Key,
      });

      await this.fileRepo.save(picture);
      await this.productRepo.save({ ...product, picture });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async deleteImage(fileKey: string): Promise<CommonOutput> {
    try {
      const s3 = new S3();

      s3.deleteObject(
        {
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Key: fileKey,
        },
        (err, data) => {
          if (err) {
            throw err;
          }
        },
      );

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
