import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
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
}
