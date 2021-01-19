import { Field, InputType } from '@nestjs/graphql';
import { UploadProductDto } from './upload-product.dto';

@InputType()
export class EditProductDto extends UploadProductDto {
  @Field((type) => Number)
  productId: number;
}
