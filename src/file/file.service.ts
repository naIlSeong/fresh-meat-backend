import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { CommonOutput } from 'src/common/common.dto';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
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
    stream,
    filename: string,
    mimetype: string,
    productId: number,
    user: User,
  ): Promise<CommonOutput> {
    try {
      const product = await this.productRepo.findOne({ id: productId });
      if (!product) {
        return {
          error: 'Product not found',
        };
      }

      if (product.sellerId !== user.id) {
        return {
          error: 'Not your product',
        };
      }

      const s3 = new S3();
      const { Location, Key } = await s3
        .upload({
          Bucket: this.configService.get('AWS_BUCKET_NAME'),
          Body: stream,
          Key: `${uuid()}-${filename}`,
          ContentType: mimetype,
        })
        .promise();

      await this.fileRepo.save(
        this.fileRepo.create({
          product,
          url: Location,
          key: Key,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        error: 'Unexpected error',
      };
    }
  }
}
