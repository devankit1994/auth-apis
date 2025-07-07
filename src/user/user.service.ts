import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserDTO } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private _userModel: Model<User>) {}

  async signup(user: UserDTO) {
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
}
