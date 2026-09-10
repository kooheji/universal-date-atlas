const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export function calculateJulianDay(year, month, day) {
  let y = year
  let m = month

  if (m <= 2) {
    y -= 1
    m += 12
  }

  const a = Math.floor(y / 100)

  const b =
    2 -
    a +
    Math.floor(a / 4)

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    b -
    1524.5
  )
}

export function getDayOfYear(year, month, day) {
  const current = Date.UTC(year, month - 1, day)

  const start = Date.UTC(year, 0, 1)

  return Math.floor(
    (current - start) / 86400000,
  ) + 1
}

export function isLeapYear(year) {
  return (
    year % 4 === 0 &&
    (
      year % 100 !== 0 ||
      year % 400 === 0
    )
  )
}

export function getDateFacts(year, month, day) {
  const utcDate = new Date(
    Date.UTC(year, month - 1, day),
  )

  const dayOfYear =
    getDayOfYear(year, month, day)

  const daysInYear =
    isLeapYear(year) ? 366 : 365

  const julianDay =
    calculateJulianDay(
      year,
      month,
      day,
    )

  return {
    weekday:
      WEEKDAYS[utcDate.getUTCDay()],

    dayOfYear,

    daysRemaining:
      daysInYear - dayOfYear,

    leapYear:
      isLeapYear(year),

    julianDay,

    modifiedJulianDay:
      julianDay - 2400000.5,
  }
}