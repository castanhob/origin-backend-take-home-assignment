import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateUmbrellaRiskScoreUseCase } from '@risk/domain/usecases/CalculateUmbrellaRiskScoreUseCase'
import { dataMock } from '@test/utils/dataMock'
import { stub } from '@test/utils/stub'

describe('Risk :: Domain :: UseCase :: CalculateUmbrellaRiskScoreUseCase', () => {
  let subject: CalculateUmbrellaRiskScoreUseCase
  let riskScoreBuilder: RiskScoreBuilder
  let riskProfileRequest: CalculateRiskProfileRequest
  let hasPreviousEconomicScore: boolean

  beforeEach(() => {
    riskScoreBuilder = stub<RiskScoreBuilder>()

    subject = new CalculateUmbrellaRiskScoreUseCase(riskScoreBuilder)
  })

  describe('when calculating the umbrella line risk score', () => {
    describe('and does not have economic on any previous score', () => {
      beforeEach(() => {
        hasPreviousEconomicScore = false
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0]
        })
      })

      it('returns the score as inelligible', () => {
        const result = subject.execute(hasPreviousEconomicScore, riskProfileRequest)
        expect(result).toBe(RiskScoreEnum.INELIGIBLE)
      })
    })

    describe('and has economic on any previous score', () => {
      beforeEach(() => {
        hasPreviousEconomicScore = true
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0]
        })

        riskScoreBuilder.calculateBaseScore = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByAge = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByIncome = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.result = jest.fn().mockReturnValue(RiskScoreEnum.ECONOMIC)
      })

      it('calls the builder steps', () => {
        const calculateBaseScoreSpy = jest.spyOn(riskScoreBuilder, 'calculateBaseScore')
        const decreaseScoreByAgeSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByAge')
        const decreaseScoreByIncomeSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByIncome')
        const resultSpy = jest.spyOn(riskScoreBuilder, 'result')

        subject.execute(hasPreviousEconomicScore, riskProfileRequest)
        expect(calculateBaseScoreSpy).toHaveBeenCalled()
        expect(decreaseScoreByAgeSpy).toHaveBeenCalled()
        expect(decreaseScoreByIncomeSpy).toHaveBeenCalledWith(200000)
        expect(resultSpy).toHaveBeenCalled()
      })
    })
  })
})
