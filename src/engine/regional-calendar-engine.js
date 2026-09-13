import * as Astronomy from 'astronomy-engine'
import bikramSambat from 'bikram-sambat'
import BengaliDate from 'date-bengali-revised'
import balineseCalendar from 'balinese-date-js-lib'

const DAY_MS = 86400000

const BENGALI_MONTHS = [
  'Boishakh', 'Joishtho', 'Asharh', 'Srabon', 'Bhadro', 'Ashwin',
  'Kartik', 'Agrahayan', 'Poush', 'Magh', 'Falgun', 'Chaitro',
]

const BIKRAM_MONTHS = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra',
]

const HINDU_MONTHS = [
  'Chaitra', 'Vaishakha', 'Jyeshtha', 'Ashadha', 'Shravana', 'Bhadrapada',
  'Ashwin', 'Kartika', 'Margashirsha', 'Pausha', 'Magha', 'Phalguna',
]

const TAMIL_MONTHS = [
  'Chithirai', 'Vaikasi', 'Aani', 'Aadi', 'Aavani', 'Purattasi',
  'Aippasi', 'Karthigai', 'Margazhi', 'Thai', 'Maasi', 'Panguni',
]

const MALAYALAM_MONTHS = [
  'Medam', 'Edavam', 'Mithunam', 'Karkidakam', 'Chingam', 'Kanni',
  'Thulam', 'Vrischikam', 'Dhanu', 'Makaram', 'Kumbham', 'Meenam',
]

const NANAKSHAHI_MONTHS = [
  'Chet', 'Vaisakh', 'Jeth', 'Harh', 'Sawan', 'Bhadon',
  'Assu', 'Katak', 'Maghar', 'Poh', 'Magh', 'Phagun',
]

const BURMESE_MONTHS = [
  'Tagu', 'Kason', 'Nayon', 'Waso', 'Wagaung', 'Tawthalin',
  'Thadingyut', 'Tazaungmon', 'Nadaw', 'Pyatho', 'Tabodwe', 'Tabaung',
]

const KHMER_MONTHS = [
  'Chaet', 'Pisakh', 'Chesth', 'Asadh', 'Srapon', 'Pheaktrobot',
  'Assuj', 'Kattik', 'Migasir', 'Pous', 'Meak', 'Phalgun',
]

const JAVANESE_MONTHS = [
  'Sura', 'Sapar', 'Mulud', 'Bakda Mulud', 'Jumadilawal', 'Jumadilakir',
  'Rejeb', 'Ruwah', 'Pasa', 'Sawal', 'Dulkangidah', 'Besar',
]

const JAVANESE_WEEKDAYS = ['Minggu', 'Senen', 'Selasa', 'Rebo', 'Kemis', 'Jemuwah', 'Setu']
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon']

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
  return Math.round((end.getTime() - start.getTime()) / DAY_MS)
}

function phaseDay(tithi) {
  return tithi <= 15 ? `waxing ${tithi}` : `waning ${tithi - 15}`
}

function bengaliDate(year, month, day) {
  const result = new BengaliDate().fromDate(utcDate(year, month, day))
  return `${result.day} ${BENGALI_MONTHS[result.month - 1]} ${result.year} BS`
}

function bikramDate(year, month, day) {
  const iso = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const result = bikramSambat.toBik(iso)
  return `${result.day} ${BIKRAM_MONTHS[result.month - 1]} ${result.year} BS`
}

function lahiriAyanamsa(date) {
  const decimalYear = date.getUTCFullYear() + (date.getUTCMonth() + .5) / 12
  return 23.853055 + .013968 * (decimalYear - 2000)
}

function siderealSunSign(date) {
  return Math.floor(mod(Astronomy.SunPosition(date).elon - lahiriAyanamsa(date), 360) / 30)
}

function siderealSolarDate(year, month, day) {
  const date = utcDate(year, month, day)
  const sign = siderealSunSign(date)
  let ingress = date

  for (let offset = 1; offset <= 35; offset += 1) {
    const candidate = new Date(date.getTime() - offset * DAY_MS)
    if (siderealSunSign(candidate) !== sign) break
    ingress = candidate
  }

  return { sign, day: dayDifference(ingress, date) + 1 }
}

function lunarReferenceDate(year, month, day) {
  const date = utcDate(year, month, day)
  const elongation = mod(
    Astronomy.EclipticGeoMoon(date).lon - Astronomy.SunPosition(date).elon,
    360,
  )
  const tithi = Math.floor(elongation / 12) + 1
  let previousNewMoon
  let candidate = Astronomy.SearchMoonPhase(0, new Date(date.getTime() - 40 * DAY_MS), 45)?.date

  while (candidate && candidate <= date) {
    previousNewMoon = candidate
    candidate = Astronomy.SearchMoonPhase(0, new Date(candidate.getTime() + 60000), 40)?.date
  }

  const nextNewMoon = candidate
  const sign = previousNewMoon ? siderealSunSign(previousNewMoon) : siderealSunSign(date)
  const nextSign = nextNewMoon ? siderealSunSign(nextNewMoon) : sign

  return {
    monthIndex: mod(sign + 1, 12),
    phaseDay: phaseDay(tithi),
    leapMonth: nextSign === sign,
  }
}

function nanakshahiDate(year, month, day) {
  const date = utcDate(year, month, day, 0)
  let startYear = year
  let start = utcDate(startYear, 3, 14, 0)

  if (date < start) {
    startYear -= 1
    start = utcDate(startYear, 3, 14, 0)
  }

  let offset = dayDifference(start, date)
  const yearLength = dayDifference(start, utcDate(startYear + 1, 3, 14, 0))
  const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, yearLength - 335]
  let monthIndex = 0

  while (offset >= monthLengths[monthIndex] && monthIndex < 11) {
    offset -= monthLengths[monthIndex]
    monthIndex += 1
  }

  return `${offset + 1} ${NANAKSHAHI_MONTHS[monthIndex]} ${startYear - 1468} NS`
}

function islamicCivilParts(year, month, day) {
  const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-civil', {
    year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC',
  })
  const parts = Object.fromEntries(
    formatter.formatToParts(utcDate(year, month, day)).map((part) => [part.type, part.value]),
  )
  return { year: Number(parts.year), month: Number(parts.month), day: Number(parts.day) }
}

function javaneseDate(year, month, day) {
  const islamic = islamicCivilParts(year, month, day)
  const date = utcDate(year, month, day, 0)
  const daysSinceEpoch = dayDifference(utcDate(1970, 1, 1, 0), date)
  const weekday = JAVANESE_WEEKDAYS[date.getUTCDay()]
  const pasaran = PASARAN[mod(daysSinceEpoch + 3, 5)]
  return `${weekday} ${pasaran} · ${islamic.day} ${JAVANESE_MONTHS[islamic.month - 1]} ${islamic.year + 512} AJ`
}

function result(id, name, family, formatted, description, status = 'ok') {
  return { id, name, family, formatted, description, status }
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

export function getRegionalCalendarData({ year, month, day }) {
  let solar
  let solarError
  let lunar
  let lunarError

  try { solar = siderealSolarDate(year, month, day) } catch (error) { solarError = error }
  try { lunar = lunarReferenceDate(year, month, day) } catch (error) { lunarError = error }

  const requireSolar = () => {
    if (!solar) throw solarError ?? new Error('Solar calculation unavailable')
    return solar
  }
  const requireLunar = () => {
    if (!lunar) throw lunarError ?? new Error('Lunar calculation unavailable')
    return lunar
  }

  return [
    safeResult('vikram-samvat', 'Vikram Samvat', 'Indian', 'Astronomical amānta lunisolar reference variant.', () => {
      const value = requireLunar()
      const hinduMonth = `${value.leapMonth ? 'Adhika ' : ''}${HINDU_MONTHS[value.monthIndex]}`
      return `${hinduMonth} · ${value.phaseDay}, ${year + (month >= 3 ? 57 : 56)} VS`
    }),
    safeResult('nepali-bikram-sambat', 'Bikram Sambat', 'South Asian', 'Published Nepali civil-calendar conversion.', () => bikramDate(year, month, day)),
    safeResult('bengali', 'Bengali Calendar', 'South Asian', 'Revised civil calendar used in Bangladesh.', () => bengaliDate(year, month, day)),
    safeResult('tamil', 'Tamil Calendar', 'South Asian', 'Lahiri sidereal-solar reference calculation.', () => {
      const value = requireSolar()
      return `${value.day} ${TAMIL_MONTHS[value.sign]} ${year - (month >= 4 ? 78 : 79)} Saka`
    }),
    safeResult('malayalam', 'Malayalam Calendar', 'South Asian', 'Kollam-era sidereal-solar reference calculation.', () => {
      const value = requireSolar()
      return `${value.day} ${MALAYALAM_MONTHS[value.sign]} ${year - (value.sign >= 4 ? 824 : 825)} ME`
    }),
    safeResult('jain', 'Jain Calendar', 'Indian', 'Jain lunisolar reference using the Vira Nirvana era.', () => {
      const value = requireLunar()
      const hinduMonth = `${value.leapMonth ? 'Adhika ' : ''}${HINDU_MONTHS[value.monthIndex]}`
      return `${hinduMonth} · ${value.phaseDay}, ${year + (month >= 11 ? 527 : 526)} VNS`
    }),
    safeResult('nanakshahi', 'Nanakshahi Calendar', 'Sikh', 'Fixed solar Nanakshahi calendar.', () => nanakshahiDate(year, month, day)),
    safeResult('thai-lunar', 'Thai Lunar Calendar', 'Southeast Asian', 'Astronomical Thai lunar reference; observance can vary.', () => {
      const value = requireLunar()
      return `Month ${mod(value.monthIndex + 4, 12) + 1} · ${value.phaseDay}, ${year + 543} BE`
    }),
    safeResult('burmese', 'Burmese Calendar', 'Southeast Asian', 'Astronomical Myanmar lunisolar reference; official watat rules can vary.', () => {
      const value = requireLunar()
      return `${BURMESE_MONTHS[value.monthIndex]} · ${value.phaseDay}, ${year - (month >= 4 ? 638 : 639)} ME`
    }),
    safeResult('khmer', 'Khmer Calendar', 'Southeast Asian', 'Astronomical Khmer lunar reference; observance can vary.', () => {
      const value = requireLunar()
      return `${KHMER_MONTHS[value.monthIndex]} · ${value.phaseDay}, ${year + 543} BE`
    }),
    safeResult('balinese-pawukon', 'Balinese Pawukon', 'Indonesian', 'Day in the repeating 210-day Pawukon cycle.', () => {
      const BalineseDate = balineseCalendar.BalineseDate
      const balinese = new BalineseDate(new Date(year, month - 1, day, 12))
      return `${balinese.saptaWara.name} ${balinese.pancaWara.name} · Wuku ${balinese.wuku.name}`
    }),
    safeResult('javanese', 'Javanese Calendar', 'Indonesian', 'Tabular Javanese lunar date with weekday and pasaran.', () => javaneseDate(year, month, day)),
  ]
}
