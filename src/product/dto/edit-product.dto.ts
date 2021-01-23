import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EditProductDto {
  @Field((type) => Number)
  productId: number;
}
