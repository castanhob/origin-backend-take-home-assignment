import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateAutoRiskScoreUseCase } from '@risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { dataMock } from '@test/utils/dataMock'

describe('Risk :: Domain :: UseCase :: CalculateAutoRiskUseCase', () => {
  let subject: CalculateAutoRiskScoreUseCase
  let riskProfileRequest: CalculateRiskProfileRequest
  let baseScore: number

  beforeEach(() => {
    baseScore = 0
    subject = new CalculateAutoRiskScoreUseCase()
  })

  describe('when calculating the auto line risk score', () => {
    describe('and the profile has no vehicle', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          vehicle: undefined
        })
      })

      it('returns the score as inelligible', () => {
        const result = subject.execute(baseScore, riskProfileRequest)
        expect(result).toBe(RiskScoreEnum.INELIGIBLE)
      })
    })
  })
})
