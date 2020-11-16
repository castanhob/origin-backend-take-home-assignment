import { Injectable } from '@nestjs/common'
import { OwnershipStatusEnum } from 'src/modules/risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from 'src/modules/risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from 'src/modules/risk/domain/contracts/request/CalculateRiskProfileRequest'

@Injectable()
export class CalculateHomeRiskScoreUseCase {
  execute(
    baseScore: number,
    { house, age, income }: CalculateRiskProfileRequest
  ): RiskScoreEnum {
    if (!house) {
      return RiskScoreEnum.INELIGIBLE
    }

    let score = baseScore

    if (age < 30) {
      score -= 2
    } else if (age >= 30 && age <= 40) {
      score--
    }

    if (income > 200000) {
      score--
    }

    if (house.ownership_status === OwnershipStatusEnum.MORTGAGED) {
      score++
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
