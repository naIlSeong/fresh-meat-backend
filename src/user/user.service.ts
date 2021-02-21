import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/common.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto, LoginOutput } from './dto/login-dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserDetailDto, UserDetailOutput } from './dto/user-detail.dto';
import { IContext, ISession } from 'src/common/common.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createUser({
    username,
    email,
    password,
  }: CreateUserDto): Promise<CommonOutput> {
    try {
      const existUsername = await this.userRepo.findOne({ username });
      if (existUsername) {
        return {
          error: 'Already exist username',
        };
      }
      const existEmail = await this.userRepo.findOne({ email });
      if (existEmail) {
        return {
          error: 'Already exist email',
        };
      }
      await this.userRepo.save(
        this.userRepo.create({ username, email, password }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async login(
    { email, password }: LoginDto,
    context: IContext,
  ): Promise<LoginOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: { email },
        select: ['password', 'id', 'username', 'email'],
      });
      if (!user) {
        return {
          error: 'Email not found',
        };
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return {
          error: 'Wrong password',
        };
      }

      const session: ISession = context.req.session;
      session.user = user;
      return {
        ok: true,
        sessionId: session.id,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async logout(context: IContext): Promise<CommonOutput> {
    try {
      context.req.session.destroy((err) => {
        if (err) {
          throw new Error(err);
        }
      });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async userDetail({ userId }: UserDetailDto): Promise<UserDetailOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (!user) {
        return {
          error: 'User not found',
        };
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async updateUser(
    { username, email, password }: UpdateUserDto,
    userId: number,
  ): Promise<CommonOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      if (username) {
        const exist = await this.userRepo.findOne({ username });
        if (exist && exist.id !== user.id) {
          return {
            error: 'Already exist username',
          };
        }
        user.username = username;
      }

      if (email) {
        const exist = await this.userRepo.findOne({ email });
        if (exist && exist.id !== user.id) {
          return {
            error: 'Already exist email',
          };
        }
        user.email = email;
      }

      if (password) {
        const currentPassword = await this.userRepo.findOne({
          where: { id: userId },
          select: ['password'],
        });
        const isSamePassword = await bcrypt.compare(
          password,
          currentPassword.password,
        );
        if (isSamePassword) {
          return {
            error: 'Same password',
          };
        }
        user.password = password;
      }

      await this.userRepo.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async deleteUser(
    { password }: DeleteUserDto,
    userId: number,
  ): Promise<CommonOutput> {
    try {
      const user = await this.userRepo.findOne({
        where: { id: userId },
        select: ['password'],
      });

      if (!user) {
        return {
          error: 'User not found',
        };
      }

      const isSamePassword = await bcrypt.compare(password, user.password);
      if (!isSamePassword) {
        return {
          error: 'Check password again',
        };
      }

      await this.userRepo.delete({ id: userId });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }
}
