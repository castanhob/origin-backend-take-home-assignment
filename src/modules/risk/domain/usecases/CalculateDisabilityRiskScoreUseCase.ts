import { Injectable } from '@nestjs/common'
import { MaritalStatusEnum } from '@risk/domain/contracts/enum/MaritalStatusEnum'
import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'

@Injectable()
export class CalculateDisabilityRiskScoreUseCase {
  execute(
    baseScore: number,
    {
      age,
      dependents,
      house,
      income,
      marital_status
    }: CalculateRiskProfileRequest
  ): RiskScoreEnum {
    if (income === 0 || age > 60) {
      return RiskScoreEnum.INELIGIBLE
    }

    let score = baseScore

    if (age < 30) {
      score -= 2
    } else if (age >= 30 && age <= 40) {
      score--
    }

    if (income >= 200000) {
      score--
    }

    if (house?.ownership_status === OwnershipStatusEnum.MORTGAGED) {
      score++
    }

    if (dependents > 0) {
      score++
    }

    if (marital_status === MaritalStatusEnum.MARRIED) {
      score--
    }

    if (score <= 0) {
      return RiskScoreEnum.ECONOMIC
    } else if (score >= 1 && score <= 2) {
      return RiskScoreEnum.REGULAR
    } else if (score >= 3) {
      return RiskScoreEnum.RESPONSIBLE
    } else {
      return RiskScoreEnum.INELIGIBLE
    }
  }
}
