import { Module } from '@nestjs/common'
import { CalculateRiskUseCase } from 'src/modules/risk/application/usecases/CalculateRiskUseCase/CalculateRiskUseCase'
import { RiskController } from 'src/modules/risk/input/controllers/RiskController'

@Module({
  controllers: [RiskController],
  providers: [CalculateRiskUseCase]
})
export class RiskModule {}
