import { Injectable } from '@nestjs/common'
import { CalculateAutoRiskScoreUseCase } from 'src/modules/risk/application/usecases/CalculateAutoRiskScoreUseCase/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from 'src/modules/risk/application/usecases/CalculateDisabilityRiskScoreUseCase/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from 'src/modules/risk/application/usecases/CalculateHomeRiskScoreUseCase/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from 'src/modules/risk/application/usecases/CalculateLifeRiskScoreUseCase/CalculateLifeRiskScoreUseCase'
import { CalculateRiskProfileRequest } from 'src/modules/risk/contract/request/CalculateRiskProfileRequest'
import { CalculateRiskProfileResponse } from 'src/modules/risk/contract/response/CalculateRiskProfileResponse'

@Injectable()
export class CalculateRiskProfileUseCase {
  constructor(
    private readonly calculateAutoRiskLineScoreUseCase: CalculateAutoRiskScoreUseCase,
    private readonly calculateDisabilityRiskLineScoreUseCase: CalculateDisabilityRiskScoreUseCase,
    private readonly calculateHomeRiskScoreUseCase: CalculateHomeRiskScoreUseCase,
    private readonly calculateLifeRiskScoreUseCase: CalculateLifeRiskScoreUseCase
  ) {}

  async execute(
    riskRequest: CalculateRiskProfileRequest
  ): Promise<CalculateRiskProfileResponse> {
    const baseScore = this.calculateBaseScore(riskRequest.risk_questions)

    const auto = this.calculateAutoRiskLineScoreUseCase.execute(
      baseScore,
      riskRequest
    )

    const disability = this.calculateDisabilityRiskLineScoreUseCase.execute(
      baseScore,
      riskRequest
    )

    const home = this.calculateHomeRiskScoreUseCase.execute(
      baseScore,
      riskRequest
    )

    const life = this.calculateLifeRiskScoreUseCase.execute(
      baseScore,
      riskRequest
    )

    return {
      auto,
      disability,
      home,
      life
    }
  }

  private calculateBaseScore(riskQuestions: number[]) {
    return riskQuestions.reduce((a, b) => a + b, 0)
  }
}
