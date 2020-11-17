import { Injectable } from '@nestjs/common'
import { MaritalStatusEnum } from '@risk/domain/contracts/enum/MaritalStatusEnum'
import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'

@Injectable()
export class CalculateDisabilityRiskScoreUseCase {
  constructor(private readonly riskScoreBuilder: RiskScoreBuilder) {}

  execute({
    age,
    dependents,
    house,
    income,
    marital_status: maritalStatus,
    risk_questions: riskQuestions
  }: CalculateRiskProfileRequest): RiskScoreEnum {
    if (income === 0 || age > 60) {
      return RiskScoreEnum.INELIGIBLE
    }

    this.riskScoreBuilder.age = age
    this.riskScoreBuilder.dependents = dependents
    this.riskScoreBuilder.house = house
    this.riskScoreBuilder.income = income
    this.riskScoreBuilder.maritalStatus = maritalStatus
    this.riskScoreBuilder.riskQuestions = riskQuestions

    return this.riskScoreBuilder
      .calculateBaseScore()
      .decreaseScoreByAge()
      .decreaseScoreByIncome(200000)
      .increaseScoreByHouseOwnershipStatus(OwnershipStatusEnum.MORTGAGED)
      .increaseScoreByHavingDependents()
      .decreaseScoreByMaritalStatus(MaritalStatusEnum.MARRIED)
      .result()
  }
}
