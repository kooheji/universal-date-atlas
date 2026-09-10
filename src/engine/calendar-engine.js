import { Temporal } from 'temporal-polyfill/full'

function getLocale(calendarId) {
  return `en-US-u-ca-${calendarId}`
}

export function createCanonicalDate(isoDate) {
  return Temporal.PlainDate.from(isoDate)
}

export function convertCalendar(canonicalDate, calendar) {
  try {
    const converted = canonicalDate.withCalendar(calendar.id)

    let formatted

    try {
      formatted = converted.toLocaleString(
        getLocale(calendar.id),
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          era: 'short',
        },
      )
    } catch {
      formatted = converted.toString()
    }

    return {
      ...calendar,

      status: 'ok',

      formatted,

      year: converted.year,

      month: converted.month,

      day: converted.day,

      era: converted.era ?? null,

      eraYear: converted.eraYear ?? null,
    }
  } catch (error) {
    return {
      ...calendar,

      status: 'unsupported',

      formatted: 'Not available in this browser',

      error: error.message,
    }
  }
}

export function convertAllCalendars(canonicalDate, calendars) {
  return calendars.map((calendar) =>
    convertCalendar(canonicalDate, calendar),
  )
}