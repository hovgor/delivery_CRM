import { IoAdapter } from '@nestjs/platform-socket.io';
import { IncomingMessage, ServerResponse } from 'http';
import { INestApplicationContext } from '@nestjs/common';

export class WsAdapter extends IoAdapter {
  private serverOptions = {
    handlePreflightRequest: (
      req: IncomingMessage,
      res: ServerResponse,
    ): void => {
      const headers = {
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, Accept-Language, Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials': 'true',
      };

      const origin = req.headers.origin;
      if (this.allowedOrigins.includes(origin as string)) {
        headers['Access-Control-Allow-Origin'] = origin as string;
      }

      res.writeHead(200, headers);
      res.end();
    },
  };

  constructor(
    app: INestApplicationContext,
    private readonly allowedOrigins: string[],
  ) {
    super(app);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public createIOServer(port: number, _options?: any): any {
    const server = super.createIOServer(port, this.serverOptions);
    return server;
  }
}
