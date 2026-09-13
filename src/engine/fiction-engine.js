import { FICTION_SYSTEMS } from '../data/fiction-registry.js'

const DAY_MS = 86400000
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const TAMRIEL_MONTHS = [
  'Morning Star', 'Sun’s Dawn', 'First Seed', 'Rain’s Hand', 'Second Seed', 'Mid Year',
  'Sun’s Height', 'Last Seed', 'Hearthfire', 'Frostfall', 'Sun’s Dusk', 'Evening Star',
]
const TAMRIEL_WEEKDAYS = ['Sundas', 'Morndas', 'Tirdas', 'Middas', 'Turdas', 'Fredas', 'Loredas']
const CHANTRY_MONTHS = [
  'Wintermarch', 'Guardian', 'Drakonis', 'Cloudreach', 'Bloomingtide', 'Justinian',
  'Solace', 'August', 'Kingsway', 'Harvestmere', 'Firstfall', 'Haring',
]
const TEVINTER_MONTHS = [
  'Verimensis', 'Pluitanis', 'Nubulis', 'Eluviesta', 'Molioris', 'Ferventis',
  'Solis', 'Matrinalis', 'Parvulis', 'Frumentum', 'Umbralis', 'Cassus',
]

const mod = (value, divisor) => ((value % divisor) + divisor) % divisor
const signed = (value) => value < 0 ? `−${Math.abs(value)}` : String(value)
const ordinal = (value) => {
  const remainder100 = value % 100
  const suffix = remainder100 >= 11 && remainder100 <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' }[value % 10] ?? 'th')
  return `${value}${suffix}`
}

function dateParts(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day))
  const start = Date.UTC(year, 0, 1)
  const dayOfYear = Math.floor((date.getTime() - start) / DAY_MS) + 1
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  return { date, dayOfYear, daysInYear: leap ? 366 : 365, leap }
}

function fillMonth(cycle, name, length) {
  for (let day = 1; day <= length; day += 1) cycle.push(`${day} ${name}`)
}

function shireCycle(leap) {
  const cycle = ['2 Yule']
  ;['Afteryule', 'Solmath', 'Rethe', 'Astron', 'Thrimidge', 'Forelithe']
    .forEach((month) => fillMonth(cycle, month, 30))
  cycle.push('1 Lithe', 'Mid-year’s Day')
  if (leap) cycle.push('Overlithe')
  cycle.push('2 Lithe')
  ;['Afterlithe', 'Wedmath', 'Halimath', 'Winterfilth', 'Blotmath', 'Foreyule']
    .forEach((month) => fillMonth(cycle, month, 30))
  cycle.push('1 Yule')
  return cycle
}

function kingsCycle(leap) {
  const cycle = ['Yestarë']
  ;['Narvinyë', 'Nénimë', 'Súlimë', 'Víressë', 'Lótessë'].forEach((month) => fillMonth(cycle, month, 30))
  fillMonth(cycle, 'Nárië', 31)
  cycle.push(leap ? 'Enderi I' : 'Loëndë')
  if (leap) cycle.push('Enderi II')
  fillMonth(cycle, 'Cermië', 31)
  ;['Úrimë', 'Yavannië', 'Narquelië', 'Hísimë', 'Ringarë'].forEach((month) => fillMonth(cycle, month, 30))
  cycle.push('Mettarë')
  return cycle
}

function stewardsCycle(leap) {
  const cycle = ['Yestarë']
  ;['Narvinyë', 'Nénimë', 'Súlimë'].forEach((month) => fillMonth(cycle, month, 30))
  cycle.push('Tuilérë')
  ;['Víressë', 'Lótessë', 'Nárië'].forEach((month) => fillMonth(cycle, month, 30))
  cycle.push('Loëndë')
  if (leap) cycle.push('Cormarë')
  ;['Cermië', 'Úrimë', 'Yavannië'].forEach((month) => fillMonth(cycle, month, 30))
  cycle.push('Yáviérë')
  ;['Narquelië', 'Hísimë', 'Ringarë'].forEach((month) => fillMonth(cycle, month, 30))
  cycle.push('Mettarë')
  return cycle
}

function rivendellCycle(leap) {
  const cycle = ['Yestarë']
  fillMonth(cycle, 'Tuilë', 54)
  fillMonth(cycle, 'Lairë', 72)
  cycle.push('Enderi I', 'Enderi II', 'Enderi III')
  if (leap) cycle.push('Extra Enderë')
  fillMonth(cycle, 'Yávië', 54)
  fillMonth(cycle, 'Quellë', 54)
  fillMonth(cycle, 'Hrívë', 72)
  fillMonth(cycle, 'Coirë', 54)
  cycle.push('Mettarë')
  return cycle
}

function seasonalAnalogue({ year, month, day }, cycleFactory, anchorLabel) {
  const leap = dateParts(year, month, day).leap
  const cycle = cycleFactory(leap)
  const referenceYear = leap ? 2000 : 2001
  const delta = Math.round((Date.UTC(referenceYear, month - 1, day) - Date.UTC(referenceYear, 8, 10)) / DAY_MS)
  const anchorIndex = cycle.indexOf(anchorLabel)
  return cycle[mod(anchorIndex + delta, cycle.length)]
}

function signedEra(value, positiveEra, negativeEra) {
  return value >= 0 ? `${value} ${positiveEra}` : `${Math.abs(value)} ${negativeEra}`
}

const converters = {
  'star-trek-tng': ({ year, dayOfYear, daysInYear }) => ({
    value: (((year - 2323) * 1000) + ((dayOfYear - 1) / daysInYear) * 1000).toFixed(1),
    secondary: 'Date-only calculation · fraction of day 0',
  }),
  'star-trek-kelvin': ({ year, dayOfYear }) => ({ value: `${year}.${String(dayOfYear).padStart(dayOfYear < 100 ? 2 : 3, '0')}`, secondary: `Ordinal day ${dayOfYear}` }),

  'tolkien-shire': (input) => ({ value: seasonalAnalogue(input, shireCycle, '20 Halimath'), secondary: 'Month/day only · no fabricated Shire year' }),
  'tolkien-kings': (input) => ({ value: seasonalAnalogue(input, kingsCycle, '20 Yavannië'), secondary: 'Month/day only · no fabricated age year' }),
  'tolkien-stewards': (input) => ({ value: seasonalAnalogue(input, stewardsCycle, '21 Yavannië'), secondary: 'Month/day only · no fabricated age year' }),
  'tolkien-new': (input) => ({ value: seasonalAnalogue(input, stewardsCycle, '28 Yavannië'), secondary: 'Month/day only · modern seasonal alignment' }),
  'tolkien-rivendell': (input) => ({ value: seasonalAnalogue(input, rivendellCycle, '43 Yávië'), secondary: 'Season/day only · no fabricated loa number' }),

  'elder-scrolls-calendar': ({ date, month, day }) => ({ value: `${TAMRIEL_WEEKDAYS[date.getUTCDay()]}, ${day} ${TAMRIEL_MONTHS[month - 1]}`, secondary: 'Direct modern month/day synchronization' }),
  'elder-scrolls-era': ({ year }) => ({ value: `4E ${year - 1810}`, secondary: '2011 CE = 4E 201' }),
  'warhammer-40k-imperial': ({ year, dayOfYear, daysInYear }) => ({
    value: `0.${String(Math.floor(((dayOfYear - 1) / daysInYear) * 1000)).padStart(3, '0')}.${String(year % 1000).padStart(3, '0')}.M${Math.floor((year - 1) / 1000) + 1}`,
    secondary: 'Date-only Atlas calculation · check number 0',
  }),
  'star-wars-bby-aby': ({ year }) => ({ value: signedEra(year - 1977, 'ABY', 'BBY'), secondary: 'Atlas bridge: 1977 CE = 0 ABY' }),
  'star-wars-standard-day': ({ year, dayOfYear }) => ({ value: `${signedEra(year - 1977, 'ABY', 'BBY')} · Standard Day ${dayOfYear}`, secondary: '365-day canonical structure · Atlas era sync' }),
  'ninxa-ahdm': ({ bahrainHijri }) => {
    if (!bahrainHijri) throw new Error('Bahrain Hijri result required')
    const ahdm = bahrainHijri.year >= 10000 ? bahrainHijri.year - 9999 : bahrainHijri.year - 10000
    if (ahdm === 0) throw new Error('AHDM has no year zero')
    return { value: `${signed(ahdm)} AHDM · ${bahrainHijri.monthName ?? bahrainHijri.formatted.split(' ')[0]} · ${bahrainHijri.day}`, secondary: `Derived from Bahrain Hijri ${bahrainHijri.year} AH` }
  },
  'bsg-caprican': ({ year, month, day }) => ({ value: `${MONTHS[month - 1]} ${day}, YR${year - 1968}`, secondary: '2010 CE = YR42 · direct month/day sync' }),
  'whf-imperial': ({ year }) => ({ value: `${year + 496} IC`, secondary: 'Approved Atlas year synchronization' }),
  'whf-bretonnian': ({ year }) => ({ value: String(year - 482), secondary: 'Approved Atlas year synchronization' }),
  'whf-gospodar': ({ year }) => ({ value: String(year - 1028), secondary: 'Approved Atlas year synchronization' }),
  'whf-dwarf': ({ year }) => ({ value: String(year + 5019), secondary: 'Approved Atlas year synchronization' }),

  'warcraft-adp': ({ year }) => ({ value: signedEra(year - 1979, 'ADP', 'BDP'), secondary: 'Atlas bridge: 2004 CE = 25 ADP' }),
  'warcraft-kings': ({ year }) => ({ value: String(year - 1387), secondary: '0 ADP = 592 King’s Calendar' }),
  'ffxiv-eorzean': ({ month, day }) => ({ value: `${ordinal(day)} Sun of the ${ordinal(Math.ceil(month / 2))} ${month % 2 === 1 ? 'Astral' : 'Umbral'} Moon`, secondary: 'Modern month/day analogue · no fictional year' }),
  'witcher-elven': ({ year, month, day }) => {
    const referenceYear = dateParts(year, month, day).leap ? 2000 : 2001
    const delta = Math.round((Date.UTC(referenceYear, month - 1, day) - Date.UTC(referenceYear, 8, 10)) / DAY_MS)
    return { value: `${mod(delta + 40, 45) + 1} Lammas\n${ordinal(mod(delta + 6, 30) + 1)} Savaed`, secondary: 'Reconstructed seasonal synchronization' }
  },
  'dragon-age-chantry': ({ year, month, day }) => ({ value: `${day} ${CHANTRY_MONTHS[month - 1]}, 9:${year - 1979} Dragon`, secondary: 'Atlas bridge: 2009 CE = 9:30 Dragon' }),
  'dragon-age-tevinter': ({ year, month, day }) => ({ value: `${day} ${TEVINTER_MONTHS[month - 1]}, ${year + 15} TE`, secondary: 'Approved internal relation · direct month/day sync' }),
  'dragon-age-elven': ({ year }) => ({ value: `${year + 6420} FA`, secondary: 'Year only · no fabricated Elven month/day' }),
  'asoiaf-westerosi': ({ year, month, day }) => ({ value: `${ordinal(day)} day of the ${ordinal(month)} moon, ${year - 1698} AC`, secondary: 'Atlas bridge: 1996 CE = 298 AC' }),
  'eve-yc': ({ year }) => ({ value: `${year - 23236} YC`, secondary: 'Explicit Earth bridge: YC0 = 23236 CE' }),
}

const authorityLabels = {
  'source-derived': '◐ SOURCE-DERIVED',
  'source-defined-format': '● SOURCE-DEFINED FORMAT',
  'tolkien-rules': '◇ TOLKIEN RULES',
  'canonical-structure': '● CANONICAL STRUCTURE',
  'atlas-convention': '◇ ATLAS SYNC',
  'source-based': '● SOURCE-BASED',
  reconstructed: '≈ RECONSTRUCTED',
  'canonical-era': '● CANONICAL ERA',
  canonical: '● CANONICAL',
  'canonical-chronology': '● CANONICAL CHRONOLOGY',
  'source-defined': '◐ SOURCE-DEFINED',
}

function statusLabels(system) {
  const labels = [authorityLabels[system.systemAuthority] ?? '◐ SOURCE-DERIVED']
  if (system.earthBridge === 'atlas-sync' && system.systemAuthority !== 'atlas-convention') labels.push('◇ ATLAS SYNC')
  if (system.earthBridge === 'modern-sync') labels.push('MODERN SYNC')
  if (system.earthBridge === 'reconstructed-sync') labels.push('≈ RECONSTRUCTED SYNC')
  if (system.earthBridge === 'terra-standard') labels.push('TERRA STANDARD')
  if (system.conversionType.includes('proleptic')) labels.push('↔ PROLEPTIC')
  return labels
}

export function getFictionResults({ year, month, day, bahrainHijri }) {
  const parts = dateParts(year, month, day)
  const input = { year, month, day, bahrainHijri, ...parts }

  return FICTION_SYSTEMS.map((system) => {
    const base = {
      id: system.id,
      universe: system.universe,
      name: system.name,
      family: system.family,
      continuity: system.continuity,
      status: system.status,
      symbol: system.symbol,
      statusLabels: statusLabels(system),
      description: system.description,
      sourceAuditRequired: system.sourceAuditRequired,
    }

    try {
      const converted = converters[system.id]
      if (!converted) throw new Error('Converter missing')
      return { ...base, ...converted(input), available: true }
    } catch (error) {
      return { ...base, value: 'Conversion unavailable', secondary: error.message, available: false }
    }
  })
}
