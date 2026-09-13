import assert from 'node:assert/strict'
import { Temporal } from 'temporal-polyfill/full'

import { CALENDARS } from '../data/calendars.js'
import { bahrainHijriToIso, getBahrainHijriDate } from './bahrain-calendar.js'
import { convertAllCalendars } from './calendar-engine.js'
import { getDateFacts } from './date-facts.js'
import { getAncientCalendarData } from './ancient-calendar-engine.js'
import { getHeritageCalendarData } from './heritage-calendar-engine.js'
import { getRegionalCalendarData } from './regional-calendar-engine.js'

for (const isoDate of ['0001-01-01', '2026-09-11', '9999-12-31']) {
  const results = convertAllCalendars(Temporal.PlainDate.from(isoDate), CALENDARS)
  assert.equal(results.length, CALENDARS.length, `${isoDate} should return every standard calendar`)
  assert.ok(results.every((result) => result.status), `${isoDate} results should report status`)
}

const bahrain = getBahrainHijriDate('2026-09-11')
assert.deepEqual(
  { year: bahrain.year, month: bahrain.month, day: bahrain.day },
  { year: 1448, month: 3, day: 29 },
  'Bahrain regression date should remain stable',
)
assert.doesNotThrow(
  () => bahrainHijriToIso(9999, 1, 1),
  'AH year 9999 should remain within the supported input range',
)

const regional = getRegionalCalendarData({ year: 2026, month: 9, day: 11 })
assert.equal(regional.length, 12, 'Every regional calendar should return its own result')
assert.ok(regional.every((result) => result.status), 'Every regional result should report status')
assert.match(
  regional.find((result) => result.id === 'vikram-samvat').formatted,
  /^Bhadrapada · waxing 1/,
  'The new lunar month should use the latest preceding conjunction',
)

const facts = getDateFacts(2026, 9, 11)
const ancient = getAncientCalendarData({ year: 2026, month: 9, day: 11, julianDay: facts.julianDay })
assert.equal(ancient.length, 8, 'Every ancient-calendar model should return its own result')
assert.ok(ancient.every((result) => result.status), 'Every ancient result should report status')

const heritage = getHeritageCalendarData({ year: 2026, month: 9, day: 11, julianDay: facts.julianDay })
assert.deepEqual(
  heritage.map((result) => result.id),
  ['aztec-xiuhpohualli', 'aztec-tonalpohualli', 'inca', 'igbo'],
  'Static Akan and Yoruba references must not be presented as date conversions',
)

console.log('Calendar engines: range, isolation and rollover regression checks passed.')
