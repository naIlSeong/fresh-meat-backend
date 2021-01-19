import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/common.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UploadProductDto } from './dto/upload-product.dto';
import { Product, Progress } from './product.entity';

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

  async deleteProduct(
    { productId }: DeleteProductDto,
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

      if (
        product.progress !== Progress.Waiting &&
        product.progress !== Progress.Completed
      ) {
        return {
          error: "Can't delete product",
        };
      }

      await this.productRepo.delete({ id: productId });

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
