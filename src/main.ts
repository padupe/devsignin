import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // Configuração para que as validações sejam executadas através do 'class-validator'
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
}
bootstrap()
