import { NestFactory } from '@nestjs/core'
import { NotFoundExceptionFilter } from 'src/core/filters/NotFoundExceptionFilter'
import { ValidationExceptionFilter } from 'src/core/filters/ValidationExceptionFilter'
import { ClassValidatorValidationPipe } from 'src/core/pipes/ClassValidatorValidationPipe'
import { AppModule } from './AppModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new NotFoundExceptionFilter()
  )

  app.useGlobalPipes(new ClassValidatorValidationPipe())

  await app.listen(3000)
}

bootstrap()
