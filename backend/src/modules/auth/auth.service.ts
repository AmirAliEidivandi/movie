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
    lang: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email } = signUpDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException(
        this.i18n.t('translation.errors.auth.emailTaken', { lang }),
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
    lang: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { emailOrUsername, password } = loginDto;
    const user = await this.userModel.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        this.i18n.t('translation.errors.auth.invalidCredentials', { lang }),
      );
    }

    const accessToken = this.generateAccessToken(user._id);
    const refreshToken = await this.generateRefreshToken(user._id);
    return { accessToken, refreshToken };
  }

  async refreshToken(userId: string, refreshToken: string, lang: string) {
    const user = await this.userModel.findOne({
      _id: userId,
    });
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException(
        this.i18n.t('translation.errors.auth.invalidRefreshToken', { lang }),
      );
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) {
      throw new UnauthorizedException(
        this.i18n.t('translation.errors.auth.invalidRefreshToken', { lang }),
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

  async requestPasswordReset(email: string, lang: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('translation.errors.auth.userNotFound', { lang }),
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
    )}/reset-password?token=${hashedToken}`;
    const subject = this.i18n.t('translation.emails.passwordReset.subject', {
      lang,
    });
    const text = this.i18n.t('translation.emails.passwordReset.text', {
      lang,
      args: { url: resetUrl },
    });
    const html = this.i18n.t('translation.emails.passwordReset.html', {
      lang,
      args: { url: resetUrl },
    });

    await this.mailerService.sendMail(user.email, subject, text, html);
    return {
      message: this.i18n.t('translation.emails.passwordReset.sent', { lang }),
    };
  }

  async resetPassword(dto: ResetPasswordDto, lang: string) {
    const { token, password, confirmPassword } = dto;
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
    });
    if (!user || user.resetPasswordExpires < new Date()) {
      throw new UnauthorizedException(
        this.i18n.t('translation.errors.auth.invalidPasswordResetToken', {
          lang,
        }),
      );
    }
    if (password !== confirmPassword) {
      throw new BadRequestException(
        this.i18n.t('translation.errors.auth.passwordsDoNotMatch', { lang }),
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
    return {
      message: this.i18n.t('translation.emails.passwordReset.resetSuccess', {
        lang,
      }),
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto, lang: string) {
    const { oldPassword, newPassword, confirmPassword } = dto;
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('translation.errors.auth.userNotFound', { lang }),
      );
    }
    const oldPasswordMatches = await bcrypt.compare(oldPassword, user.password);
    if (!oldPasswordMatches) {
      throw new UnauthorizedException(
        this.i18n.t('translation.errors.auth.invalidOldPassword', { lang }),
      );
    }
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        this.i18n.t('translation.errors.auth.passwordsDoNotMatch', { lang }),
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

  async requestEmailVerification(userId: string, lang: string) {
    console.log(lang);
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('translation.errors.auth.userNotFound', { lang }),
      );
    }

    if (user.isEmailVerified) {
      throw new BadRequestException(
        this.i18n.t('translation.errors.auth.emailAlreadyVerified', { lang }),
      );
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationCodeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.userModel.findByIdAndUpdate(user._id, {
      verificationCode,
      verificationCodeExpires,
    });

    const subject = this.i18n.t('translation.emails.verificationCode.subject', {
      lang,
    });
    const text = this.i18n.t('translation.emails.verificationCode.text', {
      lang,
      args: { code: verificationCode },
    });
    const html = this.i18n.t('translation.emails.verificationCode.html', {
      lang,
      args: { code: verificationCode },
    });

    await this.mailerService.sendMail(user.email, subject, text, html);
    return { message: 'Verification code sent' };
  }

  async verifyEmail(userId: string, code: string, lang: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('translation.errors.auth.userNotFound', { lang }),
      );
    }

    if (user.isEmailVerified) {
      throw new BadRequestException(
        this.i18n.t('translation.errors.auth.emailAlreadyVerified', { lang }),
      );
    }

    if (
      !user.verificationCode ||
      user.verificationCode !== code ||
      !user.verificationCodeExpires ||
      user.verificationCodeExpires < new Date()
    ) {
      throw new UnauthorizedException(
        this.i18n.t('translation.errors.auth.invalidVerificationCode', {
          lang,
        }),
      );
    }

    await this.userModel.findByIdAndUpdate(userId, {
      isEmailVerified: true,
      verificationCode: null,
      verificationCodeExpires: null,
    });

    return {
      message: this.i18n.t('translation.emails.verificationCode.verified', {
        lang,
      }),
    };
  }
}
