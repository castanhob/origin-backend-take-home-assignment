import { Injectable } from '@nestjs/common'
import { CalculateRiskRequest } from 'src/modules/risk/contract/request/CalculateRiskRequest'
import { CalculateRiskResponse } from 'src/modules/risk/contract/response/CalculateRiskResponse'

@Injectable()
export class CalculateRiskUseCase {
  async execute(_: CalculateRiskRequest): Promise<CalculateRiskResponse> {
    console.log(_)
    return this.mapToResponse()
  }

  private mapToResponse(): CalculateRiskResponse {
    return {
      auto: '',
      disability: '',
      home: '',
      life: ''
    }
  }
}
