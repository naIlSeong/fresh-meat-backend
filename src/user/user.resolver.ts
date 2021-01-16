import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/common.constant';
import { CommonOutput } from 'src/common/common.dto';
import { IContext } from 'src/common/common.interface';
import { CurrentUser } from '../auth/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-dto';
import { UserDetailDto, UserDetailOutput } from './dto/user-detail.dto';
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
    @Context() context: IContext,
  ): Promise<CommonOutput> {
    return this.userService.login(loginDto, context.req.session);
  }

  @Mutation((returns) => CommonOutput)
  logout(@Context() context: IContext): Promise<CommonOutput> {
    return this.userService.logout(context);
  }

  @Query((returns) => UserDetailOutput)
  userDetail(@Args('input') userDetailDto: UserDetailDto) {
    return this.userService.userDetail(userDetailDto);
  }
}
