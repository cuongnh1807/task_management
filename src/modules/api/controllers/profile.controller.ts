import {
  Controller,
  Get,
  UseGuards,
  Request,
  HttpStatus,
  Body,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationService, UserService } from '../services';
import { JwtAuthGuard } from '@/api/guards/jwt-auth.guard';
import { UpdateProfileDto } from '@/api/dtos/profile.dto';
import { UpdateProfileValidatePipe } from '../validations/update-profile.validation';
import { PaginateDto } from '@/shared/pagination/paginate.dto';
import { HttpCacheInterceptor } from '../cache';

@ApiTags('Profile')
@Controller('profile')
@ApiBearerAuth()
export class ProfileController {
  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

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

  @Get('notifications')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async getListNotification(
    @Request() req: any,
    @Query() filter: PaginateDto,
  ) {
    const result = await this.notificationService.getListNotifications({
      ...filter,
      user_ids: [req.user.sub],
    });
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }

  @Get('unread-notifications')
  @UseInterceptors(HttpCacheInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async getUnreadNotification(@Request() req: any) {
    const result = await this.userService.countUnreadNotification(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
  @Put('read-all-notifications')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async readAllNotifications(@Request() req: any) {
    await this.userService.markReadAllNotification(req.user.id);
    return {
      statusCode: HttpStatus.OK,
      data: true,
    };
  }
}
