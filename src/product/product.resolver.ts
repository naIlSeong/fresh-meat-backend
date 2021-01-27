import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth.decorator';
import { CommonOutput } from 'src/common/common.dto';
import { User } from 'src/user/user.entity';
import { CreateBiddingDto } from './dto/create-bidding.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { EditProductDto } from './dto/edit-product.dto';
import { EditProgressDto } from './dto/edit-progress.dto';
import {
  ProductDetailDto,
  ProductDetailOutput,
} from './dto/product-detail.dto';
import { UploadProductDto } from './dto/upload-product.dto';
import { Product } from './product.entity';
import { ProductService } from './product.service';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Mutation((returns) => CommonOutput)
  uploadProduct(
    @Args('input') uploadProductDto: UploadProductDto,
    @CurrentUser() user: User,
  ): Promise<CommonOutput> {
    return this.productService.uploadProduct(uploadProductDto, user);
  }

  @Mutation((returns) => CommonOutput)
  deleteProduct(
    @Args('input') deleteProductDto: DeleteProductDto,
    @CurrentUser() user: User,
  ): Promise<CommonOutput> {
    return this.productService.deleteProduct(deleteProductDto, user);
  }

  @Mutation((returns) => CommonOutput)
  editProduct(
    @Args('input') editProductDto: EditProductDto,
    @CurrentUser() user: User,
  ): Promise<CommonOutput> {
    return this.productService.editProduct(editProductDto, user);
  }

  @Query((returns) => ProductDetailOutput)
  productDetail(
    @Args('input') productDetailDto: ProductDetailDto,
  ): Promise<ProductDetailOutput> {
    return this.productService.productDetail(productDetailDto);
  }

  @Mutation((returns) => CommonOutput)
  editProgress(
    @Args('input') editProgressDto: EditProgressDto,
    @CurrentUser() user: User,
  ): Promise<CommonOutput> {
    return this.productService.editProgress(editProgressDto, user);
  }

  @Mutation((returns) => CommonOutput)
  createBidding(
    @Args('input') createBiddingDto: CreateBiddingDto,
    @CurrentUser() user: User,
  ): Promise<CommonOutput> {
    return this.productService.createBidding(createBiddingDto, user);
  }
}
