import { Module } from '@nestjs/common'
import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'
import { CalculateAutoRiskScoreUseCase } from '@risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from '@risk/domain/usecases/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from '@risk/domain/usecases/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from '@risk/domain/usecases/CalculateLifeRiskScoreUseCase'
import { CalculateRiskProfileUseCase } from '@risk/domain/usecases/CalculateRiskProfileUseCase'
import { RiskController } from '@risk/presentation/controllers/RiskController'

@Module({
  controllers: [RiskController],
  providers: [
    CalculateAutoRiskScoreUseCase,
    CalculateDisabilityRiskScoreUseCase,
    CalculateHomeRiskScoreUseCase,
    CalculateLifeRiskScoreUseCase,
    CalculateRiskProfileUseCase,
    { provide: RiskScoreBuilder, useValue: new RiskScoreBuilder() }
  ]
})
export class RiskModule {}
