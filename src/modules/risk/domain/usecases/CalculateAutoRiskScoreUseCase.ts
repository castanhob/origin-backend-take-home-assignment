import { Injectable } from '@nestjs/common'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'

@Injectable()
export class CalculateAutoRiskScoreUseCase {
  execute({
    vehicle,
    age,
    income,
    risk_questions: riskQuestions
  }: CalculateRiskProfileRequest): RiskScoreEnum {
    if (!vehicle) {
      return RiskScoreEnum.INELIGIBLE
    }

    return new RiskScoreBuilder({
      vehicle,
      age,
      income,
      riskQuestions
    })
      .decreaseScoreByAge()
      .decreaseScoreByIncome(200000)
      .increaseScoreByVehicleProductionYear(5)
      .result()
  }
}
