import { RiskScoreEnum } from 'src/modules/risk/domain/contracts/enum/RiskScoreEnum'

export interface CalculateRiskProfileResponse {
  auto?: RiskScoreEnum
  disability?: RiskScoreEnum
  home?: RiskScoreEnum
  life?: RiskScoreEnum
}
