import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { SessionData } from 'express-session';
import { Product, Progress } from 'src/product/product.entity';

const mockRepo = () => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
});

jest.mock('bcrypt');

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('User Service', () => {
  let userService: UserService;
  let userRepo: MockRepo<User>;
  let productRepo: MockRepo<Product>;
  let mockUser: User;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo(),
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepo(),
        },
      ],
    }).compile();

    userService = moduleRef.get<UserService>(UserService);
    userRepo = moduleRef.get(getRepositoryToken(User));
    productRepo = moduleRef.get(getRepositoryToken(Product));

    mockUser = new User();
    mockUser.id = 1;
    mockUser.username = 'mockUsername';
    mockUser.email = 'mockEmail';
    mockUser.password = 'mockPassword';
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
    let mockSession: SessionData = { id: 'xxx' };

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
    });
  });

  describe('logout', () => {
    let mockSession: SessionData = { destroy: jest.fn() };

    it('Logout & Destroy session', async () => {
      const result = await userService.logout(mockSession);
      expect(result).toEqual({
        ok: true,
      });
    });
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
      productRepo.find.mockResolvedValueOnce([
        { id: 1, sellerId: mockUser.id, progress: Progress.Waiting },
        { id: 2, sellerId: mockUser.id, progress: Progress.Waiting },
        { id: 3, sellerId: mockUser.id, progress: Progress.Waiting },
      ]);
      productRepo.find.mockResolvedValueOnce([
        { id: 4, sellerId: mockUser.id, progress: Progress.InProgress },
        { id: 5, sellerId: mockUser.id, progress: Progress.InProgress },
        { id: 6, sellerId: mockUser.id, progress: Progress.InProgress },
      ]);

      const result = await userService.userDetail({ userId: mockUser.id });
      expect(result).toEqual({
        ok: true,
        user: { ...mockUser },
        waiting: [
          { id: 1, sellerId: mockUser.id, progress: Progress.Waiting },
          { id: 2, sellerId: mockUser.id, progress: Progress.Waiting },
          { id: 3, sellerId: mockUser.id, progress: Progress.Waiting },
        ],
        inProgress: [
          { id: 4, sellerId: mockUser.id, progress: Progress.InProgress },
          { id: 5, sellerId: mockUser.id, progress: Progress.InProgress },
          { id: 6, sellerId: mockUser.id, progress: Progress.InProgress },
        ],
      });
    });
  });

  describe('myProfile', () => {
    it('Error : Unexpected error', async () => {
      productRepo.find.mockRejectedValue(new Error());

      const result = await userService.myProfile(mockUser.id);
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Find my products', async () => {
      productRepo.find.mockResolvedValueOnce([
        { id: 1, sellerId: mockUser.id, progress: Progress.Closed },
        { id: 2, sellerId: mockUser.id, progress: Progress.Paid },
        { id: 3, sellerId: mockUser.id, progress: Progress.Completed },
      ]);

      productRepo.find.mockResolvedValueOnce([
        { id: 4, bidderId: mockUser.id, progress: Progress.InProgress },
        { id: 5, bidderId: mockUser.id, progress: Progress.Closed },
        { id: 6, bidderId: mockUser.id, progress: Progress.Completed },
        { id: 7, bidderId: mockUser.id, progress: Progress.Paid },
      ]);

      const result = await userService.myProfile(mockUser.id);
      expect(result).toEqual({
        ok: true,
        uploadedProduct: [
          { id: 1, sellerId: mockUser.id, progress: Progress.Closed },
          { id: 2, sellerId: mockUser.id, progress: Progress.Paid },
          { id: 3, sellerId: mockUser.id, progress: Progress.Completed },
        ],
        inProgressProduct: [
          { id: 4, bidderId: mockUser.id, progress: Progress.InProgress },
        ],
        closedProduct: [
          { id: 5, bidderId: mockUser.id, progress: Progress.Closed },
        ],
        paidProduct: [
          { id: 7, bidderId: mockUser.id, progress: Progress.Paid },
        ],
        completedProduct: [
          { id: 6, bidderId: mockUser.id, progress: Progress.Completed },
        ],
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

    it('Error : Already exist username', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValue({
        username: updateUserArgs.username,
      });

      const result = await userService.updateUser(
        { username: updateUserArgs.username },
        mockUser.id,
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
      );
      expect(result).toEqual({
        error: 'Already exist email',
      });
    });

    it('Error : Same password', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValueOnce({ password: mockUser.password });
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await userService.updateUser(
        { password: updateUserArgs.password },
        mockUser.id,
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
      );
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Change user info', async () => {
      userRepo.findOne.mockResolvedValueOnce(mockUser);
      userRepo.findOne.mockResolvedValueOnce(null);
      userRepo.findOne.mockResolvedValueOnce(null);
      userRepo.findOne.mockResolvedValueOnce({ password: mockUser.password });
      bcryptCompare = jest.fn().mockReturnValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await userService.updateUser(
        { ...updateUserArgs },
        mockUser.id,
      );
      expect(result).toEqual({
        ok: true,
      });
    });
  });

  describe('deleteUser', () => {
    let bcryptCompare: jest.Mock;

    it('Error : User not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await userService.deleteUser(
        { password: mockUser.password },
        mockUser.id,
      );
      expect(result).toEqual({
        error: 'User not found',
      });
    });

    it('Error : Check password again', async () => {
      userRepo.findOne.mockResolvedValue({ password: mockUser.password });

      bcryptCompare = jest.fn().mockReturnValue(false);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await userService.deleteUser(
        { password: 'incorrectPassword' },
        mockUser.id,
      );
      expect(result).toEqual({
        error: 'Check password again',
      });
    });

    it('Error : Unexpected error', async () => {
      userRepo.findOne.mockRejectedValue(new Error());

      const result = await userService.deleteUser(
        { password: mockUser.password },
        mockUser.id,
      );
      expect(result).toEqual({
        error: 'Unexpected error',
      });
    });

    it('Delete user & Logout', async () => {
      userRepo.findOne.mockResolvedValue({ password: mockUser.password });

      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;

      const result = await userService.deleteUser(
        { password: mockUser.password },
        mockUser.id,
      );
      expect(result).toEqual({
        ok: true,
      });
      expect(userRepo.delete).toHaveBeenCalledWith({ id: mockUser.id });
    });
  });
});
