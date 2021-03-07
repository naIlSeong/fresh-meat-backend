import { CommonOutput } from 'src/common/common.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto, LoginOutput } from './dto/login-dto';
import { User } from './user.entity';
import { UserDetailDto, UserDetailOutput } from './dto/user-detail.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SessionData } from 'express-session';
import { Product } from 'src/product/product.entity';
import { MyProfileOutput } from './dto/my-profile.dto';
export declare class UserService {
    private readonly userRepo;
    private readonly productRepo;
    constructor(userRepo: Repository<User>, productRepo: Repository<Product>);
    createUser({ username, email, password, }: CreateUserDto): Promise<CommonOutput>;
    login({ email, password }: LoginDto, session: SessionData): Promise<LoginOutput>;
    logout(session: SessionData): Promise<CommonOutput>;
    userDetail({ userId }: UserDetailDto): Promise<UserDetailOutput>;
    myProfile(userId: number): Promise<MyProfileOutput>;
    updateUser({ username, email, password }: UpdateUserDto, userId: number): Promise<CommonOutput>;
    deleteUser({ password }: DeleteUserDto, userId: number): Promise<CommonOutput>;
}
