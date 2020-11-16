import { Injectable } from '@nestjs/common'
import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'
import { MaritalStatusEnum } from '@risk/domain/contracts/enum/MaritalStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'

@Injectable()
export class CalculateLifeRiskScoreUseCase {
  execute({
    marital_status: maritalStatus,
    dependents,
    age,
    income,
    risk_questions: riskQuestions
  }: CalculateRiskProfileRequest): RiskScoreEnum {
    if (age > 60) {
      return RiskScoreEnum.INELIGIBLE
    }

    return new RiskScoreBuilder({
      maritalStatus,
      dependents,
      age,
      income,
      riskQuestions
    })
      .decreaseScoreByAge()
      .decreaseScoreByIncome(200000)
      .increaseScoreByHavingDependents()
      .increaseScoreByMaritalStatus(MaritalStatusEnum.MARRIED)
      .result()
  }
}
