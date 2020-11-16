import { Module } from '@nestjs/common'
import { CalculateAutoRiskScoreUseCase } from '@risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from '@risk/domain/usecases/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from '@risk/domain/usecases/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from '@risk/domain/usecases/CalculateLifeRiskScoreUseCase'
import { CalculateRiskProfileUseCase } from '@risk/domain/usecases/CalculateRiskProfileUseCase'
import { RiskController } from '@risk/presentation/controllers/RiskController'

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
