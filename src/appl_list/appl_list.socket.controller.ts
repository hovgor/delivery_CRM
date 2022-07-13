import { UnauthorizedException } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { TasksService } from '../tasks/tasks.service';
import { ApplListService } from './appl_list.service';

@WebSocketGateway({
  namespace: 'tasks',
})
export default class TasksSocketController implements OnGatewayConnection {
  @WebSocketServer()
  public readonly server: any;

  constructor(
    private readonly authService: AuthService,
    private readonly tasksService: TasksService,
    private readonly appListService: ApplListService,
  ) {}
  public async handleConnection(socket: Socket) {
    try {
      if (socket.handshake.headers['authorization']) {
        const token = (socket.handshake.headers['authorization'] + '').split(
          ' ',
        )[1];
        const payload = this.authService.decodeToken(token);
        const user = await this.authService.validateUser(payload, token);
        if (!(await this.authService.userRoleOut(user))) {
          throw new UnauthorizedException('User is not unauthorized!!!');
        }
        socket.emit('list', await this.appListService.getAllApplicationLists());
      } else {
        const error = new UnauthorizedException('User is not authorized!!!');
        socket.emit('exception', error);
        return socket.disconnect();
      }
    } catch (error) {
      throw error;
    }
  }
}
