import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
import { User } from '../user.entity';

@InputType()
export class LoginDto extends PickType(User, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends CommonOutput {}
