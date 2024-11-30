import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './models/users.model';
import { SignUpUserDto, LoginUserDto } from './dto/users.dto';
import { ConflictException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
}));

export const mockUsersService = {
  signUp: jest.fn().mockImplementation(async (signUpUserDto: SignUpUserDto) => {
    if (signUpUserDto.username === 'test') {
      throw new ConflictException(
        'Username test taken, please use another one',
      );
    }
    return { _id: '1', username: signUpUserDto.username };
  }),
  login: jest.fn().mockResolvedValue({ accessToken: 'mockedToken' }),
  findAll: jest.fn().mockResolvedValue([{ _id: '1', username: 'test' }]),
  findOneById: jest.fn().mockResolvedValue({ _id: '1', username: 'test' }),
  findOne: jest.fn().mockResolvedValue({ _id: '1', username: 'test' }),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUserModel = {
    findOne: jest.fn().mockResolvedValue({ _id: '1', username: 'test' }),
    findById: jest.fn().mockResolvedValue({ _id: '1', username: 'test' }),
    save: jest.fn().mockResolvedValue({
      _id: '1',
      username: 'test',
      password: 'hashedPassword',
    }),
    find: jest.fn().mockResolvedValue([{ _id: '1', username: 'test' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('mockedToken') },
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('POST /users/signup', () => {
    it('should sign up a user', async () => {
      const signUpDto: SignUpUserDto = {
        username: 'test',
        password: 'password123',
      };
      await expect(usersController.signUp(signUpDto)).rejects.toThrowError(
        'Username test taken, please use another one',
      );
      expect(usersService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });

  describe('POST /users/login', () => {
    it('should log in a user', async () => {
      const loginDto: LoginUserDto = {
        username: 'test',
        password: 'password123',
      };
      const result = await usersController.login(loginDto);
      expect(result).toEqual({ accessToken: 'mockedToken' });
      expect(usersService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('GET /users/list', () => {
    it('should return all users', async () => {
      const result = await usersController.getAllUsers();
      expect(result).toEqual([{ _id: '1', username: 'test' }]);
      expect(usersService.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const result = await usersController.getUserById('1');
      expect(result).toEqual({ _id: '1', username: 'test' });
      expect(usersService.findOneById).toHaveBeenCalledWith('1');
    });
  });

  describe('GET /users/username/:username', () => {
    it('should return a user by username', async () => {
      const result = await usersController.getUserByUsername('test');
      expect(result).toEqual({ _id: '1', username: 'test' });
      expect(usersService.findOne).toHaveBeenCalledWith('test');
    });
  });
});
