import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './models/users.model';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { saltRounds } from 'src/constants';
import { SignUpUserDto, LoginUserDto } from './dto/users.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly _userModel: Model<User>,
    private _jwtService: JwtService,
  ) {}

  async signUp(signUpUserDto: SignUpUserDto) {
    // check for duplication
    const { username, password } = signUpUserDto;
    const duplicatedUser = await this.findOne(username);

    if (duplicatedUser) {
      throw new ConflictException(
        `Username ${username} taken, please use another one`,
      );
    }

    // Password validation (example: minimum length)
    if (password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 6 characters long',
      );
    }

    // create the user
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new this._userModel({
      username,
      password: hash,
    });

    try {
      const savedUser = await newUser.save();
      const { password: pass, ...result } = savedUser.toObject();

      return result;
    } catch (error) {
      console.log('error >> ', error.message);
      throw new InternalServerErrorException(
        `Error creating user, please try again`,
      );
    }
  }

  async login(loginDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { username, password } = loginDto;
    const foundUser = await this._userModel.findOne({ username });

    if (!foundUser) {
      throw new NotFoundException(`User ${username} not found`);
    }

    // check if password matches
    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      throw new UnauthorizedException(`username or password is incorrect`);
    }

    const payload = {
      sub: foundUser._id,
      username: foundUser.username,
    };

    return {
      accessToken: await this._jwtService.signAsync(payload),
    };
  }

  async findOneById(userId: string): Promise<User | undefined> {
    return await this._userModel.findById(userId).lean();
  }

  async findOne(username: string): Promise<User | undefined> {
    return await this._userModel.findOne({ username }).lean();
  }

  async findAll(): Promise<User[]> {
    return await this._userModel.find({});
  }
}
