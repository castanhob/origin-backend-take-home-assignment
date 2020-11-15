import { ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { ValidationException } from 'src/core/exceptions/ValidationException'

export class ClassValidatorValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        throw new ValidationException(
          this.mapValidationErrorsToStringArray(errors)
        )
      }
    })
  }

  private mapValidationErrorsToStringArray = (
    errors: ValidationError[]
  ): { [key: string]: string[] } => {
    const mappedErrors: { [key: string]: string[] } = errors.reduce(
      (acc: { [key: string]: string[] }, err: ValidationError) => {
        if (err.children && err.children.length) {
          const childrenErros: {
            [key: string]: string[]
          } = this.mapValidationErrorsToStringArray(err.children)

          return { ...acc, ...childrenErros }
        }

        if (err.constraints) {
          return { ...acc, [err.property]: Object.values(err.constraints) }
        }

        return acc
      },
      {}
    )

    return mappedErrors
  }
}
