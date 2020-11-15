import { Module } from '@nestjs/common'
import { CalculateAutoRiskScoreUseCase } from 'src/modules/risk/application/usecases/CalculateAutoRiskScoreUseCase/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from 'src/modules/risk/application/usecases/CalculateDisabilityRiskScoreUseCase/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from 'src/modules/risk/application/usecases/CalculateHomeRiskScoreUseCase/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from 'src/modules/risk/application/usecases/CalculateLifeRiskScoreUseCase/CalculateLifeRiskScoreUseCase'
import { CalculateRiskProfileUseCase } from 'src/modules/risk/application/usecases/CalculateRiskProfileUseCase/CalculateRiskProfileUseCase'
import { RiskController } from 'src/modules/risk/input/controllers/RiskController'

@Module({
  controllers: [RiskController],
  providers: [
    CalculateRiskProfileUseCase,
    CalculateAutoRiskScoreUseCase,
    CalculateDisabilityRiskScoreUseCase,
    CalculateHomeRiskScoreUseCase,
    CalculateLifeRiskScoreUseCase
  ]
})
export class RiskModule {}
