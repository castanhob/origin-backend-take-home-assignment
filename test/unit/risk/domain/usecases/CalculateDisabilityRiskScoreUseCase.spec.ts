import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'
import { MaritalStatusEnum } from '@risk/domain/contracts/enum/MaritalStatusEnum'
import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateDisabilityRiskScoreUseCase } from '@risk/domain/usecases/CalculateDisabilityRiskScoreUseCase'
import { dataMock } from '@test/utils/dataMock'
import { stub } from '@test/utils/stub'

describe('Risk :: Domain :: UseCase :: CalculateDisabilityRiskScoreUseCase', () => {
  let subject: CalculateDisabilityRiskScoreUseCase
  let riskScoreBuilder: RiskScoreBuilder
  let riskProfileRequest: CalculateRiskProfileRequest

  beforeEach(() => {
    riskScoreBuilder = stub<RiskScoreBuilder>()

    subject = new CalculateDisabilityRiskScoreUseCase(riskScoreBuilder)
  })

  describe('when calculating the disbility line risk score', () => {
    describe('and the profile has no income', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0],
          income: 0
        })
      })

      it('returns the score as inelligible', () => {
        const result = subject.execute(riskProfileRequest)
        expect(result).toBe(RiskScoreEnum.INELIGIBLE)
      })
    })

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

    describe('and the profile has income or has less or equal 60 years', () => {
      beforeEach(() => {
        riskProfileRequest = dataMock<CalculateRiskProfileRequest>({
          risk_questions: [0, 0, 0],
          income: 1,
          age: 60
        })

        riskScoreBuilder.calculateBaseScore = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByAge = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByIncome = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.increaseScoreByHouseOwnershipStatus = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.increaseScoreByHavingDependents = jest.fn().mockReturnValue(riskScoreBuilder)
        riskScoreBuilder.decreaseScoreByMaritalStatus = jest.fn().mockReturnValue(riskScoreBuilder)
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
        const increaseScoreByHavingDependentsSpy = jest.spyOn(riskScoreBuilder, 'increaseScoreByHavingDependents')
        const decreaseScoreByMaritalStatusSpy = jest.spyOn(riskScoreBuilder, 'decreaseScoreByMaritalStatus')
        const resultSpy = jest.spyOn(riskScoreBuilder, 'result')

        subject.execute(riskProfileRequest)
        expect(calculateBaseScoreSpy).toHaveBeenCalled()
        expect(decreaseScoreByAgeSpy).toHaveBeenCalled()
        expect(decreaseScoreByIncomeSpy).toHaveBeenCalledWith(200000)
        expect(increaseScoreByHouseOwnershipStatusSpy).toHaveBeenCalledWith(OwnershipStatusEnum.MORTGAGED)
        expect(increaseScoreByHavingDependentsSpy).toHaveBeenCalled()
        expect(decreaseScoreByMaritalStatusSpy).toHaveBeenCalledWith(MaritalStatusEnum.MARRIED)
        expect(resultSpy).toHaveBeenCalled()
      })
    })
  })
})
