import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/common.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto, LoginOutput } from './dto/login-dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { UserDetailDto, UserDetailOutput } from './dto/user-detail.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { SessionData } from 'express-session';
import { Product, Progress } from 'src/product/product.entity';
import { MyProfileOutput } from './dto/my-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
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
    session: SessionData,
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

      session.user = user;
      return {
        ok: true,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async logout(session: SessionData): Promise<CommonOutput> {
    try {
      session.destroy((err) => {
        if (err) {
          throw new Error('Error: Destroy session');
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

      const waiting = await this.productRepo.find({
        seller: {
          id: userId,
        },
        progress: Progress.Waiting,
      });

      const inProgress = await this.productRepo.find({
        seller: {
          id: userId,
        },
        progress: Progress.InProgress,
      });

      return {
        ok: true,
        user,
        waiting,
        inProgress,
      };
    } catch (error) {
      return {
        error: 'Unexpected error',
      };
    }
  }

  async myProfile(userId: number): Promise<MyProfileOutput> {
    try {
      const user = await this.userRepo.findOne({ id: userId });
      const uploadedProduct = await this.productRepo.find({
        seller: {
          id: userId,
        },
        progress: Progress.Closed || Progress.Completed || Progress.Paid,
      });

      const biddedProduct = await this.productRepo.find({
        bidder: {
          id: userId,
        },
      });

      return {
        ok: true,
        uploadedProduct,
        biddedProduct,
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
