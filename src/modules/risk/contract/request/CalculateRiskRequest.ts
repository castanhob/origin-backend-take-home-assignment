import { Type } from 'class-transformer'
import {
  IsDefined,
  IsEnum,
  IsIn,
  IsInstance,
  IsInt,
  IsNumber,
  Min,
  ValidateNested
} from 'class-validator'
import { IsArrayWithExactElements } from 'src/core/decorators/IsArrayWithExactElements'
import { MartialStatusEnum } from 'src/modules/risk/contract/enum/MartialStatusEnum'
import { OwnershipStatusEnum } from 'src/modules/risk/contract/enum/OwnershipStatusEnum'

class House {
  @IsDefined()
  @IsEnum(OwnershipStatusEnum, {
    message: `$property must be a valid enum value (${OwnershipStatusEnum.MORTGAGED}, ${OwnershipStatusEnum.OWNED}})`
  })
  ownership_status: OwnershipStatusEnum
}

class Vehicle {
  @IsDefined()
  @IsInt()
  @Min(1900)
  year: number
}

export class CalculateRiskRequest {
  @IsDefined()
  @IsInt()
  @Min(0)
  age: number

  @IsDefined()
  @IsInt()
  @Min(0)
  dependents: number

  @ValidateNested()
  @IsInstance(House)
  @Type(() => House)
  house: House

  @IsDefined()
  @IsInt()
  @Min(0)
  income: number

  @IsDefined()
  @IsEnum(MartialStatusEnum, {
    message: `$propertyName must be a valid enum value (${MartialStatusEnum.MARRIED}, ${MartialStatusEnum.SINGLE}})`
  })
  martial_status: MartialStatusEnum

  @IsDefined()
  @IsNumber({}, { each: true })
  @IsIn([0, 1, 2], { each: true })
  @IsArrayWithExactElements(3, {
    message: `$property must be a valid array with exactly $constraint1 elements`
  })
  risk_questions: number[]

  @ValidateNested()
  @IsInstance(Vehicle)
  @Type(() => Vehicle)
  vehicle: Vehicle
}
