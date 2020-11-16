import { Injectable } from '@nestjs/common'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateRiskProfileResponse } from '@risk/domain/contracts/response/CalculateRiskProfileResponse'
import { CalculateAutoRiskScoreUseCase } from '@risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from '@risk/domain/usecases/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from '@risk/domain/usecases/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from '@risk/domain/usecases/CalculateLifeRiskScoreUseCase'

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
    const auto = this.calculateAutoRiskLineScoreUseCase.execute(riskRequest)
    const disability = this.calculateDisabilityRiskLineScoreUseCase.execute(
      riskRequest
    )
    const home = this.calculateHomeRiskScoreUseCase.execute(riskRequest)
    const life = this.calculateLifeRiskScoreUseCase.execute(riskRequest)

    return {
      auto,
      disability,
      home,
      life
    }
  }
}
