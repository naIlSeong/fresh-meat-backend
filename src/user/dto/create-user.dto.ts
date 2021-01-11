import { InputType, PickType } from '@nestjs/graphql';
import { User } from '../user.entity';

@InputType()
export class CreateUserDto extends PickType(User, [
  'username',
  'email',
  'password',
]) {}
