import { ValidationException } from '@core/exceptions/ValidationException'
import { HttpResult } from '@core/global/HttpResult'
import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { Response } from 'express'

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    return HttpResult.BAD_REQUEST(response, exception.message)
  }
}
