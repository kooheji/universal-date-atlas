import * as Astronomy from 'astronomy-engine'

const DAY_MS = 86400000

const MONTHS = [
  'Fravardin', 'Ardibehesht', 'Khordad', 'Tir', 'Amardad', 'Shahrevar',
  'Mehr', 'Aban', 'Adar', 'Dae', 'Bahman', 'Spendarmad',
]

function utcDate(year, month, day) {
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

function fasliNewYear(year) {
  const equinox = Astronomy.Seasons(year).mar_equinox.date
  const tehranLocal = new Date(equinox.getTime() + 3.5 * 60 * 60 * 1000)
  return utcDate(
    tehranLocal.getUTCFullYear(),
    tehranLocal.getUTCMonth() + 1,
    tehranLocal.getUTCDate(),
  )
}

export function getZoroastrianDate(year, month, day) {
  const date = utcDate(year, month, day)
  let startYear = year
  let start = fasliNewYear(startYear)

  if (date < start) {
    startYear -= 1
    start = fasliNewYear(startYear)
  }

  const dayIndex = Math.round((date - start) / DAY_MS)
  const zoroastrianYear = startYear - 631

  if (dayIndex >= 360) {
    return {
      year: zoroastrianYear,
      month: 13,
      day: dayIndex - 359,
      formatted: `Gatha ${dayIndex - 359}, ${zoroastrianYear} YZ`,
    }
  }

  const monthIndex = Math.floor(dayIndex / 30)
  const monthDay = dayIndex % 30 + 1

  return {
    year: zoroastrianYear,
    month: monthIndex + 1,
    day: monthDay,
    formatted: `${monthDay} ${MONTHS[monthIndex]} ${zoroastrianYear} YZ`,
  }
}
