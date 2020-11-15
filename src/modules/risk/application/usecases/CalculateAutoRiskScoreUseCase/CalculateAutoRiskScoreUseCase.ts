import { Injectable } from '@nestjs/common'
import { DateUtils } from 'src/core/utils/DateUtil'
import { RiskScoreEnum } from 'src/modules/risk/contract/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from 'src/modules/risk/contract/request/CalculateRiskProfileRequest'

@Injectable()
export class CalculateAutoRiskScoreUseCase {
  execute(
    baseScore: number,
    { vehicle, age, income }: CalculateRiskProfileRequest
  ): RiskScoreEnum {
    if (!vehicle) {
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

    if (DateUtils.isYearInPeriod(vehicle.year, 5)) {
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
