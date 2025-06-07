import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterParentDto } from './dto/register-parent.dto';
import { LoginParentDto } from './dto/login-parent.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; role?: string }) {
    const role = body.role || 'student';
    return this.authService.register(body.email, body.password, role);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('register-parent')
  async registerParent(@Body() body: RegisterParentDto) {
    return this.authService.registerParent(body);
  }

  @Post('login-parent')
  async loginParent(@Body() body: { email: string; password: string }) {
    return this.authService.loginParent(body.email, body.password);
  }
}
