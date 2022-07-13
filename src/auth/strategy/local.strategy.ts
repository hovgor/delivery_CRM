import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { IJwtPayload } from '../jwt.payload.interface';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(payload: IJwtPayload, token: string): Promise<any> {
    const user = await this.authService.validateUser(payload, token);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
