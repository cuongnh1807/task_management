import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  Body,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '../services';
import { JwtAuthGuard } from '@/api/guards/jwt-auth.guard';
import { UpdateProfileDto } from '@/api/dtos/profile.dto';
import { UpdateProfileValidatePipe } from '../validations/update-profile.validation';

@ApiTags('Profile')
@Controller('profile')
@ApiBearerAuth()
export class ProfileController {
  constructor(private userService: UserService) {}

  @Get('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async getProfile(@Request() req: any) {
    const user = await this.userService.getProfileById(req.user.sub);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Put('')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async updateProfile(
    @Request() req: any,
    @Body(UpdateProfileValidatePipe) data: UpdateProfileDto,
  ) {
    const newUser = await this.userService.updateProfile(req.user.sub, data);
    return {
      statusCode: HttpStatus.OK,
      data: newUser,
    };
  }
}
