import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonOutput } from 'src/common/common.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

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
}
