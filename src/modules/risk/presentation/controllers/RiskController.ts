import { HttpResult } from '@core/global/HttpResult'
import { Controller, Post, Body, Res } from '@nestjs/common'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateRiskProfileUseCase } from '@risk/domain/usecases/CalculateRiskProfileUseCase'
import { Response } from 'express'

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
