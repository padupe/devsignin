import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { JwtPayload } from '../models/jwt-payload.model'
import { Strategy } from 'passport-jwt'
import { AuthService } from '../auth.service'
import { User } from 'src/users/models/users.model'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: authService.returnJwtExtrator(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(jwtPayload: JwtPayload): Promise<User> {
    return this.authService.validateUser(jwtPayload)
  }
}
