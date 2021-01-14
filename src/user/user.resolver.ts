import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/common.constant';
import { CommonOutput } from 'src/common/common.dto';
import { CurrentUser } from '../auth/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query((returns) => User)
  me(@CurrentUser() user: User) {
    return user;
  }

  @Public()
  @Mutation((returns) => CommonOutput)
  createUser(
    @Args('input') createUserDto: CreateUserDto,
  ): Promise<CommonOutput> {
    return this.userService.createUser(createUserDto);
  }

  @Public()
  @Mutation((returns) => CommonOutput)
  login(
    @Args('input') loginDto: LoginDto,
    @Context() ctx: any,
  ): Promise<CommonOutput> {
    return this.userService.login(loginDto, ctx.req.session);
  }
}
