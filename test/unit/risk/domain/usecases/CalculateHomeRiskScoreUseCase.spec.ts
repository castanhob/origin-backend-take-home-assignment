import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'
import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateHomeRiskScoreUseCase } from '@risk/domain/usecases/CalculateHomeRiskScoreUseCase'
import { dataMock } from '@test/utils/dataMock'
import { stub } from '@test/utils/stub'

describe('Risk :: Domain :: UseCase :: CalculateHomeRiskScoreUseCase', () => {
  let subject: CalculateHomeRiskScoreUseCase
  let riskScoreBuilder: RiskScoreBuilder
  let riskProfileRequest: CalculateRiskProfileRequest

  beforeEach(() => {
    riskScoreBuilder = stub<RiskScoreBuilder>()

    subject = new CalculateHomeRiskScoreUseCase(riskScoreBuilder)
  })

  describe('when calculating the home line risk score', () => {
    describe('and the profile has no house', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0],
          house: undefined
        })
      })

      it('returns the score as inelligible', () => {
        const result = subject.execute(riskProfileRequest)
        expect(result).toBe(RiskScoreEnum.INELIGIBLE)
      })
    })

    describe('and the profile has a house', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0],
          house: { ownership_status: OwnershipStatusEnum.MORTGAGED }
        })

        riskScoreBuilder.calculateBaseScore = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByAge = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByIncome = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.increaseScoreByHouseOwnershipStatus = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.result = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
      })

      it('calls the builder steps', () => {
        const calculateBaseScoreSpy = jest.spyOn(riskScoreBuilder, 'calculateBaseScore')
        const decreaseScoreByAgeSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByAge')
        const decreaseScoreByIncomeSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByIncome')
        const increaseScoreByHouseOwnershipStatusSpy = jest.spyOn(
          riskScoreBuilder,
          'increaseScoreByHouseOwnershipStatus'
        )
        const resultSpy = jest.spyOn(riskScoreBuilder, 'result')

        subject.execute(riskProfileRequest)
        expect(calculateBaseScoreSpy).toHaveBeenCalled()
        expect(decreaseScoreByAgeSpy).toHaveBeenCalled()
        expect(decreaseScoreByIncomeSpy).toHaveBeenCalledWith(200000)
        expect(increaseScoreByHouseOwnershipStatusSpy).toHaveBeenCalledWith(OwnershipStatusEnum.MORTGAGED)
        expect(resultSpy).toHaveBeenCalled()
      })
    })
  })
})
