import { IsArrayWithExactElements } from '@core/decorators/IsArrayWithExactElements'
import { MaritalStatusEnum } from '@risk/domain/contracts/enum/MaritalStatusEnum'
import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { Type } from 'class-transformer'
import { IsDefined, IsEnum, IsIn, IsInstance, IsInt, IsOptional, Min, ValidateNested } from 'class-validator'
import 'reflect-metadata'

class House {
  @IsDefined()
  @IsEnum(OwnershipStatusEnum, {
    message: `$property must be a valid enum value (${OwnershipStatusEnum.MORTGAGED}, ${OwnershipStatusEnum.OWNED}, ${OwnershipStatusEnum.RENTED}})`
  })
  ownership_status: OwnershipStatusEnum
}

class Vehicle {
  @IsDefined()
  @IsInt()
  @Min(1900)
  year: number
}

export class CalculateRiskProfileRequest {
  @IsDefined()
  @IsInt()
  @Min(0)
  age: number

  @IsDefined()
  @IsInt()
  @Min(0)
  dependents: number

  @IsDefined()
  @IsInt()
  @Min(0)
  income: number

  @IsDefined()
  @IsEnum(MaritalStatusEnum, {
    message: `$propertyName must be a valid enum value (${MaritalStatusEnum.MARRIED}, ${MaritalStatusEnum.SINGLE}})`
  })
  marital_status: MaritalStatusEnum

  @IsDefined()
  @IsInt({ each: true })
  @IsIn([0, 1, true, false], { each: true })
  @Type(() => Number)
  @IsArrayWithExactElements(3, {
    message: `$property must be a valid array with exactly $constraint1 elements`
  })
  risk_questions: number[]

  @IsOptional()
  @ValidateNested()
  @IsInstance(House)
  @Type(() => House)
  house?: House

  @IsOptional()
  @ValidateNested()
  @IsInstance(Vehicle)
  @Type(() => Vehicle)
  vehicle?: Vehicle
}
