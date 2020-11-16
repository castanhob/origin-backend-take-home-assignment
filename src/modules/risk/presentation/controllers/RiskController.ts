import { Controller, Post, Body, Res } from '@nestjs/common'
import { Response } from 'express'
import { HttpResult } from 'src/core/global/HttpResult'
import { CalculateRiskProfileRequest } from 'src/modules/risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateRiskProfileUseCase } from '../../domain/usecases/CalculateRiskProfileUseCase'

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
