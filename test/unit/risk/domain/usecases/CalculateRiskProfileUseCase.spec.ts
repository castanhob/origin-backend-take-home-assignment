import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'
import { CalculateRiskProfileRequest } from '@risk/domain/contracts/request/CalculateRiskProfileRequest'
import { CalculateAutoRiskScoreUseCase } from '@risk/domain/usecases/CalculateAutoRiskScoreUseCase'
import { CalculateDisabilityRiskScoreUseCase } from '@risk/domain/usecases/CalculateDisabilityRiskScoreUseCase'
import { CalculateHomeRiskScoreUseCase } from '@risk/domain/usecases/CalculateHomeRiskScoreUseCase'
import { CalculateLifeRiskScoreUseCase } from '@risk/domain/usecases/CalculateLifeRiskScoreUseCase'
import { CalculateRiskProfileUseCase } from '@risk/domain/usecases/CalculateRiskProfileUseCase'
import { CalculateUmbrellaRiskScoreUseCase } from '@risk/domain/usecases/CalculateUmbrellaRiskScoreUseCase'
import { stub } from '@test/utils/stub'

describe('Risk :: Domain :: UseCase :: CalculateRiskProfileUseCase', () => {
  let subject: CalculateRiskProfileUseCase
  let calculateAutoRiskScoreUseCase: CalculateAutoRiskScoreUseCase
  let calculateDisabilityRiskScoreUseCase: CalculateDisabilityRiskScoreUseCase
  let calculateHomeRiskScoreUseCase: CalculateHomeRiskScoreUseCase
  let calculateLifeRiskScoreUseCase: CalculateLifeRiskScoreUseCase
  let calculateUmbrellaRiskScoreUseCase: CalculateUmbrellaRiskScoreUseCase

  let riskProfileRequest: CalculateRiskProfileRequest

  beforeEach(() => {
    calculateAutoRiskScoreUseCase = stub<CalculateAutoRiskScoreUseCase>()
    calculateDisabilityRiskScoreUseCase = stub<CalculateDisabilityRiskScoreUseCase>()
    calculateHomeRiskScoreUseCase = stub<CalculateHomeRiskScoreUseCase>()
    calculateLifeRiskScoreUseCase = stub<CalculateLifeRiskScoreUseCase>()
    calculateUmbrellaRiskScoreUseCase = stub<CalculateUmbrellaRiskScoreUseCase>()

    subject = new CalculateRiskProfileUseCase(
      calculateAutoRiskScoreUseCase,
      calculateDisabilityRiskScoreUseCase,
      calculateHomeRiskScoreUseCase,
      calculateLifeRiskScoreUseCase,
      calculateUmbrellaRiskScoreUseCase
    )
  })

  describe('when calculating the risk profile', () => {
    describe('and any previous score has economic', () => {
      beforeEach(() => {
        riskProfileRequest = new CalculateRiskProfileRequest()
        riskProfileRequest.house = {
          ownership_status: OwnershipStatusEnum.OWNED
        }

        calculateAutoRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.ECONOMIC)
        calculateDisabilityRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
        calculateHomeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.REGULAR)
        calculateLifeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.RESPONSIBLE)
        calculateUmbrellaRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.ECONOMIC)
      })

      it('calls the five risk lines with umbrella being economic', async () => {
        const autoSpy = jest.spyOn(calculateAutoRiskScoreUseCase, 'execute')
        const disabilitySpy = jest.spyOn(calculateDisabilityRiskScoreUseCase, 'execute')
        const homeSpy = jest.spyOn(calculateHomeRiskScoreUseCase, 'execute')
        const lifeSpy = jest.spyOn(calculateLifeRiskScoreUseCase, 'execute')
        const umbrellaSpy = jest.spyOn(calculateUmbrellaRiskScoreUseCase, 'execute')

        const expectedResult = {
          auto: RiskScoreEnum.ECONOMIC,
          disability: RiskScoreEnum.INELIGIBLE,
          home: RiskScoreEnum.REGULAR,
          life: RiskScoreEnum.RESPONSIBLE,
          umbrella: RiskScoreEnum.ECONOMIC
        }

        const result = await subject.execute(riskProfileRequest)

        expect(autoSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(disabilitySpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(homeSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(lifeSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(umbrellaSpy).toHaveBeenCalledWith(true, riskProfileRequest)
        expect(result).toMatchObject(expectedResult)
      })
    })

    describe('and no previous score has economic', () => {
      beforeEach(() => {
        riskProfileRequest = new CalculateRiskProfileRequest()
        riskProfileRequest.house = {
          ownership_status: OwnershipStatusEnum.OWNED
        }

        calculateAutoRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.RESPONSIBLE)
        calculateDisabilityRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
        calculateHomeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.REGULAR)
        calculateLifeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.RESPONSIBLE)
        calculateUmbrellaRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
      })

      it('calls the five risk lines with umbrella being inelligible', async () => {
        const autoSpy = jest.spyOn(calculateAutoRiskScoreUseCase, 'execute')
        const disabilitySpy = jest.spyOn(calculateDisabilityRiskScoreUseCase, 'execute')
        const homeSpy = jest.spyOn(calculateHomeRiskScoreUseCase, 'execute')
        const lifeSpy = jest.spyOn(calculateLifeRiskScoreUseCase, 'execute')
        const umbrellaSpy = jest.spyOn(calculateUmbrellaRiskScoreUseCase, 'execute')

        const expectedResult = {
          auto: RiskScoreEnum.RESPONSIBLE,
          disability: RiskScoreEnum.INELIGIBLE,
          home: RiskScoreEnum.REGULAR,
          life: RiskScoreEnum.RESPONSIBLE,
          umbrella: RiskScoreEnum.INELIGIBLE
        }

        const result = await subject.execute(riskProfileRequest)

        expect(autoSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(disabilitySpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(homeSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(lifeSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(umbrellaSpy).toHaveBeenCalledWith(false, riskProfileRequest)
        expect(result).toMatchObject(expectedResult)
      })
    })

    describe('and the house is not rented', () => {
      beforeEach(() => {
        riskProfileRequest = new CalculateRiskProfileRequest()
        riskProfileRequest.house = {
          ownership_status: OwnershipStatusEnum.OWNED
        }

        calculateAutoRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.RESPONSIBLE)
        calculateDisabilityRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
        calculateHomeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.REGULAR)
        calculateLifeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.RESPONSIBLE)
        calculateUmbrellaRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
      })

      it('calls the five risk lines with house included on the result', async () => {
        const autoSpy = jest.spyOn(calculateAutoRiskScoreUseCase, 'execute')
        const disabilitySpy = jest.spyOn(calculateDisabilityRiskScoreUseCase, 'execute')
        const homeSpy = jest.spyOn(calculateHomeRiskScoreUseCase, 'execute')
        const lifeSpy = jest.spyOn(calculateLifeRiskScoreUseCase, 'execute')
        const umbrellaSpy = jest.spyOn(calculateUmbrellaRiskScoreUseCase, 'execute')

        const expectedResult = {
          auto: RiskScoreEnum.RESPONSIBLE,
          disability: RiskScoreEnum.INELIGIBLE,
          home: RiskScoreEnum.REGULAR,
          life: RiskScoreEnum.RESPONSIBLE,
          umbrella: RiskScoreEnum.INELIGIBLE
        }

        const result = await subject.execute(riskProfileRequest)

        expect(autoSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(disabilitySpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(homeSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(lifeSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(umbrellaSpy).toHaveBeenCalledWith(false, riskProfileRequest)
        expect(result).toMatchObject(expectedResult)
        expect(result.renters).toBeUndefined()
      })
    })

    describe('and the house is rented', () => {
      beforeEach(() => {
        riskProfileRequest = new CalculateRiskProfileRequest()
        riskProfileRequest.house = {
          ownership_status: OwnershipStatusEnum.RENTED
        }

        calculateAutoRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.RESPONSIBLE)
        calculateDisabilityRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
        calculateHomeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.REGULAR)
        calculateLifeRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.RESPONSIBLE)
        calculateUmbrellaRiskScoreUseCase.execute = jest.fn().mockReturnValue(RiskScoreEnum.INELIGIBLE)
      })

      it('calls the five risk lines with renters included on the result', async () => {
        const autoSpy = jest.spyOn(calculateAutoRiskScoreUseCase, 'execute')
        const disabilitySpy = jest.spyOn(calculateDisabilityRiskScoreUseCase, 'execute')
        const homeSpy = jest.spyOn(calculateHomeRiskScoreUseCase, 'execute')
        const lifeSpy = jest.spyOn(calculateLifeRiskScoreUseCase, 'execute')
        const umbrellaSpy = jest.spyOn(calculateUmbrellaRiskScoreUseCase, 'execute')

        const expectedResult = {
          auto: RiskScoreEnum.RESPONSIBLE,
          disability: RiskScoreEnum.INELIGIBLE,
          renters: RiskScoreEnum.REGULAR,
          life: RiskScoreEnum.RESPONSIBLE,
          umbrella: RiskScoreEnum.INELIGIBLE
        }

        const result = await subject.execute(riskProfileRequest)

        expect(autoSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(disabilitySpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(homeSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(lifeSpy).toHaveBeenCalledWith(riskProfileRequest)
        expect(umbrellaSpy).toHaveBeenCalledWith(false, riskProfileRequest)
        expect(result).toMatchObject(expectedResult)
        expect(result.home).toBeUndefined()
      })
    })
  })
})
