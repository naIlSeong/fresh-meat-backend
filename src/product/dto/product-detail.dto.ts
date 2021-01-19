import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
import { Product } from '../product.entity';

@InputType()
export class ProductDetailDto {
  @Field((type) => Number)
  productId: number;
}

@ObjectType()
export class ProductDetailOutput extends CommonOutput {
  @Field((type) => Product, { nullable: true })
  product?: Product;
}
