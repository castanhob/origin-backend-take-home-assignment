import { Injectable } from '@nestjs/common'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'

@Injectable()
export class CalculateUmbrellaRiskScoreUseCase {
  constructor(private readonly riskScoreBuilder: RiskScoreBuilder) {}

  execute(
    hasPreviousEconomicScore: boolean,
    { age, income, risk_questions: riskQuestions }: CalculateRiskProfileRequest
  ): RiskScoreEnum {
    if (!hasPreviousEconomicScore) {
      return RiskScoreEnum.INELIGIBLE
    }

    this.riskScoreBuilder.age = age
    this.riskScoreBuilder.income = income
    this.riskScoreBuilder.riskQuestions = riskQuestions

    return this.riskScoreBuilder.calculateBaseScore().decreaseScoreByAge().decreaseScoreByIncome(200000).result()
  }
}
