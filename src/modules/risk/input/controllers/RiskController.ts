import { Controller, Post, Body, Res } from '@nestjs/common'
import { Response } from 'express'
import { HttpResult } from 'src/core/global/HttpResult'
import { CalculateRiskProfileRequest } from 'src/modules/risk/contract/request/CalculateRiskProfileRequest'
import { CalculateRiskProfileUseCase } from '../../application/usecases/CalculateRiskProfileUseCase/CalculateRiskProfileUseCase'

@Controller('/risk')
export class RiskController {
  constructor(
    private readonly calculateRiskProfileUseCase: CalculateRiskProfileUseCase
  ) {}

  @Post('/profile')
  async calculateRiskProfile(
    @Body() body: CalculateRiskProfileRequest,
    @Res() res: Response
  ) {
    const response = await this.calculateRiskProfileUseCase.execute(body)
    HttpResult.OK(res, response)
  }
}
