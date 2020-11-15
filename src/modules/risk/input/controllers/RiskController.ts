import { Controller, Post, Body, Res } from '@nestjs/common'
import { Response } from 'express'
import { HttpResult } from 'src/core/global/HttpResult'
import { CalculateRiskRequest } from 'src/modules/risk/contract/request/CalculateRiskRequest'
import { CalculateRiskUseCase } from '../../application/usecases/CalculateRiskUseCase/CalculateRiskUseCase'

@Controller('/risk')
export class RiskController {
  constructor(private readonly calculateRiskUseCase: CalculateRiskUseCase) {}

  @Post()
  async calculateRisk(
    @Body() body: CalculateRiskRequest,
    @Res() res: Response
  ) {
    const response = await this.calculateRiskUseCase.execute(body)
    HttpResult.OK(res, response)
  }
}
