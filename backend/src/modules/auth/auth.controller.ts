import { Language } from '@decorators/language.decorator';
import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto, @Language() lang: string) {
    return this.authService.signUp(signUpDto, lang);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Language() lang: string) {
    return this.authService.login(loginDto, lang);
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
    @Language() lang: string,
  ) {
    return this.authService.refreshToken(user._id, refreshToken, lang);
  }

  @Post('request-password-reset')
  requestPasswordReset(@Body('email') email: string, @Language() lang: string) {
    return this.authService.requestPasswordReset(email, lang);
  }

  @Post('reset-password')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Language() lang: string,
  ) {
    return this.authService.resetPassword(resetPasswordDto, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
    @Language() lang: string,
  ) {
    return this.authService.changePassword(user._id, changePasswordDto, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-verification')
  requestVerification(@GetUser() user: User, @Language() lang: string) {
    return this.authService.requestEmailVerification(user._id, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  verifyEmail(
    @GetUser() user: User,
    @Body() verifyEmailDto: VerifyEmailDto,
    @Language() lang: string,
  ) {
    return this.authService.verifyEmail(user._id, verifyEmailDto.code, lang);
  }

  @UseGuards(JwtAuthGuard)
  @Get('email-verification-status')
  async getEmailVerificationStatus(@GetUser() user: User) {
    return { isVerified: user.isEmailVerified };
  }
}
