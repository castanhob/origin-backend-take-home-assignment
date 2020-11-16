import { DateUtils } from '@core/utils/DateUtil'
import { MaritalStatusEnum } from '@risk/domain/contracts/enum/MaritalStatusEnum'
import { OwnershipStatusEnum } from '@risk/domain/contracts/enum/OwnershipStatusEnum'
import { RiskScoreEnum } from '@risk/domain/contracts/enum/RiskScoreEnum'

export class RiskScoreBuilder {
  constructor(params?: Partial<RiskScoreBuilder>) {
    Object.assign(this, params)
    this.score = this.calculateBaseScore()
  }

  readonly age: number
  score: number
  readonly dependents: number
  readonly income: number
  readonly maritalStatus: MaritalStatusEnum
  readonly riskQuestions: number[]
  readonly house?: { ownership_status: OwnershipStatusEnum }
  readonly vehicle?: { year: number }

  decreaseScoreByAge() {
    if (this.age < 30) {
      this.score -= 2
    } else if (this.age >= 30 && this.age <= 40) {
      this.score--
    }

    return this
  }

  decreaseScoreByIncome(income: number) {
    if (this.income >= income) {
      this.score--
    }

    return this
  }

  decreaseScoreByMaritalStatus(maritalStatus: MaritalStatusEnum) {
    if (this.maritalStatus === maritalStatus) {
      this.score--
    }

    return this
  }

  increaseScoreByHouseOwnershipStatus(ownershipStatus: OwnershipStatusEnum) {
    if (this.house?.ownership_status === ownershipStatus) {
      this.score++
    }

    return this
  }

  increaseScoreByMaritalStatus(martialStatus: MaritalStatusEnum) {
    if (this.maritalStatus === martialStatus) {
      this.score++
    }

    return this
  }

  increaseScoreByVehicleProductionYear(year: number) {
    if (year && DateUtils.isYearInPeriod(this.vehicle?.year || 0, 5)) {
      this.score++
    }

    return this
  }

  increaseScoreByHavingDependents() {
    if (this.dependents > 0) {
      this.score++
    }

    return this
  }

  result() {
    if (this.score <= 0) {
      return RiskScoreEnum.ECONOMIC
    } else if (this.score >= 1 && this.score <= 2) {
      return RiskScoreEnum.REGULAR
    } else if (this.score >= 3) {
      return RiskScoreEnum.RESPONSIBLE
    } else {
      return RiskScoreEnum.INELIGIBLE
    }
  }

  private calculateBaseScore() {
    return this.riskQuestions?.reduce((a, b) => a + b, 0) || 0
  }
}
