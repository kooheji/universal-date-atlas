import * as Astronomy from 'astronomy-engine'
import { Temporal } from 'temporal-polyfill/full'

const MECCA = new Astronomy.Observer(21.4225, 39.8262, 300)
const DAY_MS = 86400000
const MECCA_OFFSET_MS = 3 * 60 * 60 * 1000

const MONTHS = [
  'Muharram', 'Safar', 'Rabiʻ I', 'Rabiʻ II',
  'Jumada I', 'Jumada II', 'Rajab', 'Shaʻban',
  'Ramadan', 'Shawwal', 'Dhuʻl-Qiʻdah', 'Dhuʻl-Hijjah',
]

function shiftMonth(year, month, offset) {
  const index = year * 12 + (month - 1) + offset
  return {
    year: Math.floor(index / 12),
    month: ((index % 12) + 12) % 12 + 1,
  }
}

function isoDateToUtc(plainDate) {
  return new Date(Date.UTC(plainDate.year, plainDate.month - 1, plainDate.day))
}

export function getBahrainHijriMonthStart(year, month) {
  const tabularStart = Temporal.PlainDate.from({
    calendar: 'islamic-tbla', year, month, day: 1,
  }).withCalendar('iso8601')

  const searchStart = new Date(isoDateToUtc(tabularStart).getTime() - 4 * DAY_MS)
  const conjunction = Astronomy.SearchMoonPhase(0, searchStart, 9)?.date
  if (!conjunction) throw new Error('Unable to calculate the lunar conjunction')

  const meccaTime = new Date(conjunction.getTime() + MECCA_OFFSET_MS)
  const localYear = meccaTime.getUTCFullYear()
  const localMonth = meccaTime.getUTCMonth()
  const localDay = meccaTime.getUTCDate()

  for (let offset = 0; offset <= 1; offset += 1) {
    const localNoonUtc = new Date(Date.UTC(localYear, localMonth, localDay + offset, 9))
    const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, MECCA, -1, localNoonUtc, 1)?.date
    if (!sunset || conjunction >= sunset) continue

    const moon = Astronomy.Equator(Astronomy.Body.Moon, sunset, MECCA, true, true)
    const altitude = Astronomy.Horizon(sunset, MECCA, moon.ra, moon.dec, 'normal').altitude

    if (altitude > 0) {
      const sunsetInMecca = new Date(sunset.getTime() + MECCA_OFFSET_MS)
      return Date.UTC(
        sunsetInMecca.getUTCFullYear(),
        sunsetInMecca.getUTCMonth(),
        sunsetInMecca.getUTCDate() + 1,
      )
    }
  }

  throw new Error('Unable to determine the Bahrain calendar month start')
}

export function getBahrainHijriMonthLength(year, month) {
  const next = shiftMonth(year, month, 1)
  return Math.round(
    (getBahrainHijriMonthStart(next.year, next.month) - getBahrainHijriMonthStart(year, month)) / DAY_MS,
  )
}

export function bahrainHijriToIso(year, month, day) {
  const daysInMonth = getBahrainHijriMonthLength(year, month)
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth) {
    throw new RangeError(`Day must be between 1 and ${daysInMonth}`)
  }

  const date = new Date(getBahrainHijriMonthStart(year, month) + (day - 1) * DAY_MS)
  return date.toISOString().slice(0, 10)
}

export function getBahrainHijriDate(isoDate) {
  const canonicalDate = Temporal.PlainDate.from(isoDate)
  const roughDate = canonicalDate.withCalendar('islamic-tbla')
  const targetTime = Date.UTC(canonicalDate.year, canonicalDate.month - 1, canonicalDate.day)

  let year = roughDate.year
  let month = roughDate.month
  let monthStart = getBahrainHijriMonthStart(year, month)

  if (targetTime < monthStart) {
    ;({ year, month } = shiftMonth(year, month, -1))
    monthStart = getBahrainHijriMonthStart(year, month)
  } else {
    const next = shiftMonth(year, month, 1)
    const nextStart = getBahrainHijriMonthStart(next.year, next.month)
    if (targetTime >= nextStart) {
      year = next.year
      month = next.month
      monthStart = nextStart
    }
  }

  const day = Math.floor((targetTime - monthStart) / DAY_MS) + 1

  return {
    year,
    month,
    day,
    formatted: `${MONTHS[month - 1]} ${day}, ${year} AH`,
    meta: 'Calculated from the published Makkah conjunction-and-horizon criterion',
  }
}
