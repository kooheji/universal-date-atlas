import * as Astronomy from 'astronomy-engine'

const DAY_MS = 86400000
const TEHRAN = new Astronomy.Observer(35.6892, 51.3890, 1200)
const TEHRAN_OFFSET_MS = 3.5 * 60 * 60 * 1000

const ARMENIAN_MONTHS = [
  'Navasard', 'Hori', 'Sahmi', 'Trē', 'Kʻaghots', 'Arats',
  'Mehekan', 'Areg', 'Ahekan', 'Mareri', 'Margats', 'Hrotits', 'Aweleacʻ',
]

const BADI_MONTHS = [
  'Bahá', 'Jalál', 'Jamál', 'ʻAẓamat', 'Núr', 'Raḥmat', 'Kalimát',
  'Kamál', 'Asmáʼ', 'ʻIzzat', 'Mashíyyat', 'ʻIlm', 'Qudrat', 'Qawl',
  'Masáʼil', 'Sharaf', 'Sulṭán', 'Mulk', 'ʻAláʼ',
]

const EGYPTIAN_MONTHS = [
  'Thoth', 'Phaophi', 'Athyr', 'Choiak', 'Tybi', 'Mechir',
  'Phamenoth', 'Pharmuthi', 'Pachon', 'Payni', 'Epiphi', 'Mesori', 'Epagomenal',
]

const BERBER_MONTHS = [
  'Yennayer', 'Furar', 'Meghres', 'Ibrir', 'Mayyu', 'Yunyu',
  'Yulyuz', 'Ghucht', 'Chtember', 'Tuber', 'Nwanbir', 'Dujember',
]

const BABYLONIAN_MONTHS = [
  'Nisānu', 'Ayyāru', 'Simānu', 'Duʾūzu', 'Abu', 'Ulūlu',
  'Tašrītu', 'Araḫsamna', 'Kislimu', 'Ṭebētu', 'Šabāṭu', 'Addāru', 'Addāru II',
]

const ASSYRIAN_MONTHS = [
  'Nisan', 'Iyar', 'Haziran', 'Tammuz', 'Ab', 'Elul',
  'Tishrin I', 'Tishrin II', 'Kanun I', 'Kanun II', 'Shbat', 'Adar',
]

const ATTIC_MONTHS = [
  'Hekatombaion', 'Metageitnion', 'Boedromion', 'Pyanepsion',
  'Maimakterion', 'Poseideon', 'Gamelion', 'Anthesterion',
  'Elaphebolion', 'Mounichion', 'Thargelion', 'Skirophorion',
]

const ROMAN_MONTHS = [
  'Ianuarius', 'Februarius', 'Martius', 'Aprilis', 'Maius', 'Iunius',
  'Quintilis', 'Sextilis', 'September', 'October', 'November', 'December',
]

function mod(value, divisor) {
  return ((value % divisor) + divisor) % divisor
}

function utcDate(year, month, day, hour = 12) {
  const date = new Date(0)
  date.setUTCFullYear(year, month - 1, day)
  date.setUTCHours(hour, 0, 0, 0)
  return date
}

function dayDifference(start, end) {
  return Math.floor((end.getTime() - start.getTime()) / DAY_MS + .000001)
}

function result(id, name, family, formatted, description) {
  return { id, name, family, formatted, description, status: 'ok' }
}

function safeResult(id, name, family, description, formatter) {
  try {
    return result(id, name, family, formatter(), description)
  } catch (error) {
    return {
      id,
      name,
      family,
      formatted: 'Unavailable for this date',
      description,
      status: 'unsupported',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

function fixedCalendarDate(julianDay, epoch, months, era) {
  const elapsed = Math.floor(julianDay - epoch)
  const year = Math.floor(elapsed / 365) + 1
  const dayOfYear = mod(elapsed, 365)
  const monthIndex = Math.floor(dayOfYear / 30)
  const day = mod(dayOfYear, 30) + 1
  return `${day} ${months[monthIndex]} ${year} ${era}`
}

function julianFromJulianDay(julianDay) {
  const jdn = Math.floor(julianDay + .5)
  const c = jdn + 32082
  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor(1461 * d / 4)
  const m = Math.floor((5 * e + 2) / 153)
  return {
    day: e - Math.floor((153 * m + 2) / 5) + 1,
    month: m + 3 - 12 * Math.floor(m / 10),
    year: d - 4800 + Math.floor(m / 10),
  }
}

function badiYearStart(gregorianYear) {
  const equinox = Astronomy.Seasons(gregorianYear).mar_equinox.date
  const tehran = new Date(equinox.getTime() + TEHRAN_OFFSET_MS)
  const start = utcDate(
    tehran.getUTCFullYear(),
    tehran.getUTCMonth() + 1,
    tehran.getUTCDate(),
    0,
  )
  const localNoonUtc = new Date(Date.UTC(
    tehran.getUTCFullYear(),
    tehran.getUTCMonth(),
    tehran.getUTCDate(),
    8,
    30,
  ))
  const sunset = Astronomy.SearchRiseSet(Astronomy.Body.Sun, TEHRAN, -1, localNoonUtc, 1)?.date
  if (!sunset) throw new Error('Unable to determine Tehran sunset')
  if (equinox >= sunset) start.setUTCDate(start.getUTCDate() + 1)
  return start
}

function badiDate(year, month, day) {
  const date = utcDate(year, month, day, 0)
  let startYear = year
  let start = badiYearStart(startYear)
  if (date < start) {
    startYear -= 1
    start = badiYearStart(startYear)
  }

  const offset = dayDifference(start, date)
  const nextStart = badiYearStart(startYear + 1)
  const intercalaryDays = dayDifference(start, nextStart) - 361
  const badiYear = startYear - 1843

  if (offset < 342) {
    const monthIndex = Math.floor(offset / 19)
    return `${BADI_MONTHS[monthIndex]} ${mod(offset, 19) + 1}, ${badiYear} BE`
  }
  if (offset < 342 + intercalaryDays) {
    return `Ayyám-i-Há ${offset - 341}, ${badiYear} BE`
  }
  return `${BADI_MONTHS[18]} ${offset - 341 - intercalaryDays}, ${badiYear} BE`
}

function berberDate(julianDay) {
  const julian = julianFromJulianDay(julianDay)
  return `${julian.day} ${BERBER_MONTHS[julian.month - 1]} ${julian.year + 950}`
}

function assyrianDate(year, month, day) {
  const startYear = month >= 4 ? year : year - 1
  const monthIndex = mod(month - 4, 12)
  return `${day} ${ASSYRIAN_MONTHS[monthIndex]} ${startYear + 4750} AA`
}

function firstNewMoonAfter(date) {
  return Astronomy.SearchMoonPhase(0, date, 40)?.date
}

function lunarReconstruction(date, start, names) {
  let currentStart = start
  let index = 0

  while (currentStart && index < 14) {
    const next = firstNewMoonAfter(new Date(currentStart.getTime() + DAY_MS))
    if (!next || next > date) break
    currentStart = next
    index += 1
  }

  const safeStart = currentStart && currentStart <= date ? currentStart : start
  return {
    monthIndex: index,
    day: Math.max(1, dayDifference(safeStart, date) + 1),
    name: names[index] ?? `${names.at(-1)} II`,
  }
}

function babylonianDate(year, month, day) {
  const date = utcDate(year, month, day)
  let startYear = year
  let equinox = Astronomy.Seasons(startYear).mar_equinox.date
  let start = firstNewMoonAfter(equinox)
  if (date < start) {
    startYear -= 1
    equinox = Astronomy.Seasons(startYear).mar_equinox.date
    start = firstNewMoonAfter(equinox)
  }
  const lunar = lunarReconstruction(date, start, BABYLONIAN_MONTHS)
  return `${lunar.name} ${lunar.day}, ${startYear + 311} SE`
}

function atticDate(year, month, day) {
  const date = utcDate(year, month, day)
  let startYear = year
  let start = firstNewMoonAfter(Astronomy.Seasons(startYear).jun_solstice.date)
  if (date < start) {
    startYear -= 1
    start = firstNewMoonAfter(Astronomy.Seasons(startYear).jun_solstice.date)
  }
  const lunar = lunarReconstruction(date, start, ATTIC_MONTHS)
  return `${lunar.name} ${lunar.day} · reconstructed`
}

function romanRepublicanDate(julianDay) {
  const julian = julianFromJulianDay(julianDay)
  return `${julian.day} ${ROMAN_MONTHS[julian.month - 1]} ${julian.year + 753} AUC`
}

export function getAncientCalendarData({ year, month, day, julianDay }) {
  return [
    safeResult('armenian', 'Armenian Calendar', 'Christian & Liturgical', 'Traditional fixed 365-day Armenian calendar.', () => fixedCalendarDate(julianDay, 1922867.5, ARMENIAN_MONTHS, 'AM')),
    safeResult('bahai', 'Baháʼí / Badíʿ Calendar', 'Christian & Liturgical', 'Solar calendar of nineteen months; Naw-Rúz follows the Tehran equinox-and-sunset rule.', () => badiDate(year, month, day)),
    safeResult('ancient-egyptian', 'Ancient Egyptian Civil Calendar', 'Ancient Egyptian', 'Nabonassar-era reconstruction of the fixed 365-day civil calendar.', () => fixedCalendarDate(julianDay, 1448637.5, EGYPTIAN_MONTHS, 'NE')),
    safeResult('berber', 'Berber Calendar', 'North African', 'Modern proleptic Amazigh-era representation of the agrarian calendar.', () => berberDate(julianDay)),
    safeResult('babylonian', 'Babylonian Calendar', 'Mesopotamian', 'Astronomical lunar reconstruction; historical intercalation varied.', () => babylonianDate(year, month, day)),
    safeResult('assyrian', 'Modern Assyrian Calendar', 'Mesopotamian', 'Modern Assyrian era calendar aligned to the solar year.', () => assyrianDate(year, month, day)),
    safeResult('attic', 'Attic / Athenian Reconstruction', 'Ancient Greek', 'Astronomical reconstruction; historical month declarations varied.', () => atticDate(year, month, day)),
    safeResult('roman-republican', 'Roman Republican Reconstruction', 'Roman', 'Proleptic Julian correspondence with Roman names and AUC; not an exact Republican conversion.', () => romanRepublicanDate(julianDay)),
  ]
}
