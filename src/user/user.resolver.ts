import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/common.constant';
import { CommonOutput } from 'src/common/common.dto';
import { IContext } from 'src/common/common.interface';
import { CurrentUser } from '../auth/auth.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { LoginDto, LoginOutput } from './dto/login-dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
  @Mutation((returns) => LoginOutput)
  login(
    @Args('input') loginDto: LoginDto,
    @Context() context: IContext,
  ): Promise<LoginOutput> {
    return this.userService.login(loginDto, context.req.session);
  }

  @Public()
  @Mutation((returns) => CommonOutput)
  logout(@Context() context: IContext): Promise<CommonOutput> {
    return this.userService.logout(context.req.session);
  }

  @Query((returns) => UserDetailOutput)
  userDetail(@Args('input') userDetailDto: UserDetailDto) {
    return this.userService.userDetail(userDetailDto);
  }

  @Mutation((returns) => CommonOutput)
  updateUser(
    @Args('input') updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.updateUser(updateUserDto, user.id);
  }

  @Mutation((returns) => CommonOutput)
  deleteUser(
    @Args('input') deleteUserDto: DeleteUserDto,
    @CurrentUser() user: User,
  ) {
    return this.userService.deleteUser(deleteUserDto, user.id);
  }
}
