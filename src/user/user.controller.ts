import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Post('signup')
  signup(@Body() user: UserDTO) {
    const res = this._userService.signup(user);
    return res;
  }
}
