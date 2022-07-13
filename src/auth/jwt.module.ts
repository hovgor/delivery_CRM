// Packages
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Providers
import { JWTConfigService } from '../config/jwt.config.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useExisting: JWTConfigService,
    }),
  ],
  exports: [JwtModule],
})
export class JWTModule {}
