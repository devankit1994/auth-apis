import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginDTO, SignupDTO } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<User>,
    private _jwtService: JwtService,
  ) {}

  async signup(user: SignupDTO) {
    const { name, email } = user;

    // Check if user already exists
    const existingUser = await this._userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPwd = await bcrypt.hash(user.password, salt);

    // Create new user
    const newUser = new this._userModel({
      name,
      email,
      password: hashedPwd,
    });

    try {
      await newUser.save();
      return newUser;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Signup Failed', e);
    }
  }

  async login(loginCredentials: LoginDTO) {
    // Find User in DB
    const user = await this._userModel.findOne({
      email: loginCredentials.email,
    });
    if (!user) {
      throw new NotFoundException("You don't have a account!");
    }

    // Match password
    const doesPasswordMatch = await bcrypt.compare(
      loginCredentials.password,
      user.password,
    );

    if (!doesPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    return { token: this._jwtService.sign({ email: loginCredentials.email }) };
  }
}
