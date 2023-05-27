import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  authenticate(req: any, options?: any) {
    if (req.user) {
      this.success(req.user);
    } else {
      super.authenticate(req, options);
    }
  }

  async validate(payload: any) {
    // return await this.authService.signIn(payload.sub);
    return await this.authService.getUserById(payload.sub);
  }
}
