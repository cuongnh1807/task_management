import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { RealtimeService } from './services/realtime.service';

@Module({
  imports: [],
  providers: [NotificationGateway, RealtimeService],
  exports: [NotificationGateway, RealtimeService],
})
export class GatewayModule {}
