export class ValidationException extends Error {
  public readonly message: any

  constructor(error: { [key: string]: string | string[] }) {
    super()
    this.message = error
    this.name = 'ValidationException'
    Error.captureStackTrace(this, ValidationException)
  }
}
