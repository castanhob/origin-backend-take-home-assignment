import dayjs from 'dayjs'

export class DateUtils {
  static lastYear(years: number) {
    return dayjs().subtract(years, 'year').toDate()
  }

  static isYearInPeriod(year: number, periodToCheck: number): boolean {
    const now = dayjs()
    const yearDate = now.set('year', year)

    return now.diff(yearDate, 'year') <= periodToCheck
  }
}
