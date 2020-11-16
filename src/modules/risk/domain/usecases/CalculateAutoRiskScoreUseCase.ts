import { DateUtils } from '@core/utils/DateUtil'
import { Injectable } from '@nestjs/common'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'

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
