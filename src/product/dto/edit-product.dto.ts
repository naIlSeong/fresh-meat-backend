import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { Product } from '../product.entity';

@InputType()
export class EditProductDto extends PartialType(
  PickType(Product, ['productName', 'startPrice', 'description']),
) {
  @Field((type) => Number)
  productId: number;

  @Field((type) => Boolean, { nullable: true, defaultValue: false })
  deleteImage?: boolean;
}
