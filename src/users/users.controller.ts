import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto, SignUpUserDto } from './dto/users.dto';
import { Public } from 'src/utils/public.guard';
import { User } from './models/users.model';

@Controller({
  path: 'users',
  version: 'v1',
})
export class UsersController {
  constructor(private readonly _userService: UsersService) {}

  @Public()
  @Post('/signup')
  async signUp(
    @Body() signUpUserDto: SignUpUserDto,
  ): Promise<Omit<User, 'password'>> {
    return await this._userService.signUp(signUpUserDto);
  }

  @Public()
  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ accessToken: string }> {
    return await this._userService.login(loginUserDto);
  }

  @Get('/list')
  async getAllUsers(): Promise<User[]> {
    return await this._userService.findAll();
  }

  @Get('/:id')
  async getUserById(@Param('id') userId: string): Promise<User | undefined> {
    return await this._userService.findOneById(userId);
  }

  @Get('/username/:username')
  async getUserByUsername(
    @Param('username') username: string,
  ): Promise<User | undefined> {
    return await this._userService.findOne(username);
  }
}
