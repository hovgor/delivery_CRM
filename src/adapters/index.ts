import { INestApplication } from '@nestjs/common';
import { ConfigEnum } from '../config/config.enum';
import { ConfigService } from '../config/config.service';
import { WsAdapter } from './ws.adapter';

export function useAdapters(app: INestApplication): void {
  const ALLOWED_ORIGINS = app
    .get(ConfigService)
    .get(ConfigEnum.ALLOWED_ORIGINS);

  app.useWebSocketAdapter(new WsAdapter(app, ALLOWED_ORIGINS));
}
