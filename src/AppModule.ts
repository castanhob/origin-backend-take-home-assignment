import { Module } from '@nestjs/common'
import { RiskModule } from '@risk/RiskModule'

@Module({
  imports: [RiskModule]
})
export class AppModule {}
