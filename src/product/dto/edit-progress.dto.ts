import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class EditProgressDto {
  @Field((type) => Number)
  productId: number;
}
