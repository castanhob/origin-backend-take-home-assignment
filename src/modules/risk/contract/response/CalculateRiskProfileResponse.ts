import { RiskScoreEnum } from 'src/modules/risk/contract/enum/RiskScoreEnum'

export interface CalculateRiskProfileResponse {
  auto?: RiskScoreEnum
  disability?: RiskScoreEnum
  home?: RiskScoreEnum
  life?: RiskScoreEnum
}
