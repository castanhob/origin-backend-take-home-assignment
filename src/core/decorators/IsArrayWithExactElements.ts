import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

export const IsArrayWithExactElements = (elementCount: number, validationOptions?: ValidationOptions) => {
  return (object: any, propertyName: string) =>
    registerDecorator({
      name: `isArrayWithExactElements`,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [elementCount],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const elementCount = args.constraints[0]
          return Array.isArray(value) && value.length === elementCount
        }
      }
    })
}
