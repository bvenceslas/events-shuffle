import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './models/users.model';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),

    new: jest.fn().mockImplementation((userData) => {
      return {
        ...userData,
        save: jest.fn().mockResolvedValue(userData),
      };
    }),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw ConflictException if username is taken', async () => {
      const signUpDto = { username: 'testuser', password: 'password123' };
      mockUserModel.findOne.mockReturnValue({ username: 'testuser' });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should log in a user successfully', async () => {
      const loginDto = { username: 'testuser', password: 'password123' };
      const user = {
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
      };
      mockUserModel.findOne.mockReturnValue(user);
      mockJwtService.signAsync.mockReturnValue('mockedAccessToken');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('mockedAccessToken');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const loginDto = { username: 'testuser', password: 'password123' };
      mockUserModel.findOne.mockReturnValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto = { username: 'testuser', password: 'wrongPassword' };
      const user = {
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
      };
      mockUserModel.findOne.mockReturnValue(user);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
