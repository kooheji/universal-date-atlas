const text = (value) => `${value}\uFE0E`

const SYMBOLS = {
  calendar: {
    gregory: text('☀'), 'islamic-umalqura': text('☾'), 'islamic-civil': text('☾'),
    'islamic-tbla': text('☾'), persian: text('☼'), hebrew: text('✡'),
    chinese: text('☯'), dangi: '한', japanese: '和', roc: '中',
    buddhist: text('☸'), indian: 'श', coptic: text('☥'),
    ethiopic: text('✚'), ethioaa: text('✚'),
  },
  chronology: {
    'julian-day': 'JD', 'modified-julian-day': 'MJD',
    'julian-calendar': 'J', 'iso-week-date': 'W', 'iso-ordinal-date': '#',
    'international-fixed': '13', 'world-calendar': text('⊕'), discordian: text('✦'),
    'french-republican': text('⚜'), holocene: 'HE', 'roman-auc': 'Ⅻ',
    'byzantine-am': text('☦'), 'rata-die': 'RD', 'lilian-day': 'LD',
    'unix-date': '>_', 'gps-week': text('⌖'),
  },
  astronomy: {
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
  if (group === 'culture' && key.includes('Zodiac')) {
    const sign = Object.keys(ZODIAC).find((name) => value.includes(name))
    if (sign) return ZODIAC[sign]
  }

  if (group === 'culture' && key === 'Planetary Weekday Ruler') {
    const planet = Object.keys(PLANETS).find((name) => value.includes(name))
    if (planet) return PLANETS[planet]
  }

  return SYMBOLS[group]?.[key] ?? text('◇')
}

export function symbolBadge(symbol) {
  return `<span class="card-symbol" aria-hidden="true">${symbol}</span>`
}
