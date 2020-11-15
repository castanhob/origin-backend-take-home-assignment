import { HttpStatus } from '@nestjs/common'
import { Response } from 'express'

export class HttpResult<T> {
  constructor(
    readonly statusCode: HttpStatus,
    readonly errors: string[],
    readonly data: T
  ) {}

  static OK = <T>(res: Response, data: T): Response => {
    return res
      .status(HttpStatus.OK)
      .json(new HttpResult(HttpStatus.OK, [], data))
  }

  static NOT_FOUND = (res: Response, errors: string[]): Response => {
    return res
      .status(HttpStatus.CREATED)
      .json(new HttpResult(HttpStatus.NOT_FOUND, errors, {}))
  }

  static BAD_REQUEST = (res: Response, errors: string[]): Response => {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json(new HttpResult(HttpStatus.BAD_REQUEST, errors, {}))
  }
}
