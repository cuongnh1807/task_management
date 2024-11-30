import { Module } from '@nestjs/common';
import { ApiModule } from '@/api';
import { GatewayModule } from 'modules/socket-gateway/socket-gateway.module';

const isApi = Boolean(Number(process.env.IS_API || 0));

let _modules = [];
if (isApi) {
  _modules = [..._modules, ApiModule, GatewayModule];
}

@Module({
  imports: [..._modules],
  providers: [],
})
export class AppModule {}
