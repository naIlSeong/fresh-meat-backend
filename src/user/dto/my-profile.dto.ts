import { Field, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
import { Product } from 'src/product/product.entity';

@ObjectType()
export class MyProfileOutput extends CommonOutput {
  @Field((type) => [Product], { nullable: true })
  uploadedProduct?: Product[];

  @Field((type) => [Product], { nullable: true })
  biddedProduct?: Product[];
}
