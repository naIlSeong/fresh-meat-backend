import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBiddingDto {
  @Field((type) => Number)
  productId: number;
}
