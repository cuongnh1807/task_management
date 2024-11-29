import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from '@/api/services';
import { JwtAuthGuard } from '@/api/guards/jwt-auth.guard';
import { GetUserDto } from '@/api/dtos/user.dto';
import { HttpCacheInterceptor } from '../cache';

@Controller('users')
@ApiTags('Members')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  @UseInterceptors(HttpCacheInterceptor)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async getAllMembers(@Request() req: any, @Query() query: GetUserDto) {
    const result = await this.userService.getAllUsers(query);
    return {
      statusCode: HttpStatus.OK,
      data: result,
    };
  }
}
