import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { randomUUID } from 'crypto';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { MailerService } from 'src/common/services/mail.service';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
    private i18n: I18nService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
    language: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email } = signUpDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException(
        this.i18n.t('errors.auth.emailTaken', { lang: language }),
      );
    }

    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    const user = await this.userModel.create({
      _id: randomUUID(),
      ...signUpDto,
      password: hashedPassword,
    });

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = await this.generateRefreshToken(user._id);
    return { accessToken, refreshToken };
  }

  async login(
    loginDto: LoginDto,
    language: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        this.i18n.t('errors.auth.invalidCredentials', { lang: language }),
      );
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = await this.generateRefreshToken(user._id);
    return { accessToken, refreshToken };
  }

  async refreshToken(userId: string, refreshToken: string, language: string) {
    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        this.i18n.t('errors.auth.invalidRefreshToken', { lang: language }),
      );
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        this.i18n.t('errors.auth.invalidRefreshToken', { lang: language }),
      );
    }
    const accessToken = this.generateAccessToken(user._id);
    const newRefreshToken = await this.generateRefreshToken(user._id);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async generateRefreshToken(userId: string) {
    const secret = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRES');
    const refreshToken = this.jwtService.sign(
      { id: userId },
      { secret, expiresIn },
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
    return refreshToken;
  }

  generateAccessToken(userId: string) {
    const secret = this.configService.get('JWT_SECRET');
    const expiresIn = this.configService.get('JWT_EXPIRES');
    return this.jwtService.sign({ id: userId }, { secret, expiresIn });
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }

  async requestPasswordReset(email: string, language: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('errors.auth.userNotFound', { lang: language }),
      );
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000),
    });
    const resetUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/auth/reset-password?token=${hashedToken}`;
    const subject = 'Password Reset';
    const text = `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;
    const html = `<p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p><p>Please click on the following link, or paste this into your browser to complete the process:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`;

    await this.mailerService.sendMail(user.email, subject, text, html);
    return { message: 'Password reset email sent' };
  }

  async resetPassword(dto: ResetPasswordDto, language: string) {
    const { token, password, confirmPassword } = dto;
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
    });
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException(
        this.i18n.t('errors.auth.invalidPasswordResetToken', {
          lang: language,
        }),
      );
    }
    if (password !== confirmPassword) {
      throw new BadRequestException(
        this.i18n.t('errors.auth.passwordsDoNotMatch', { lang: language }),
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = await this.generateRefreshToken(user._id);
    return { accessToken, refreshToken };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    language: string,
  ) {
    const { oldPassword, newPassword, confirmPassword } = dto;
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('errors.auth.userNotFound', { lang: language }),
      );
    }
    const oldPasswordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!oldPasswordMatches) {
      throw new UnauthorizedException(
        this.i18n.t('errors.auth.invalidOldPassword', { lang: language }),
      );
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        this.i18n.t('errors.auth.passwordsDoNotMatch', { lang: language }),
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = await this.generateRefreshToken(user._id);
    return { accessToken, refreshToken };
  }
}
