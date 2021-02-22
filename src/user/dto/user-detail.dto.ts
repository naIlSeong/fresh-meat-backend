import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
import { Product } from 'src/product/product.entity';
import { User } from '../user.entity';

@InputType()
export class UserDetailDto {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class UserDetailOutput extends CommonOutput {
  @Field((type) => User, { nullable: true })
  user?: User;

  @Field((type) => [Product], { nullable: true })
  inProgress?: Product[];

  @Field((type) => [Product], { nullable: true })
  waiting?: Product[];
}
