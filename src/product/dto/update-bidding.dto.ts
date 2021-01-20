import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateBiddingDto {
  @Field((type) => Number)
  productId: number;

  @Field((type) => Number)
  bidPrice: number;
}
