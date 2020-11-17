import { Injectable } from '@nestjs/common'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'

@Injectable()
export class CalculateAutoRiskScoreUseCase {
  constructor(private readonly riskScoreBuilder: RiskScoreBuilder) {}

  execute({ vehicle, age, income, risk_questions: riskQuestions }: CalculateRiskProfileRequest): RiskScoreEnum {
    if (!vehicle) {
      return RiskScoreEnum.INELIGIBLE
    }

    this.riskScoreBuilder.vehicle = vehicle
    this.riskScoreBuilder.age = age
    this.riskScoreBuilder.income = income
    this.riskScoreBuilder.riskQuestions = riskQuestions

    return this.riskScoreBuilder
      .calculateBaseScore()
      .decreaseScoreByAge()
      .decreaseScoreByIncome(200000)
      .increaseScoreByVehicleProductionYear(5)
      .result()
  }
}
