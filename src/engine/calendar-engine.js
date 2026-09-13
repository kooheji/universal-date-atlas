import { Temporal } from 'temporal-polyfill/full'

function getLocale(calendarId) {
  // Use one conventional order throughout the atlas: day, month, year.
  // Calendar-specific structures (cycles, pillars, long counts, and similar
  // systems) are formatted by their own engines and are intentionally untouched.
  return `en-GB-u-ca-${calendarId}`
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
  } catch (temporalError) {
    try {
      const formatter = new Intl.DateTimeFormat(
        getLocale(calendar.id),
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          era: 'short',
          timeZone: 'UTC',
        },
      )

      if (formatter.resolvedOptions().calendar !== calendar.id) {
        throw new Error(`Calendar ${calendar.id} is not supported by Intl`)
      }

      const date = new Date(Date.UTC(
        canonicalDate.year,
        canonicalDate.month - 1,
        canonicalDate.day,
      ))

      return {
        ...calendar,
        status: 'ok',
        formatted: formatter.format(date),
        year: null,
        month: null,
        day: null,
        era: null,
        eraYear: null,
      }
    } catch (intlError) {
      return {
        ...calendar,
        status: 'unsupported',
        formatted: 'Not available in this browser',
        error: `${temporalError.message}; ${intlError.message}`,
      }
    }
  }
}

export function convertAllCalendars(canonicalDate, calendars) {
  return calendars.map((calendar) =>
    convertCalendar(canonicalDate, calendar),
  )
}
