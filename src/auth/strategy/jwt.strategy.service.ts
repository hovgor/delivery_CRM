import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  public async validate(req: Request, payload: any) {
    if (
      req.headers &&
      req.headers['Authorization'].split(' ')[0] === 'Bearer'
    ) {
      const user = await this.authService.validateUser(
        payload,
        req.headers['Authorization'].split(' ')[1],
      );
      if (user) {
        return user;
      }
    }
    throw new UnauthorizedException();
  }
}
