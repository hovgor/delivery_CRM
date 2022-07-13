import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { IJwtPayload } from '../jwt.payload.interface';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(payload: IJwtPayload, token: string): Promise<any> {
    const result = await this.authService.validateUser(payload, token);
    if (!result.user) {
      throw new UnprocessableEntityException({
        message: result.message,
      });
    }
    return result.user;
  }
}
