import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateAutoRiskScoreUseCase } from '@risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from '@risk/domain/usecases/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from '@risk/domain/usecases/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from '@risk/domain/usecases/CalculateLifeRiskScoreUseCase'
import { CalculateRiskProfileUseCase } from '@risk/domain/usecases/CalculateRiskProfileUseCase'
import { stub } from '@test/utils/stub'

describe('Risk :: Domain :: UseCase :: CalculateRiskProfileUseCase', () => {
  let subject: CalculateRiskProfileUseCase
  let calculateAutoRiskScoreUseCase: CalculateAutoRiskScoreUseCase
  let calculateDisabilityRiskScoreUseCase: CalculateDisabilityRiskScoreUseCase
  let calculateHomeRiskScoreUseCase: CalculateHomeRiskScoreUseCase
  let calculateLifeRiskScoreUseCase: CalculateLifeRiskScoreUseCase

  let riskProfileRequest: CalculateRiskProfileRequest

  beforeEach(() => {
    calculateAutoRiskScoreUseCase = stub<CalculateAutoRiskScoreUseCase>()
    calculateDisabilityRiskScoreUseCase = stub<CalculateDisabilityRiskScoreUseCase>()
    calculateHomeRiskScoreUseCase = stub<CalculateHomeRiskScoreUseCase>()
    calculateLifeRiskScoreUseCase = stub<CalculateLifeRiskScoreUseCase>()

    subject = new CalculateRiskProfileUseCase(
      calculateAutoRiskScoreUseCase,
      calculateDisabilityRiskScoreUseCase,
      calculateHomeRiskScoreUseCase,
      calculateLifeRiskScoreUseCase
    )
  })

  describe('when calculating the risk profile', () => {
    beforeEach(() => {
      calculateAutoRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.ECONOMIC)
      calculateDisabilityRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
      calculateHomeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.REGULAR)
      calculateLifeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.RESPONSIBLE)
    })

    it('calls the four risk lines', async () => {
      const autoSpy = jest.spyOn(calculateAutoRiskScoreUseCase, 'execute')
      const disabilitySpy = jest.spyOn(calculateDisabilityRiskScoreUseCase, 'execute')
      const homeSpy = jest.spyOn(calculateHomeRiskScoreUseCase, 'execute')
      const lifeSpy = jest.spyOn(calculateLifeRiskScoreUseCase, 'execute')

      const expectedResult = {
        auto: RiskScoreEnum.ECONOMIC,
        disability: RiskScoreEnum.INELIGIBLE,
        home: RiskScoreEnum.REGULAR,
        life: RiskScoreEnum.RESPONSIBLE
      }

      const result = await subject.execute(riskProfileRequest)

      expect(autoSpy).toHaveBeenCalledWith(riskProfileRequest)
      expect(disabilitySpy).toHaveBeenCalledWith(riskProfileRequest)
      expect(homeSpy).toHaveBeenCalledWith(riskProfileRequest)
      expect(lifeSpy).toHaveBeenCalledWith(riskProfileRequest)
      expect(result).toMatchObject(expectedResult)
    })
  })
})
