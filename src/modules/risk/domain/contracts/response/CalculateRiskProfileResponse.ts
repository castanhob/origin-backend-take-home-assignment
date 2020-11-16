import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'

export interface CalculateRiskProfileResponse {
  auto?: RiskScoreEnum
  disability?: RiskScoreEnum
  home?: RiskScoreEnum
  life?: RiskScoreEnum
}
