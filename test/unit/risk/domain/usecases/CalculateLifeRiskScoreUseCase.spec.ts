import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'
import { MaritalStatusEnum } from '@risk/domain/contracts/enum/MaritalStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateLifeRiskScoreUseCase } from '@risk/domain/usecases/CalculateLifeRiskScoreUseCase'
import { dataMock } from '@test/utils/dataMock'
import { stub } from '@test/utils/stub'

describe('Risk :: Domain :: UseCase :: CalculateLifeRiskScoreUseCase', () => {
  let subject: CalculateLifeRiskScoreUseCase
  let riskScoreBuilder: RiskScoreBuilder
  let riskProfileRequest: CalculateRiskProfileRequest

  beforeEach(() => {
    riskScoreBuilder = stub<RiskScoreBuilder>()

    subject = new CalculateLifeRiskScoreUseCase(riskScoreBuilder)
  })

  describe('when calculating the life line risk score', () => {
    describe('and the age is above 60', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0],
          age: 61
        })
      })

      it('returns the score as inelligible', () => {
        const result = subject.execute(riskProfileRequest)
        expect(result).toBe(RiskScoreEnum.INELIGIBLE)
      })
    })

    describe('and the age is equal or under 60', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0],
          age: 60
        })

        riskScoreBuilder.calculateBaseScore = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByAge = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByIncome = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.increaseScoreByHavingDependents = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.increaseScoreByMaritalStatus = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.result = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
      })

      it('calls the builder steps', () => {
        const calculateBaseScoreSpy = jest.spyOn(riskScoreBuilder, 'calculateBaseScore')
        const decreaseScoreByAgeSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByAge')
        const decreaseScoreByIncomeSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByIncome')
        const increaseScoreByHavingDependentsSpy = jest.spyOn(riskScoreBuilder, 'increaseScoreByHavingDependents')
        const increaseScoreByMaritalStatusSpy = jest.spyOn(riskScoreBuilder, 'increaseScoreByMaritalStatus')
        const resultSpy = jest.spyOn(riskScoreBuilder, 'result')

        subject.execute(riskProfileRequest)
        expect(calculateBaseScoreSpy).toHaveBeenCalled()
        expect(decreaseScoreByAgeSpy).toHaveBeenCalled()
        expect(decreaseScoreByIncomeSpy).toHaveBeenCalledWith(200000)
        expect(increaseScoreByHavingDependentsSpy).toHaveBeenCalled()
        expect(increaseScoreByMaritalStatusSpy).toHaveBeenCalledWith(MaritalStatusEnum.MARRIED)
        expect(resultSpy).toHaveBeenCalled()
      })
    })
  })
})
