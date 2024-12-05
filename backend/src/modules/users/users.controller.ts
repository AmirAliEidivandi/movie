import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
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
  getProfile(@GetUser() user: User) {
    return this.usersService.getProfile(user._id);
  }

  @Put('profile')
  updateProfile(
    @GetUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user._id, updateProfileDto);
  }
}
