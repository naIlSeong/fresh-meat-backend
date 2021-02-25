import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
import { Product } from '../product.entity';

@InputType()
export class UploadProductDto extends PartialType(
  PickType(Product, ['productName', 'description', 'startPrice']),
) {}

@ObjectType()
export class UploadProductOutput extends CommonOutput {
  @Field((type) => Number, { nullable: true })
  productId?: number;
}
