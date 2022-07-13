import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class HashPassword {
  constructor(private readonly configService: ConfigService) {}
  async PasswordHash(password: string) {
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      return hash;
    } catch (error) {
      throw new ForbiddenException('Password heshing is wrong!!!');
    }
  }
  async IsMutchPassword(password: string, passwordHash: string) {
    try {
      const salt = await bcrypt.genSalt();
      const isMatch = await bcrypt.compare(password, passwordHash);
      return isMatch;
    } catch (error) {
      throw new ForbiddenException('Password heshing is not match!!!');
    }
  }
}
