import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { User } from '../user.entity';

@InputType()
export class UpdateUserDto extends PartialType(
  PickType(User, ['username', 'email', 'password']),
) {}
