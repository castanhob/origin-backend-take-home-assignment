import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateAutoRiskScoreUseCase } from '@risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { dataMock } from '@test/utils/dataMock'
import { stub } from '@test/utils/stub'

describe('Risk :: Domain :: UseCase :: CalculateAutoRiskScoreUseCase', () => {
  let subject: CalculateAutoRiskScoreUseCase
  let riskScoreBuilder: RiskScoreBuilder
  let riskProfileRequest: CalculateRiskProfileRequest

  beforeEach(() => {
    riskScoreBuilder = stub<RiskScoreBuilder>()

    subject = new CalculateAutoRiskScoreUseCase(riskScoreBuilder)
  })

  describe('when calculating the auto line risk score', () => {
    describe('and the profile has no vehicle', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0],
          vehicle: undefined
        })
      })

      it('returns the score as inelligible', () => {
        const result = subject.execute(riskProfileRequest)
        expect(result).toBe(RiskScoreEnum.INELIGIBLE)
      })
    })

    describe('and the profile has a vehicle', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0],
          vehicle: { year: 1999 }
        })

        riskScoreBuilder.calculateBaseScore = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByAge = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByIncome = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.increaseScoreByVehicleProductionYear = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.result = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
      })

      it('calls the builder steps', () => {
        const calculateBaseScoreSpy = jest.spyOn(riskScoreBuilder, 'calculateBaseScore')
        const decreaseScoreByAgeSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByAge')
        const decreaseScoreByIncomeSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByIncome')
        const increaseScoreByVehicleProductionYearSpy = jest.spyOn(
          riskScoreBuilder,
          'increaseScoreByVehicleProductionYear'
        )
        const resultSpy = jest.spyOn(riskScoreBuilder, 'result')

        subject.execute(riskProfileRequest)
        expect(calculateBaseScoreSpy).toHaveBeenCalled()
        expect(decreaseScoreByAgeSpy).toHaveBeenCalled()
        expect(decreaseScoreByIncomeSpy).toHaveBeenCalledWith(200000)
        expect(increaseScoreByVehicleProductionYearSpy).toHaveBeenCalledWith(5)
        expect(resultSpy).toHaveBeenCalled()
      })
    })
  })
})
