import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model } from 'mongoose'
import { AuthService } from 'src/auth/auth.service'
import { SigninDTO } from './dtos/sigin.dto'
import { SignupDTO } from './dtos/signup.dto'
import { User } from './models/users.model'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
    private readonly authService: AuthService,
  ) {}

  public async signup(signupDTO: SignupDTO): Promise<User> {
    const validateEmail = await this.findByEmail(signupDTO.email)

    if (validateEmail) {
      throw new BadRequestException(
        `User with email ${signupDTO.email} already exists!`,
      )
    }

    const user = new this.usersModel(signupDTO)
    return user.save()
  }

  public async signin(
    signinDTO: SigninDTO,
  ): Promise<{ name: string; email: string; jwtToken: string }> {
    const user = await this.findByEmail(signinDTO.email)

    if (!user) {
      throw new UnauthorizedException('Username or password is invalid!')
    }

    const password = await this.checkPassword(signinDTO.password, user)

    if (password === false) {
      throw new UnauthorizedException('Username or password is invalid!')
    }

    const jwtToken = await this.authService.createAccessToken(user._id)

    return {
      name: user.name,
      email: user.email,
      jwtToken,
    }
  }

  public async findAll(): Promise<User[]> {
    return await this.usersModel.find()
  }

  private async findByEmail(email: string): Promise<User> {
    return await this.usersModel.findOne({ email })
  }

  private async checkPassword(password: string, user: User): Promise<boolean> {
    const match = await bcrypt.compare(password, user.password)

    return match
  }
}
