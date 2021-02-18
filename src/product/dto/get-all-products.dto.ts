import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
import { Product } from '../product.entity';

@InputType()
export class GetAllProductsDto {
  @Field((type) => Number, { nullable: true, defaultValue: 1 })
  page?: number;
}

@ObjectType()
export class GetAllProductsOutput extends CommonOutput {
  @Field((type) => [Product], { nullable: true })
  products?: Product[];
}
