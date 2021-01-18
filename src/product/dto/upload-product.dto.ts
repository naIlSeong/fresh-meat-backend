import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { Product } from '../product.entity';

@InputType()
export class UploadProductDto extends PartialType(
  PickType(Product, ['productName', 'description', 'startPrice']),
) {}
