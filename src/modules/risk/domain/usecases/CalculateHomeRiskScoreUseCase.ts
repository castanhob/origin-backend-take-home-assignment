import { Injectable } from '@nestjs/common'
import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'

@Injectable()
export class CalculateHomeRiskScoreUseCase {
  execute({
    house,
    age,
    income,
    risk_questions: riskQuestions
  }: CalculateRiskProfileRequest): RiskScoreEnum {
    if (!house) {
      return RiskScoreEnum.INELIGIBLE
    }

    return new RiskScoreBuilder({
      house,
      age,
      income,
      riskQuestions
    })
      .decreaseScoreByAge()
      .decreaseScoreByIncome(200000)
      .increaseScoreByHouseOwnershipStatus(OwnershipStatusEnum.MORTGAGED)
      .result()
  }
}
