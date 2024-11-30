import {
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotificationService } from '../services';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('notifications')
@ApiTags('Notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  public async readNotification(
    @Request() req: any,
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    await this.notificationService.readNotification(id, req.user.sub);
    return {
      statusCode: HttpStatus.OK,
      data: true,
    };
  }
}
