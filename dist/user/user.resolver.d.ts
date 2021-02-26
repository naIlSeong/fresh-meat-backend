import { CommonOutput } from 'src/common/common.dto';
import { IContext } from 'src/common/common.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { LoginDto, LoginOutput } from './dto/login-dto';
import { MyProfileOutput } from './dto/my-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDetailDto, UserDetailOutput } from './dto/user-detail.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
export declare class UserResolver {
    private readonly userService;
    constructor(userService: UserService);
    me(user: User): User;
    createUser(createUserDto: CreateUserDto): Promise<CommonOutput>;
    login(loginDto: LoginDto, context: IContext): Promise<LoginOutput>;
    logout(context: IContext): Promise<CommonOutput>;
    userDetail(userDetailDto: UserDetailDto): Promise<UserDetailOutput>;
    myProfile(user: User): Promise<MyProfileOutput>;
    updateUser(updateUserDto: UpdateUserDto, user: User): Promise<CommonOutput>;
    deleteUser(deleteUserDto: DeleteUserDto, user: User): Promise<CommonOutput>;
}
