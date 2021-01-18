import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { IContext, ISession } from 'src/common/common.interface';

const mockRepo = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

jest.mock('bcrypt');

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('User Service', () => {
  let userService: UserService;
  let userRepo: MockRepo<User>;
  let mockUser: User;

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

    mockUser = new User();
    mockUser.id = 1;
    mockUser.username = 'mockUsername';
    mockUser.email = 'mockEmail';
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

  describe('login', () => {
    let bcryptCompare: jest.Mock;
    let mockSession: ISession = { id: 'xxx' };

    it('Error : Email not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await userService.login(mockUser, mockSession);
      expect(result).toEqual({
        error: 'Email not found',
      });
    });

    it('Error : Wrong password', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      bcryptCompare = jest.fn().mockReturnValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await userService.login(mockUser, mockSession);
      expect(result).toEqual({
        error: 'Wrong password',
      });
    });

    it('Error : Unexpected error', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await userService.login(mockUser, mockSession);
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Login & Save user on session', async () => {
      userRepo.findOne.mockResolvedValue(mockUser);
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await userService.login(mockUser, mockSession);
      expect(result).toEqual({
        ok: true,
      });
      expect(mockSession).toEqual({ id: 'xxx', user: mockUser });
    });
  });

  // TODO : Fix Error
  describe('logout', () => {
    // let mockContext: IContext;
    // // mockContext.req.session.destroy = jest
    // //   .fn()
    // //   .mockImplementation(() => Promise.reject());
    // it('Error : Unexpected error', async () => {
    //   const result = await userService.logout(mockContext);
    //   expect(result).toEqual({
    //     ok: true,
    //   });
    // });
    // it.todo('Logout & Destroy Session');
  });

  describe('userDetail', () => {
    it('Error : User not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await userService.userDetail({ userId: mockUser.id });
      expect(result).toEqual({
        error: 'User not found',
      });
    });

    it('Error : Unexpected error', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await userService.userDetail({ userId: mockUser.id });
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Find user ID : 1', async () => {
      userRepo.findOne.mockResolvedValue({
        ...mockUser,
      });

      const result = await userService.userDetail({ userId: mockUser.id });
      expect(result).toEqual({
        ok: true,
        user: { ...mockUser },
      });
    });
  });

  describe('updateUser', () => {
    const updateUserArgs = {
      username: 'updatedUsername',
      email: 'updatedEmail',
      password: 'updatedPassword',
    };
    let bcryptCompare: jest.Mock;
    let mockContext: IContext;

    it('Error : Already exist username', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValue({
        username: updateUserArgs.username,
      });

      const result = await userService.updateUser(
        { username: updateUserArgs.username },
        mockUser.id,
        mockContext,
      );
      expect(result).toEqual({
        error: 'Already exist username',
      });
    });

    it('Error : Already exist email', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValue({
        email: updateUserArgs.email,
      });

      const result = await userService.updateUser(
        { email: updateUserArgs.email },
        mockUser.id,
        mockContext,
      );
      expect(result).toEqual({
        error: 'Already exist email',
      });
    });

    it('Error : Same password', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await userService.updateUser(
        { password: updateUserArgs.password },
        mockUser.id,
        mockContext,
      );
      expect(result).toEqual({
        error: 'Same password',
      });
    });

    it('Error : Unexpected error', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await userService.updateUser(
        { username: updateUserArgs.username },
        mockUser.id,
        mockContext,
      );
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Change user info', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValue(null);
      bcryptCompare = jest.fn().mockReturnValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await userService.updateUser(
        { ...updateUserArgs },
        mockUser.id,
        mockContext,
      );
      expect(result).toEqual({
        ok: true,
      });
      expect(userRepo.save).toBeCalled();
    });
  });
});
