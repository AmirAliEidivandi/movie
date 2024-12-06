import { Language } from '@decorators/language.decorator';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/signup.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto, @Language() language: string) {
    return this.authService.signUp(signUpDto, language);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Language() language: string) {
    return this.authService.login(loginDto, language);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@GetUser() user: User) {
    return this.authService.logout(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  refreshToken(
    @GetUser() user: User,
    @Body('refreshToken') refreshToken: string,
    @Language() language: string,
  ) {
    return this.authService.refreshToken(user._id, refreshToken, language);
  }

  @Post('request-password-reset')
  requestPasswordReset(
    @Body('email') email: string,
    @Language() language: string,
  ) {
    return this.authService.requestPasswordReset(email, language);
  }

  @Post('reset-password')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Language() language: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, language);
  }

  @Post('change-password')
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
    @Language() language: string,
  ) {
    return this.authService.changePassword(
      user._id,
      changePasswordDto,
      language,
    );
  }
}
