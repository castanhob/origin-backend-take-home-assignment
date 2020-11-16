import { Module } from '@nestjs/common'
import { CalculateAutoRiskScoreUseCase } from 'src/modules/risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from 'src/modules/risk/domain/usecases/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from 'src/modules/risk/domain/usecases/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from 'src/modules/risk/domain/usecases/CalculateLifeRiskScoreUseCase'
import { CalculateRiskProfileUseCase } from 'src/modules/risk/domain/usecases/CalculateRiskProfileUseCase'
import { RiskController } from 'src/modules/risk/presentation/controllers/RiskController'

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
