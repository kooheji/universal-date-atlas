const MIN_DATE_YEAR = -271820
const MAX_DATE_YEAR = 275760

function assertInteger(value, label) {
  if (!Number.isInteger(value)) throw new TypeError(`${label} must be an integer`)
}

/**
 * Creates a UTC Date without Date.UTC's legacy 1900 offset for years 0–99.
 * Month and day overflow are intentionally retained for calendar arithmetic.
 */
export function createUtcDate(
  year,
  month = 1,
  day = 1,
  hour = 0,
  minute = 0,
  second = 0,
  millisecond = 0,
) {
  assertInteger(year, 'Year')
  assertInteger(month, 'Month')
  assertInteger(day, 'Day')
  assertInteger(hour, 'Hour')
  assertInteger(minute, 'Minute')
  assertInteger(second, 'Second')
  assertInteger(millisecond, 'Millisecond')

  if (year < MIN_DATE_YEAR || year > MAX_DATE_YEAR) {
    throw new RangeError(`Year must be between ${MIN_DATE_YEAR} and ${MAX_DATE_YEAR}`)
  }

  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(hour, minute, second, millisecond)

  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Date is outside the JavaScript Date range')
  }

  return date
}

export function utcTimestamp(...parts) {
  return createUtcDate(...parts).getTime()
}

export function formatIsoYear(year) {
  assertInteger(year, 'Year')
  if (year >= 0 && year <= 9999) return String(year).padStart(4, '0')
  const sign = year < 0 ? '-' : '+'
  return `${sign}${String(Math.abs(year)).padStart(6, '0')}`
}

/** Formats a Date as an ISO calendar date without truncating extended years. */
export function formatIsoDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('A valid Date is required')
  }

  return [
    formatIsoYear(date.getUTCFullYear()),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-')
}
