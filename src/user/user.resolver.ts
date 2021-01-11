import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => String)
  sayHello() {
    return 'Hi~';
  }

  @Mutation((returns) => CommonOutput)
  createUser(
    @Args('input') createUserDto: CreateUserDto,
  ): Promise<CommonOutput> {
    return this.userService.createUser(createUserDto);
  }
}
