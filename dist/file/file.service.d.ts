/// <reference types="node" />
import { ConfigService } from '@nestjs/config';
import { CommonOutput } from 'src/common/common.dto';
import { Product } from 'src/product/product.entity';
import { Repository } from 'typeorm';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { DeleteImageDto } from './dto/delete-image.dto';
import { File } from './file.entity';
export declare class FileService {
    private readonly configService;
    private readonly productRepo;
    private readonly fileRepo;
    constructor(configService: ConfigService, productRepo: Repository<Product>, fileRepo: Repository<File>);
    uploadImage(stream: ReadStream, filename: string, mimetype: string, productId: number): Promise<CommonOutput>;
    deleteImage({ fileId, fileKey, }: DeleteImageDto): Promise<CommonOutput>;
}
