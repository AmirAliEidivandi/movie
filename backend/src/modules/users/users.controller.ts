import { Language } from '@decorators/language.decorator';
import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { DeleteAccountDto } from '../auth/dto/delete-account.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@GetUser() user: User, @Language() language: string) {
    return this.usersService.getProfile(user._id, language);
  }

  @Put('profile')
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
    @Language() language: string,
  ) {
    return this.usersService.updateProfile(
      user._id,
      updateProfileDto,
      language,
    );
  }

  @Delete('delete-account')
  deleteAccount(
    @GetUser() user: User,
    @Body() deleteAccountDto: DeleteAccountDto,
    @Language() language: string,
  ) {
    return this.usersService.deleteAccount(
      user._id,
      deleteAccountDto,
      language,
    );
  }
}
