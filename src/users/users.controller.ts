import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginUserDto, SignUpUserDto } from './dto/users.dto';
import { Public } from 'src/utils/public.guard';

@Controller({
  path: 'users',
  version: 'v1',
})
export class UsersController {
  constructor(private readonly _userService: UsersService) {}

  @Public()
  @Post('/signup')
  async signUp(@Body() signUpUserDto: SignUpUserDto) {
    return await this._userService.signUp(signUpUserDto);
  }

  @Public()
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this._userService.login(loginUserDto);
  }

  @Get('/list')
  async getAllUsers() {
    return await this._userService.findAll();
  }

  @Get('/:id')
  async getUserById(@Param('id') userId: string) {
    return await this._userService.findOneById(userId);
  }

  @Get('/username/:username')
  async getUserByUsername(@Param('username') username: string) {
    return await this._userService.findOne(username);
  }
}
