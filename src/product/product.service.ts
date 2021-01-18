import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/common.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { UploadProductDto } from './dto/upload-product.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async uploadProduct(
    uploadProductDto: UploadProductDto,
    user: User,
  ): Promise<CommonOutput> {
    try {
      if (!uploadProductDto.productName) {
        return {
          error: 'Product name is required',
        };
      }

      if (!uploadProductDto.startPrice) {
        return {
          error: 'Start price is required',
        };
      }

      await this.productRepo.save(
        this.productRepo.create({ ...uploadProductDto, seller: user }),
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
