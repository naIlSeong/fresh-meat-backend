import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommonOutput } from 'src/common/common.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
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

  @Mutation((returns) => CommonOutput)
  login(@Args('input') loginDto: LoginDto): Promise<CommonOutput> {
    return this.userService.login(loginDto);
  }
}
