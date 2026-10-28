import assert from 'node:assert/strict'

import { getAstronomyData } from './astronomy-engine.js'
import {
  bahrainHijriToIso,
  getBahrainHijriDate,
} from './bahrain-calendar.js'
import { getDateFacts, getDayOfYear, isLeapYear } from './date-facts.js'
import { createUtcDate, formatIsoDate, utcTimestamp } from './utc-date.js'

for (const [year, expected] of [
  [1, '0001-01-01T00:00:00.000Z'],
  [4, '0004-01-01T00:00:00.000Z'],
  [99, '0099-01-01T00:00:00.000Z'],
  [100, '0100-01-01T00:00:00.000Z'],
  [1900, '1900-01-01T00:00:00.000Z'],
  [2000, '2000-01-01T00:00:00.000Z'],
]) {
  assert.equal(createUtcDate(year).toISOString(), expected, `UTC year ${year} must not receive a 1900 offset`)
}

for (const [year, expected] of [
  [1, false],
  [4, true],
  [99, false],
  [100, false],
  [1900, false],
  [2000, true],
]) {
  assert.equal(isLeapYear(year), expected, `Gregorian leap-year rule for ${year}`)
}

assert.equal(formatIsoDate(createUtcDate(99, 12, 31)), '0099-12-31')
assert.equal(formatIsoDate(createUtcDate(10322, 11, 3)), '+010322-11-03')
assert.equal(createUtcDate(99, 13, 1).toISOString(), '0100-01-01T00:00:00.000Z', 'Month rollover must retain year 100')
assert.equal(createUtcDate(4, 2, 30).toISOString(), '0004-03-01T00:00:00.000Z', 'Leap-year day rollover')
assert.equal(createUtcDate(100, 2, 29).toISOString(), '0100-03-01T00:00:00.000Z', 'Century non-leap rollover')
assert.equal(utcTimestamp(1, 1, 1), createUtcDate(1, 1, 1).getTime())

assert.equal(getDateFacts(1, 1, 1).weekday, 'Monday')
assert.equal(getDayOfYear(4, 2, 29), 60)
assert.equal(getDayOfYear(99, 12, 31), 365)
assert.equal(getDayOfYear(100, 12, 31), 365)
assert.equal(getDayOfYear(2000, 12, 31), 366)

for (const isoDate of ['0001-01-01', '0004-02-29', '0099-12-31', '0100-01-01']) {
  const hijri = getBahrainHijriDate(isoDate)
  assert.ok(Number.isInteger(hijri.year) && Number.isInteger(hijri.day), `${isoDate} must convert without a 1900 offset`)
}

for (const isoDate of ['0622-07-19', '1900-03-01', '2000-02-29', '9999-12-31']) {
  const hijri = getBahrainHijriDate(isoDate)
  assert.equal(
    bahrainHijriToIso(hijri.year, hijri.month, hijri.day),
    isoDate,
    `${isoDate} must round-trip through Bahrain Hijri`,
  )
}

const extendedIso = bahrainHijriToIso(9999, 1, 1)
assert.match(extendedIso, /^\+\d{6}-\d{2}-\d{2}$/, 'Extended ISO years must not be truncated')
assert.deepEqual(
  (({ year, month, day }) => ({ year, month, day }))(getBahrainHijriDate(extendedIso)),
  { year: 9999, month: 1, day: 1 },
  'Extended CE dates must round-trip back to AH',
)

assert.throws(() => bahrainHijriToIso(0, 1, 1), /AH year must be between 1 and 9999/)
assert.throws(() => bahrainHijriToIso(10000, 1, 1), /AH year must be between 1 and 9999/)
assert.throws(() => bahrainHijriToIso(1448, 13, 1), /AH month must be between 1 and 12/)
assert.throws(() => bahrainHijriToIso(1448, 1, 31), /Day must be between 1 and/)
assert.throws(() => getBahrainHijriDate('0000-12-31'), /supports CE years 1–10323/)

const astronomyYearOne = getAstronomyData(1, 1, 1)
assert.equal(astronomyYearOne.seasons.marchEquinox.getUTCFullYear(), 1, 'Astronomy must evaluate CE year 1, not 1901')
assert.equal(astronomyYearOne.calculationTime, '12:00 UTC')

console.log('UTC dates: historical years, leap rules, rollovers and CE/AH boundaries passed.')
