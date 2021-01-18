import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/auth.decorator';
import { CommonOutput } from 'src/common/common.dto';
import { User } from 'src/user/user.entity';
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
}
