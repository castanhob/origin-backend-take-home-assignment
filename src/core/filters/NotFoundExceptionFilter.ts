import { HttpResult } from '@core/global/HttpResult'
import { Catch, ExceptionFilter, ArgumentsHost, NotFoundException } from '@nestjs/common'
import { Response } from 'express'

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    return HttpResult.NOT_FOUND(response, [exception.message])
  }
}
