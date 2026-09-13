const DAY_MS = 86400000

const AZTEC_DAY_SIGNS = [
  'Cipactli', 'Ehecatl', 'Calli', 'Cuetzpalin', 'Coatl',
  'Miquiztli', 'Mazatl', 'Tochtli', 'Atl', 'Itzcuintli',
  'Ozomahtli', 'Malinalli', 'Acatl', 'Ocelotl', 'Cuauhtli',
  'Cozcacuauhtli', 'Ollin', 'Tecpatl', 'Quiahuitl', 'Xochitl',
]

const AZTEC_MONTHS = [
  'Atlcahualo', 'Tlacaxipehualiztli', 'Tozoztontli', 'Hueytozoztli',
  'Toxcatl', 'Etzalcualiztli', 'Tecuilhuitontli', 'Hueytecuilhuitl',
  'Tlaxochimaco', 'Xocotlhuetzi', 'Ochpaniztli', 'Teotleco',
  'Tepeilhuitl', 'Quecholli', 'Panquetzaliztli', 'Atemoztli',
  'Tititl', 'Izcalli', 'Nemontemi',
]

const INCA_MONTHS = [
  'Camay Quilla', 'Hatun Pucuy Quilla', 'Pacha Pucuy Quilla',
  'Ayrihua Quilla', 'Aymoray Quilla', 'Haucai Cusqui Quilla',
  'Chacra Conaqui Quilla', 'Chacra Yapuy Quilla', 'Coia Raymi Quilla',
  'Uma Raymi Quilla', 'Ayamarca Quilla', 'Cápac Raymi Quilla',
]

const IGBO_MARKET_DAYS = ['Eke', 'Orie', 'Afọ', 'Nkwọ']

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor
}

function utcDate(year, month, day) {
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(0, 0, 0, 0)
  return date
}

function result(id, name, family, formatted, description) {
  return { id, name, family, formatted, description, status: 'ok' }
}

export function getTonalpohualliData(julianDay) {
  // Caso–Nicholson correlation: 23 August 1521 Gregorian = 1 Coatl.
  const offset = Math.floor(julianDay + .5) - 2276828
  const number = mod(offset, 13) + 1
  const sign = AZTEC_DAY_SIGNS[mod(offset + 4, 20)]
  const trecenaStartOffset = offset - (number - 1)
  const trecenaSign = AZTEC_DAY_SIGNS[mod(trecenaStartOffset + 4, 20)]

  return {
    number,
    sign,
    formatted: `${number} ${sign}`,
    trecena: `1 ${trecenaSign}`,
  }
}

function tonalpohualliDate(julianDay) {
  return `${getTonalpohualliData(julianDay).formatted} · Caso correlation`
}

function xiuhpohualliDate(year, month, day) {
  const date = utcDate(year, month, day)
  let start = utcDate(year, 2, 23)
  if (date < start) start = utcDate(year - 1, 2, 23)
  const offset = Math.floor((date - start) / DAY_MS)
  const cycleDay = mod(offset, 365)
  const monthIndex = cycleDay < 360 ? Math.floor(cycleDay / 20) : 18
  const monthDay = cycleDay < 360 ? cycleDay % 20 + 1 : cycleDay - 359
  return `${AZTEC_MONTHS[monthIndex]} ${monthDay} · reference`
}

function igboMarketDay(julianDay) {
  // Contemporary reference anchor: 1 January 2025 = Eke.
  const offset = Math.floor(julianDay + .5) - 2460677
  return `${IGBO_MARKET_DAYS[mod(offset, 4)]} · four-day market cycle`
}

export function getHeritageCalendarData({ year, month, day, julianDay }) {
  return [
    result('aztec-xiuhpohualli', 'Xiuhpohualli', 'Mesoamerican — Aztec', xiuhpohualliDate(year, month, day), 'Caso–Nicholson-style 365-day reference alignment; correlations vary.'),
    result('aztec-tonalpohualli', 'Tonalpohualli', 'Mesoamerican — Aztec', tonalpohualliDate(julianDay), '260-day ritual count using the Caso–Nicholson correlation.'),
    result('inca', 'Inca Seasonal Reference', 'Andean', `${INCA_MONTHS[month - 1]} · seasonal reference`, 'Reconstructed seasonal month correspondence; this is not an exact historical date conversion.'),
    result('igbo', 'Igbo Calendar', 'African Traditional', igboMarketDay(julianDay), 'Four-day Igbo market cycle using a stated contemporary reference anchor.'),
  ]
}
