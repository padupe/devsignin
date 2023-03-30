import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { SigninDTO } from './dtos/sigin.dto'
import { SignupDTO } from './dtos/signup.dto'
import { User } from './models/users.model'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  public async signup(@Body() signupDTO: SignupDTO): Promise<User> {
    return this.usersService.signup(signupDTO)
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  public async signin(
    @Body() signinDTO: SigninDTO,
  ): Promise<{ name: string; email: string; jwtToken: string }> {
    return this.usersService.signin(signinDTO)
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    const listUsers = await this.usersService.findAll()
    const users = listUsers.map((user) => {
      user.password = undefined
      return user
    })

    return users
  }
}
