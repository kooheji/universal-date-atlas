import * as Astronomy from 'astronomy-engine'

import { createUtcDate } from './utc-date.js'

/**
 * Astronomy Engine's Seasons(number) currently constructs its seed dates with
 * Date.UTC, which shifts years 0–99 into 1900–1999. Seed each search with the
 * atlas's year-safe UTC helper instead.
 */
export function getAstronomySeasons(year) {
  if (!Number.isSafeInteger(year)) throw new TypeError('Season year must be a safe integer')

  const find = (targetLongitude, month) => {
    const startDate = createUtcDate(year, month, 10)
    const event = Astronomy.SearchSunLongitude(targetLongitude, startDate, 20)
    if (!event) throw new RangeError(`Unable to calculate seasonal event for year ${year}`)
    return event
  }

  return {
    mar_equinox: find(0, 3),
    jun_solstice: find(90, 6),
    sep_equinox: find(180, 9),
    dec_solstice: find(270, 12),
  }
}
