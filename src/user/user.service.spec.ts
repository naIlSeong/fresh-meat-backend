import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

const mockRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('User Service', () => {
  let userService: UserService;
  let userRepo: MockRepo<User>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo(),
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepo = moduleRef.get(getRepositoryToken(User));
  });

  describe('createUser', () => {
    const existUser = {
      username: 'existUsername',
      email: 'existEmail',
    };
    const newUser = {
      username: 'newUsername',
      email: 'newEmail',
      password: 'newPassword',
    };

    it('Error : Already exist username', async () => {
      userRepo.findOne.mockResolvedValue(existUser);

      const result = await userService.createUser({
        ...newUser,
        username: existUser.username,
      });
      expect(result).toEqual({
        error: 'Already exist username',
      });
    });

    it('Error : Already exist email', async () => {
      userRepo.findOne.mockResolvedValueOnce(null);
      userRepo.findOne.mockResolvedValue(existUser);

      const result = await userService.createUser({
        ...newUser,
        email: existUser.email,
      });
      expect(result).toEqual({
        error: 'Already exist email',
      });
    });

    it('Error : Unexpected error', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await userService.createUser(newUser);
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Create new user', async () => {
      userRepo.findOne.mockResolvedValue(null);
      userRepo.findOne.mockResolvedValue(null);

      const result = await userService.createUser(newUser);
      expect(result).toEqual({
        ok: true,
      });
      expect(userRepo.save).toBeCalled();
      expect(userRepo.create).toBeCalledWith(newUser);
    });
  });
});
