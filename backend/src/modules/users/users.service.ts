import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { DeleteAccountDto } from '../auth/dto/delete-account.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private i18n: I18nService,
  ) {}

  async getProfile(userId: string, language: string): Promise<User> {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('errors.user.notFound', { lang: language }),
      );
    }
    return user;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    language: string,
  ): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updateProfileDto, { new: true })
      .select('-password');

    if (!updatedUser) {
      throw new NotFoundException(
        this.i18n.t('errors.user.notFound', { lang: language }),
      );
    }

    return updatedUser;
  }

  async deleteAccount(
    userId: string,
    deleteAccountDto: DeleteAccountDto,
    lang: string,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        this.i18n.t('errors.user.notFound', { lang }),
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      deleteAccountDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        this.i18n.t('errors.auth.invalidOldPassword', { lang }),
      );
    }

    const deleted = await this.userModel.findByIdAndDelete(userId);
    if (!deleted) {
      throw new NotFoundException(
        this.i18n.t('errors.user.deleteFailed', { lang }),
      );
    }
  }
}
