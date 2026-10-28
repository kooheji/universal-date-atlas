import * as Astronomy from 'astronomy-engine'
import { Temporal } from 'temporal-polyfill/full'
import { createUtcDate, formatIsoDate, utcTimestamp } from './utc-date.js'

const MECCA = new Astronomy.Observer(21.4225, 39.8262, 300)
const DAY_MS = 86400000
const MECCA_OFFSET_MS = 3 * 60 * 60 * 1000
const MOON_SEMIDIAMETER_DEGREES = 0.26
export const BAHRAIN_HIJRI_YEAR_MIN = 1
export const BAHRAIN_HIJRI_YEAR_MAX = 9999
const BAHRAIN_ISO_YEAR_MIN = 1
const BAHRAIN_ISO_YEAR_MAX = 10323
const BAHRAIN_CALCULATION_YEAR_MIN = -700

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

function validateHijriYearMonth(
  year,
  month,
  minimumYear = BAHRAIN_HIJRI_YEAR_MIN,
  maximumYear = BAHRAIN_HIJRI_YEAR_MAX,
) {
  if (!Number.isInteger(year) || year < minimumYear || year > maximumYear) {
    throw new RangeError(`AH year must be between ${BAHRAIN_HIJRI_YEAR_MIN} and ${BAHRAIN_HIJRI_YEAR_MAX}`)
  }
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError('AH month must be between 1 and 12')
  }
}

function isoDateToUtc(plainDate) {
  return createUtcDate(plainDate.year, plainDate.month, plainDate.day)
}

export function getBahrainHijriMonthStart(year, month) {
  // Year 10000 is used only as the exclusive boundary after 9999 AH.
  validateHijriYearMonth(year, month, BAHRAIN_CALCULATION_YEAR_MIN, BAHRAIN_HIJRI_YEAR_MAX + 1)
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
    const localNoonUtc = createUtcDate(localYear, localMonth + 1, localDay + offset, 9)
    const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, MECCA, -1, localNoonUtc, 1)?.date
    if (!sunset || conjunction >= sunset) continue

    const moon = Astronomy.Equator(Astronomy.Body.Moon, sunset, MECCA, true, true)
    const altitude = Astronomy.Horizon(sunset, MECCA, moon.ra, moon.dec, 'normal').altitude

    // Bahrain's published criterion requires the whole lunar disc—not only
    // its centre—to be above the horizon at Makkah sunset.
    if (altitude > MOON_SEMIDIAMETER_DEGREES) {
      const sunsetInMecca = new Date(sunset.getTime() + MECCA_OFFSET_MS)
      return utcTimestamp(
        sunsetInMecca.getUTCFullYear(),
        sunsetInMecca.getUTCMonth() + 1,
        sunsetInMecca.getUTCDate() + 1,
      )
    }
  }

  throw new Error('Unable to determine the Bahrain calendar month start')
}

export function getBahrainHijriMonthLength(year, month) {
  validateHijriYearMonth(year, month, BAHRAIN_CALCULATION_YEAR_MIN)
  const next = shiftMonth(year, month, 1)
  return Math.round(
    (getBahrainHijriMonthStart(next.year, next.month) - getBahrainHijriMonthStart(year, month)) / DAY_MS,
  )
}

export function bahrainHijriToIso(year, month, day) {
  validateHijriYearMonth(year, month)
  const daysInMonth = getBahrainHijriMonthLength(year, month)
  if (!Number.isInteger(day) || day < 1 || day > daysInMonth) {
    throw new RangeError(`Day must be between 1 and ${daysInMonth}`)
  }

  const date = new Date(getBahrainHijriMonthStart(year, month) + (day - 1) * DAY_MS)
  return formatIsoDate(date)
}

export function getBahrainHijriDate(isoDate) {
  const canonicalDate = Temporal.PlainDate.from(isoDate)
  if (canonicalDate.year < BAHRAIN_ISO_YEAR_MIN || canonicalDate.year > BAHRAIN_ISO_YEAR_MAX) {
    throw new RangeError(`Bahrain Hijri conversion supports CE years ${BAHRAIN_ISO_YEAR_MIN}–${BAHRAIN_ISO_YEAR_MAX}`)
  }
  const roughDate = canonicalDate.withCalendar('islamic-tbla')
  const targetTime = utcTimestamp(canonicalDate.year, canonicalDate.month, canonicalDate.day)

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
    monthName: MONTHS[month - 1],
    formatted: `${day} ${MONTHS[month - 1]} ${year} AH`,
    meta: 'Calculated from the published Makkah conjunction-and-horizon criterion',
  }
}
