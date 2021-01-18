import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteProductDto {
  @Field((type) => Number)
  productId: number;
}
