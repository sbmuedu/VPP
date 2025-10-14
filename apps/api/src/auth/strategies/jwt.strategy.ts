import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // Retrieve the secret from the configuration service
    const jwtSecret = configService.get<string>('JWT_SECRET');

    // Fail fast if the secret is not defined
    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT_SECRET environment variable is not defined.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Now we are passing a guaranteed string
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: any) {
    // This payload is already verified by the strategy
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}