const text = (value) => `${value}\uFE0E`

const calendarSvgModules = import.meta.glob('../assets/calendar-symbols/*.svg', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

const CALENDAR_SVG_ORDER = [
  'gregory',
  'julian-calendar',
  'international-fixed',
  'french-republican',
  'islamic-bahrain',
  'islamic-umalqura',
  'islamic-civil',
  'persian',
  'zoroastrian',
  'hebrew',
  'chinese',
  'dangi',
  'japanese',
  'roc',
  'indian',
  'vikram-samvat',
  'nepali-bikram-sambat',
  'bengali',
  'tamil',
  'malayalam',
  'jain',
  'nanakshahi',
  'buddhist',
  'thai-lunar',
  'burmese',
  'khmer',
  'balinese-pawukon',
  'javanese',
  'coptic',
  'ethiopic',
  'ethioaa',
  'armenian',
  'bahai',
  'ancient-egyptian',
  'berber',
  'babylonian',
  'assyrian',
  'attic',
  'roman-republican',
  'maya-tzolkin',
  'maya-haab',
  'maya-calendar-round',
  'aztec-xiuhpohualli',
  'aztec-tonalpohualli',
  'inca',
  'igbo',
  'discordian',
]

const CALENDAR_SVGS = Object.fromEntries(CALENDAR_SVG_ORDER.map((id, index) => {
  const number = String(index + 1).padStart(2, '0')
  const source = calendarSvgModules[`../assets/calendar-symbols/calendars-${number}.svg`]
  const svg = source
    ? `<span class="calendar-symbol-svg" style="--calendar-symbol: url('${source}')"></span>`
    : null

  return [id, svg]
}).filter(([, svg]) => svg))

const chronologySvgModules = import.meta.glob('../assets/chronology-symbols/*.svg', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

const CHRONOLOGY_SVG_ORDER = [
  'iso-week-date',
  'iso-ordinal-date',
  'julian-day',
  'modified-julian-day',
  'rata-die',
  'lilian-day',
  'unix-time',
  'unix-day-number',
  'gps-week',
  'gps-day',
  'roman-auc',
  'byzantine-am',
  'seleucid-era',
  'olympiad-dating',
  'amazigh-era',
  'holocene',
  'maya-long-count',
  'alexandrian-era',
  'indiction-cycle',
  'era-of-martyrs',
  'spanish-era',
]

const CHRONOLOGY_SVGS = Object.fromEntries(CHRONOLOGY_SVG_ORDER.map((id, index) => {
  const number = String(index + 1).padStart(2, '0')
  const source = chronologySvgModules[`../assets/chronology-symbols/chronology-${number}.svg`]
  const svg = source
    ? `<span class="chronology-symbol-svg" style="--chronology-symbol: url('${source}')"></span>`
    : null

  return [id, svg]
}).filter(([, svg]) => svg))

const traditionSvgModules = import.meta.glob('../assets/tradition-symbols/*.svg', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

const TRADITION_SVG_ORDER = [
  'Western Tropical Zodiac',
  'Moon Tropical Zodiac',
  'Zodiac Degree',
  'Planetary Weekday Ruler',
  'Sidereal Zodiac',
  'Vedic Rāśi',
  'Nakshatra — 27 Lunar Mansions',
  'Nakshatra Pada',
  'Vedic Moon Sign',
  'Manāzil al-Qamar',
  'Traditional Arabic Star Association',
  'Chinese Zodiac Animal',
  'Chinese Element',
  'Yin / Yang',
  'Chinese Sexagenary Year',
  'Chinese Sexagenary Month',
  'Chinese Sexagenary Day',
  'Heavenly Stem',
  'Earthly Branch',
  'Year Pillar',
  'Month Pillar',
  'Day Pillar',
  'Hour Pillar',
  'Tzolkʼin Day Number',
  'Tzolkʼin Day Name',
  'Haabʼ Position',
  'Calendar Round Association',
  'Tonalpohualli Day Number',
  'Tonalpohualli Day Sign',
  'Associated Trecena',
  'Wheel of the Year',
  'Seasonal Festivals',
  'Quarter Days',
  'Cross-Quarter Days',
  'Celtic Tree Calendar / Tree Zodiac',
  'Day Planet',
  'Traditional Planetary Hour',
  'Classical Planet Association',
  'Digital Root of Date',
  'Date Number',
  'Life-Path-Style Calculation',
]

const TRADITION_SVGS = Object.fromEntries(TRADITION_SVG_ORDER.map((name, index) => {
  const number = String(index + 1).padStart(2, '0')
  const source = traditionSvgModules[`../assets/tradition-symbols/tradition-${number}.svg`]
  const svg = source
    ? `<span class="tradition-symbol-svg" style="--tradition-symbol: url('${source}')"></span>`
    : null

  return [name, svg]
}).filter(([, svg]) => svg))

const fictionSvgModules = import.meta.glob('../assets/fiction-symbols/*.svg', {
  eager: true,
  query: '?url&no-inline',
  import: 'default',
})

const FICTION_SVG_FILES = {
  'star-trek-tng': 1,
  'star-trek-kelvin': 2,
  'tolkien-shire': 3,
  'tolkien-kings': 4,
  'tolkien-stewards': 5,
  'tolkien-new': 6,
  'tolkien-rivendell': 7,
  'elder-scrolls-calendar': 8,
  'elder-scrolls-era': 9,
  'warhammer-40k-imperial': 10,
  'star-wars-bby-aby': 11,
  'star-wars-standard-day': 12,
  'ninxa-ahdm': 'ninxa',
  'bsg-caprican': 13,
  'whf-imperial': 14,
  'whf-bretonnian': 15,
  'whf-gospodar': 16,
  'whf-dwarf': 17,
  'warcraft-adp': 18,
  'warcraft-kings': 19,
  'ffxiv-eorzean': 20,
  'witcher-elven': 21,
  'dragon-age-chantry': 22,
  'dragon-age-tevinter': 23,
  'dragon-age-elven': 24,
  'asoiaf-westerosi': 25,
  'eve-yc': 26,
}

const FICTION_SVGS = Object.fromEntries(Object.entries(FICTION_SVG_FILES).map(([id, fileNumber]) => {
  const filename = typeof fileNumber === 'number'
    ? `fiction-${String(fileNumber).padStart(2, '0')}`
    : fileNumber
  const source = fictionSvgModules[`../assets/fiction-symbols/${filename}.svg`]
  const svg = source
    ? `<span class="fiction-symbol-svg" style="--fiction-symbol: url('${source}')"></span>`
    : null

  return [id, svg]
}).filter(([, svg]) => svg))

const MENORAH = `
  <svg class="menorah-symbol" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 11v64M39 14v12c0 9 4 15 11 18M61 14v12c0 9-4 15-11 18M28 18v14c0 14 8 22 22 25M72 18v14c0 14-8 22-22 25M17 24v13c0 20 13 32 33 34M83 24v13c0 20-13 32-33 34M42 75v9h16v-9M34 90h32" />
  </svg>
`

const ROMAN_EAGLE = `
  <svg class="roman-eagle-symbol" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 23c5-7 12-9 18-7-4 2-7 5-8 9 7 1 12 4 16 9-8-2-14 0-19 5" />
    <path d="M50 34c-8-9-19-15-34-17 5 6 11 11 18 15-9-2-17-1-24 1 8 6 17 10 27 12-9 0-17 3-23 7 9 3 18 4 28 2" />
    <path d="M50 34c8-9 19-15 34-17-5 6-11 11-18 15 9-2 17-1 24 1-8 6-17 10-27 12 9 0 17 3 23 7-9 3-18 4-28 2" />
    <path d="M43 40c0 13 2 24 7 34 5-10 7-21 7-34M37 76h26M41 84h18M50 74v10" />
  </svg>
`

const SYMBOLS = {
  calendar: {
    gregory: text('☀'), 'islamic-bahrain': text('☾'), islamic: text('☾'),
    'islamic-rgsa': text('☾'), 'islamic-umalqura': text('☾'), 'islamic-civil': text('☾'),
    persian: text('☼'), hebrew: MENORAH,
    'julian-calendar': 'J', 'iso-week-date': 'W',
    'iso-ordinal-date': '#', 'international-fixed': '13',
    'french-republican': text('⚜'),
    zoroastrian: text('☼'),
    armenian: 'Ա', bahai: text('✹'), bengali: 'ব', tamil: 'த', malayalam: 'മ',
    'nepali-bikram-sambat': 'ने', 'vikram-samvat': 'वि', jain: text('ॐ'),
    nanakshahi: 'ੴ', 'thai-lunar': '๑', burmese: 'မ', khmer: 'ក',
    'balinese-pawukon': '210', javanese: 'ꦗ',
    chinese: text('☯'), dangi: '한', japanese: '和', roc: '中',
    buddhist: text('☸'), indian: 'श', coptic: text('☥'),
    ethiopic: text('✚'), ethioaa: text('✚'),
    'ancient-egyptian': text('☥'), berber: 'ⵣ', babylonian: '𒀭',
    assyrian: '𒀭', attic: 'Ω', 'roman-republican': ROMAN_EAGLE,
    'maya-tzolkin': text('◆'), 'maya-haab': text('⊙'),
    'maya-calendar-round': text('◎'), 'aztec-xiuhpohualli': text('☀'),
    'aztec-tonalpohualli': text('◇'), inca: text('☉'), igbo: 'Ị',
    akan: '42', yoruba: 'Ọ', discordian: text('✦'),
    ...CALENDAR_SVGS,
  },
  chronology: {
    'julian-day': 'JD', 'modified-julian-day': 'MJD',
    'julian-calendar': 'J', 'iso-week-date': 'W', 'iso-ordinal-date': '#',
    'international-fixed': '13', 'world-calendar': text('⊕'), discordian: text('✦'),
    'french-republican': text('⚜'), holocene: 'HE', 'roman-auc': 'Ⅻ',
    'byzantine-am': text('☦'), 'rata-die': 'RD', 'lilian-day': 'LD',
    'unix-date': '>_', 'gps-week': text('⌖'),
    'unix-time': '>_', 'unix-day-number': 'UD', 'gps-day': text('⌖'),
    'seleucid-era': 'SE', 'olympiad-dating': 'Ο', 'amazigh-era': 'ⵣ',
    'maya-long-count': 'LC',
    'alexandrian-era': 'AM',
    'indiction-cycle': 'XV',
    'era-of-martyrs': text('☥'), 'spanish-era': 'H',
    ...CHRONOLOGY_SVGS,
  },
  astronomy: {
    Moon: text('☾'), Sun: text('☉'), Planets: text('✦'),
    'Earth & Time': text('⊕'), Seasons: text('◒'),
    Mercury: text('☿'), Venus: text('♀'), Mars: text('♂'),
    Jupiter: text('♃'), Saturn: text('♄'), Uranus: text('♅'), Neptune: text('♆'),
    'Moon Phase': text('☾'), 'Moon Illumination': text('◐'), 'Moon Age': text('◷'),
    'Moon Phase Angle': text('∠'), 'Lunar Illumination Angle': text('∡'),
    'Moon Apparent Magnitude': 'm', 'Earth–Moon Distance': text('↔'),
    'Moon Ecliptic Longitude': 'λ', 'Moon Ecliptic Latitude': 'β',
    'Moon Declination': 'δ', 'Moon Astronomical Constellation': text('✦'),
    'Previous New Moon': text('←●'), 'Next New Moon': text('●→'),
    'Previous Full Moon': text('←○'), 'Next Full Moon': text('○→'),
    'Moon phase': text('☾'), 'Moon illumination': text('◐'),
    'Moon phase angle': text('∠'), 'Lunar illumination angle': text('∡'),
    'Moon distance': text('↔'), 'Moon magnitude': 'm',
    'Moon ecliptic longitude': 'λ', 'Moon ecliptic latitude': 'β',
    'Sun ecliptic longitude': text('☉'), 'Sun ecliptic latitude': text('☉'),
    'Northern season': 'N', 'Southern season': 'S',
    'Greenwich sidereal time': text('★'), 'March Equinox': text('♈'),
    'June Solstice': text('♋'), 'September Equinox': text('♎'),
    'December Solstice': text('♑'),
  },
  culture: {
    'Western Tropical Zodiac': text('☉'), 'Moon Zodiac': text('☽'),
    'Planetary Weekday Ruler': text('⊙'), 'Chinese Zodiac Animal': '生肖',
    'Chinese Element': '五', 'Yin / Yang': text('☯'),
    'Chinese Sexagenary Year': '干支', 'Maya Tzolkʼin': text('◆'),
    'Maya Haabʼ': text('⊙'), 'Maya Calendar Round': text('◎'),
    'Maya Long Count': 'LC',
    ...TRADITION_SVGS,
  },
  fiction: {
    ...FICTION_SVGS,
    default: text('◇'),
  },
}

const ZODIAC = {
  Aries: text('♈'), Taurus: text('♉'), Gemini: text('♊'), Cancer: text('♋'),
  Leo: text('♌'), Virgo: text('♍'), Libra: text('♎'), Scorpio: text('♏'),
  Sagittarius: text('♐'), Capricorn: text('♑'), Aquarius: text('♒'), Pisces: text('♓'),
}

const PLANETS = {
  Sun: text('☉'), Moon: text('☽'), Mars: text('♂'), Mercury: text('☿'),
  Jupiter: text('♃'), Venus: text('♀'), Saturn: text('♄'),
}

export function getSymbol(group, key, value = '') {
  if (group === 'culture' && TRADITION_SVGS[key]) {
    return TRADITION_SVGS[key]
  }

  if (group === 'culture' && key.includes('Zodiac')) {
    const sign = Object.keys(ZODIAC).find((name) => value.includes(name))
    if (sign) return ZODIAC[sign]
  }

  if (group === 'culture' && key === 'Planetary Weekday Ruler') {
    const planet = Object.keys(PLANETS).find((name) => value.includes(name))
    if (planet) return PLANETS[planet]
  }

  return SYMBOLS[group]?.[key] ?? SYMBOLS[group]?.default ?? text('◇')
}

export function symbolBadge(symbol) {
  return `<span class="card-symbol" aria-hidden="true">${symbol}</span>`
}
