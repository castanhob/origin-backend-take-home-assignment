import { Module } from '@nestjs/common'
import { RiskModule } from 'src/modules/risk/RiskModule'

@Module({
  imports: [RiskModule]
})
export class AppModule {}
