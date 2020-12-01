import { Injectable } from '@nestjs/common'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateRiskProfileResponse } from '@risk/domain/contracts/response/CalculateRiskProfileResponse'
import { CalculateAutoRiskScoreUseCase } from '@risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from '@risk/domain/usecases/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from '@risk/domain/usecases/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from '@risk/domain/usecases/CalculateLifeRiskScoreUseCase'
import { CalculateUmbrellaRiskScoreUseCase } from '@risk/domain/usecases/CalculateUmbrellaRiskScoreUseCase'

@Injectable()
export class CalculateRiskProfileUseCase {
  constructor(
    private readonly calculateAutoRiskLineScoreUseCase: CalculateAutoRiskScoreUseCase,
    private readonly calculateDisabilityRiskLineScoreUseCase: CalculateDisabilityRiskScoreUseCase,
    private readonly calculateHomeRiskScoreUseCase: CalculateHomeRiskScoreUseCase,
    private readonly calculateLifeRiskScoreUseCase: CalculateLifeRiskScoreUseCase,
    private readonly calculateUmbrellaRiskScoreUseCase: CalculateUmbrellaRiskScoreUseCase
  ) {}

  async execute(riskRequest: CalculateRiskProfileRequest): Promise<CalculateRiskProfileResponse> {
    const auto = this.calculateAutoRiskLineScoreUseCase.execute(riskRequest)
    const disability = this.calculateDisabilityRiskLineScoreUseCase.execute(riskRequest)
    const home = this.calculateHomeRiskScoreUseCase.execute(riskRequest)
    const life = this.calculateLifeRiskScoreUseCase.execute(riskRequest)

    const isPreviousEconomic = this.checkEconomicScore([auto, disability, home, life])
    const umbrella = this.calculateUmbrellaRiskScoreUseCase.execute(isPreviousEconomic, riskRequest)

    return {
      auto,
      disability,
      home,
      life,
      umbrella
    }
  }

  private checkEconomicScore(scores: RiskScoreEnum[]) {
    return scores.some((score) => score === RiskScoreEnum.ECONOMIC)
  }
}
