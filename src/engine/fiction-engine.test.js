import assert from 'node:assert/strict'
import { FICTION_GROUP_ORDER, FICTION_SYSTEMS } from '../data/fiction-registry.js'
import { getFictionResults } from './fiction-engine.js'

const fixtureHijri = { year: 1448, month: 3, monthName: 'Rabiʻ I', day: 28 }

function resultsFor(year, month, day, bahrainHijri = fixtureHijri) {
  return new Map(getFictionResults({ year, month, day, bahrainHijri }).map((result) => [result.id, result]))
}

const fixture = resultsFor(2026, 9, 10)
const expected = {
  'star-trek-tng': '-296309.6',
  'star-trek-kelvin': '2026.253',
  'tolkien-shire': '20 Halimath',
  'tolkien-kings': '20 Yavannië',
  'tolkien-stewards': '21 Yavannië',
  'tolkien-new': '28 Yavannië',
  'tolkien-rivendell': '43 Yávië',
  'elder-scrolls-calendar': 'Turdas, 10 Hearthfire',
  'elder-scrolls-era': '4E 216',
  'warhammer-40k-imperial': '0.690.026.M3',
  'star-wars-bby-aby': '49 ABY',
  'star-wars-standard-day': '49 ABY · Standard Day 253',
  'ninxa-ahdm': '−8552 AHDM · Rabiʻ I · 28',
  'bsg-caprican': 'September 10, YR58',
  'whf-imperial': '2522 IC',
  'whf-bretonnian': '1544',
  'whf-gospodar': '998',
  'whf-dwarf': '7045',
  'warcraft-adp': '47 ADP',
  'warcraft-kings': '639',
  'ffxiv-eorzean': '10th Sun of the 5th Astral Moon',
  'witcher-elven': '41 Lammas\n7th Savaed',
  'dragon-age-chantry': '10 Kingsway, 9:47 Dragon',
  'dragon-age-tevinter': '10 Parvulis, 2041 TE',
  'dragon-age-elven': '8446 FA',
  'asoiaf-westerosi': '10th day of the 9th moon, 328 AC',
}

for (const [id, value] of Object.entries(expected)) {
  assert.equal(fixture.get(id)?.value, value, `${id} regression value`)
  assert.equal(fixture.get(id)?.available, true, `${id} should be implemented`)
}

assert.equal(FICTION_SYSTEMS.length, 27)
assert.equal(FICTION_SYSTEMS.every(({ status, sourceAuditRequired }) => status === 'implemented' && !sourceAuditRequired), true)
assert.equal(FICTION_GROUP_ORDER.length, 14)

for (const removed of ['Halo', 'Fallout', 'Doctor Who', 'Stargate', 'Babylon 5', 'Pokémon', 'Zelda', 'Avatar']) {
  assert.equal(FICTION_SYSTEMS.some(({ universe }) => universe.includes(removed)), false, `${removed} must remain removed`)
}

for (const [year, month, day, ordinal] of [
  [2024, 2, 29, 60],
  [2026, 1, 1, 1],
  [2026, 12, 31, 365],
  [1200, 1, 1, 1],
]) {
  const result = resultsFor(year, month, day)
  assert.equal(result.get('star-trek-kelvin').value, `${year}.${String(ordinal).padStart(ordinal < 100 ? 2 : 3, '0')}`)
  assert.equal([...result.values()].length, 27)
}

assert.equal(resultsFor(1977, 1, 1).get('star-wars-bby-aby').value, '0 ABY')
assert.equal(resultsFor(1976, 1, 1).get('star-wars-bby-aby').value, '1 BBY')
assert.equal(resultsFor(1979, 1, 1).get('warcraft-adp').value, '0 ADP')
assert.equal(resultsFor(1978, 1, 1).get('warcraft-adp').value, '1 BDP')
assert.equal(resultsFor(2026, 9, 10, { year: 9999, monthName: 'Test', day: 1 }).get('ninxa-ahdm').value, '−1 AHDM · Test · 1')
assert.equal(resultsFor(2026, 9, 10, { year: 10000, monthName: 'Test', day: 1 }).get('ninxa-ahdm').value, '1 AHDM · Test · 1')
assert.ok(!resultsFor(2026, 9, 10, { year: 10000, monthName: 'Test', day: 1 }).get('ninxa-ahdm').value.includes('0 AHDM'))

console.log('Fiction engine: 27 processable cards; all regression checks passed.')
