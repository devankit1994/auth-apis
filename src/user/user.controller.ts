import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDTO, SignupDTO } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Post('signup')
  signup(@Body() user: SignupDTO) {
    const res = this._userService.signup(user);
    return res;
  }

  @Post('login')
  login(@Body() user: LoginDTO) {
    const res = this._userService.login(user);
    return res;
  }
}
