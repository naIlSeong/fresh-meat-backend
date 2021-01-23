import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/common.dto';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import {
  ProductDetailDto,
  ProductDetailOutput,
} from './dto/product-detail.dto';
import { UploadProductDto } from './dto/upload-product.dto';
import { Product, Progress } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private schedulerRegistry: SchedulerRegistry,
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

  async editProduct(
    editProductDto: EditProductDto,
    user: User,
  ): Promise<CommonOutput> {
    try {
      const product = await this.productRepo.findOne({
        id: editProductDto.productId,
      });

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
          error: "Can't edit product",
        };
      }

      await this.productRepo.save({ ...product, ...editProductDto });
      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async productDetail({
    productId,
  }: ProductDetailDto): Promise<ProductDetailOutput> {
    try {
      const product = await this.productRepo.findOne({ id: productId });
      if (!product) {
        return {
          error: 'Product not found',
        };
      }

      return {
        ok: true,
        product,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async editProgress(
    { productId }: EditProductDto,
    user: User,
  ): Promise<CommonOutput> {
    try {
      const product = await this.productRepo.findOne({ id: productId });
      if (!product) {
        return {
          error: 'Product not found',
        };
      }

      // Closed -> Paid
      if (product.progress === Progress.Closed) {
        if (product.bidderId !== user.id) {
          return {
            error: "Can't edit progress",
          };
        }
      }

      // Paid -> Completed
      if (product.progress === Progress.Paid) {
        if (product.sellerId !== user.id) {
          return {
            error: "Can't edit progress",
          };
        }
      }

      product.progress =
        product.progress === Progress.Closed
          ? Progress.Paid
          : Progress.Completed;
      await this.productRepo.save(product);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async createBidding(
    { productId, bidPrice }: CreateBiddingDto,
    user: User,
  ): Promise<CommonOutput> {
    try {
      const product = await this.productRepo.findOne({ id: productId });
      if (!product) {
        return {
          error: 'Product not found',
        };
      }
      if (product.sellerId === user.id) {
        return {
          error: "Can't bid on your product",
        };
      }
      if (
        product.progress !== Progress.Waiting &&
        product.progress !== Progress.InProgress
      ) {
        return {
          error: 'The auction has already closed',
        };
      }

      // Update
      if (bidPrice) {
        if (product.bidderId === user.id) {
          return {
            error: 'Already bid on product',
          };
        }

        if (product.bidPrice >= bidPrice) {
          return {
            error: `Bid price must be more than ${product.bidPrice}`,
          };
        }
      }

      product.bidder = user;
      product.bidPrice = bidPrice ? bidPrice : product.startPrice;
      product.remainingTime = new Date(new Date().valueOf() + 600000);
      product.progress = Progress.InProgress;

      await this.productRepo.save(product);
      this.createTimer(product);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  createTimer(product: Product) {
    const timers = this.schedulerRegistry.getTimeouts();
    if (timers.length !== 0) {
      timers.forEach((key) => {
        if (key === `createdTimerId:${product.id}`) {
          this.schedulerRegistry.deleteTimeout(`${key}`);
        }
      });
    }

    this.schedulerRegistry.addTimeout(
      `createdTimerId:${product.id}`,
      setTimeout(async () => {
        product.progress = Progress.Closed;
        await this.productRepo.save(product);
      }, 600000),
    );
  }
}
