import { DateUtils } from '@core/utils/DateUtil'
import { RiskScoreBuilder } from '@risk/domain/builder/RiskScoreBuilder'
import { MaritalStatusEnum } from '@risk/domain/contracts/enum/MaritalStatusEnum'
import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'

describe('Risk :: Domain :: Builder :: RiskProfileBuilder', () => {
  let subject: RiskScoreBuilder

  describe('when increasing score', () => {
    describe('and house ownership status is equal to compared', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          house: { ownership_status: OwnershipStatusEnum.MORTGAGED },
          riskQuestions: [0, 0, 0]
        })
      })

      it('adds 1 point to the score', () => {
        const result = subject.increaseScoreByHouseOwnershipStatus(OwnershipStatusEnum.MORTGAGED).score
        expect(result).toBe(1)
      })
    })

    describe('and marital status is equal to compared', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          maritalStatus: MaritalStatusEnum.MARRIED,
          riskQuestions: [0, 0, 0]
        })
      })

      it('adds 1 point to the score', () => {
        const result = subject.increaseScoreByMaritalStatus(MaritalStatusEnum.MARRIED).score
        expect(result).toBe(1)
      })
    })

    describe('and vehicle prodution year is between last compared years', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          vehicle: { year: DateUtils.lastYear(1).getFullYear() },
          riskQuestions: [0, 0, 0]
        })
      })

      it('adds 1 point to the score', () => {
        const result = subject.increaseScoreByVehicleProductionYear(2).score
        expect(result).toBe(1)
      })
    })

    describe('and has at least one dependants', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          dependents: 1,
          riskQuestions: [0, 0, 0]
        })
      })

      it('adds 1 point to the score', () => {
        const result = subject.increaseScoreByHavingDependents().score
        expect(result).toBe(1)
      })
    })
  })

  describe('when decreasing score', () => {
    describe('and age is below 30', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          age: 20,
          riskQuestions: [0, 0, 0]
        })
      })

      it('removes 2 points from the score', () => {
        const result = subject.decreaseScoreByAge().score
        expect(result).toBe(-2)
      })
    })

    describe('and age is between 30 and 40', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          age: 40,
          riskQuestions: [0, 0, 0]
        })
      })

      it('removes 1 point from the score', () => {
        const result = subject.decreaseScoreByAge().score
        expect(result).toBe(-1)
      })
    })

    describe('and age is above 40', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          age: 41,
          riskQuestions: [0, 0, 0]
        })
      })

      it('does not remove score', () => {
        const result = subject.decreaseScoreByAge().score
        expect(result).toBe(0)
      })
    })

    describe('and income is more or equal than compared', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          income: 200,
          riskQuestions: [0, 0, 0]
        })
      })

      it('removes 1 points from the score', () => {
        const result = subject.decreaseScoreByIncome(200).score
        expect(result).toBe(-1)
      })
    })

    describe('and income is less than compared', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          income: 200,
          riskQuestions: [0, 0, 0]
        })
      })

      it('does not remove score', () => {
        const result = subject.decreaseScoreByIncome(300).score
        expect(result).toBe(0)
      })
    })

    describe('and marital status is equal to compated', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          maritalStatus: MaritalStatusEnum.MARRIED,
          riskQuestions: [0, 0, 0]
        })
      })

      it('removes 1 point from the score', () => {
        const result = subject.decreaseScoreByMaritalStatus(MaritalStatusEnum.MARRIED).score
        expect(result).toBe(-1)
      })
    })
  })

  describe('when getting the result', () => {
    describe('and the score is less or equal 0', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          riskQuestions: [0, 0, 0]
        })
      })

      it('returns economic', () => {
        expect(subject.calculateBaseScore().result()).toBe(RiskScoreEnum.ECONOMIC)
      })
    })

    describe('and the score is between 1 and 2', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          riskQuestions: [1, 1, 0]
        })
      })

      it('returns regular', () => {
        expect(subject.calculateBaseScore().result()).toBe(RiskScoreEnum.REGULAR)
      })
    })

    describe('and the score is more than 3', () => {
      beforeEach(() => {
        subject = new RiskScoreBuilder({
          riskQuestions: [1, 1, 1]
        })
      })

      it('returns responsible', () => {
        expect(subject.calculateBaseScore().result()).toBe(RiskScoreEnum.RESPONSIBLE)
      })
    })
  })
})
