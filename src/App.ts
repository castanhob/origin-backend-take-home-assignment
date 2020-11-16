import { NotFoundExceptionFilter } from '@core/filters/NotFoundExceptionFilter'
import { ValidationExceptionFilter } from '@core/filters/ValidationExceptionFilter'
import { ClassValidatorValidationPipe } from '@core/pipes/ClassValidatorValidationPipe'
import { NestFactory } from '@nestjs/core'
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
