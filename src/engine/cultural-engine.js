const ZODIAC_SIGNS = [
  {
    name: 'Aries',
    symbol: '♈',
  },
  {
    name: 'Taurus',
    symbol: '♉',
  },
  {
    name: 'Gemini',
    symbol: '♊',
  },
  {
    name: 'Cancer',
    symbol: '♋',
  },
  {
    name: 'Leo',
    symbol: '♌',
  },
  {
    name: 'Virgo',
    symbol: '♍',
  },
  {
    name: 'Libra',
    symbol: '♎',
  },
  {
    name: 'Scorpio',
    symbol: '♏',
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
  },
  {
    name: 'Capricorn',
    symbol: '♑',
  },
  {
    name: 'Aquarius',
    symbol: '♒',
  },
  {
    name: 'Pisces',
    symbol: '♓',
  },
]


const PLANETARY_WEEKDAYS = {
  Sunday: {
    body: 'Sun',
    symbol: '☉',
  },

  Monday: {
    body: 'Moon',
    symbol: '☾',
  },

  Tuesday: {
    body: 'Mars',
    symbol: '♂',
  },

  Wednesday: {
    body: 'Mercury',
    symbol: '☿',
  },

  Thursday: {
    body: 'Jupiter',
    symbol: '♃',
  },

  Friday: {
    body: 'Venus',
    symbol: '♀',
  },

  Saturday: {
    body: 'Saturn',
    symbol: '♄',
  },
}


const CHINESE_STEMS = {
  jia: {
    element: 'Wood',
    polarity: 'Yang',
  },

  yi: {
    element: 'Wood',
    polarity: 'Yin',
  },

  bing: {
    element: 'Fire',
    polarity: 'Yang',
  },

  ding: {
    element: 'Fire',
    polarity: 'Yin',
  },

  wu: {
    element: 'Earth',
    polarity: 'Yang',
  },

  ji: {
    element: 'Earth',
    polarity: 'Yin',
  },

  geng: {
    element: 'Metal',
    polarity: 'Yang',
  },

  xin: {
    element: 'Metal',
    polarity: 'Yin',
  },

  ren: {
    element: 'Water',
    polarity: 'Yang',
  },

  gui: {
    element: 'Water',
    polarity: 'Yin',
  },
}


const CHINESE_BRANCHES = {
  zi: 'Rat',
  chou: 'Ox',
  yin: 'Tiger',
  mao: 'Rabbit',
  chen: 'Dragon',
  si: 'Snake',
  wu: 'Horse',
  wei: 'Goat',
  shen: 'Monkey',
  you: 'Rooster',
  xu: 'Dog',
  hai: 'Pig',
}


const TZOLKIN_NAMES = [
  'Imix',
  'Ikʼ',
  'Akʼbal',
  'Kʼan',
  'Chikchan',
  'Kimi',
  'Manikʼ',
  'Lamat',
  'Muluk',
  'Ok',
  'Chuwen',
  'Ebʼ',
  'Bʼen',
  'Ix',
  'Men',
  'Kʼibʼ',
  'Kabʼan',
  'Etzʼnabʼ',
  'Kawak',
  'Ajaw',
]


const HAAB_MONTHS = [
  'Pop',
  'Woʼ',
  'Sip',
  'Sotzʼ',
  'Sek',
  'Xul',
  'Yaxkʼin',
  'Mol',
  'Chʼen',
  'Yax',
  'Sakʼ',
  'Keh',
  'Mak',
  'Kʼankʼin',
  'Muwanʼ',
  'Pax',
  'Kʼayab',
  'Kumkʼu',
  'Wayebʼ',
]


const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni',
  'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha',
  'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
  'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
]


const ARABIC_MANSIONS = [
  ['Al-Sharaṭān', 'β and γ Arietis'], ['Al-Buṭayn', 'δ, ε and ρ Arietis'],
  ['Al-Thurayyā', 'the Pleiades'], ['Al-Dabarān', 'Aldebaran'],
  ['Al-Haqʿa', 'λ, φ¹ and φ² Orionis'], ['Al-Hanʿa', 'γ and ξ Geminorum'],
  ['Al-Dhirāʿ', 'Castor and Pollux'], ['Al-Nathra', 'the Beehive Cluster'],
  ['Al-Ṭarf', 'λ Leonis'], ['Al-Jabha', 'Regulus region'],
  ['Al-Zubra', 'δ and θ Leonis'], ['Al-Ṣarfa', 'Denebola'],
  ['Al-ʿAwwāʾ', 'β, η, γ, δ and ε Virginis'], ['Al-Simāk', 'Spica'],
  ['Al-Ghafr', 'ι, κ and λ Virginis'], ['Al-Zubānā', 'the scales of Libra'],
  ['Al-Iklīl', 'the crown of Scorpius'], ['Al-Qalb', 'Antares'],
  ['Al-Shawla', 'the tail of Scorpius'], ['Al-Naʿāʾim', 'the stars of Sagittarius'],
  ['Al-Balda', 'an open region of Sagittarius'], ['Saʿd al-Dhābiḥ', 'α and β Capricorni'],
  ['Saʿd Bulaʿ', 'μ and ν Aquarii'], ['Saʿd al-Suʿūd', 'β Aquarii'],
  ['Saʿd al-Akhbiya', 'γ, ζ, η and π Aquarii'], ['Al-Fargh al-Muqdim', 'α and β Pegasi'],
  ['Al-Fargh al-Muʾakhkhar', 'γ Pegasi and α Andromedae'], ['Al-Rishāʾ', 'the cord of Pisces'],
]


const STEM_NAMES = [
  ['Jia', '甲'], ['Yi', '乙'], ['Bing', '丙'], ['Ding', '丁'], ['Wu', '戊'],
  ['Ji', '己'], ['Geng', '庚'], ['Xin', '辛'], ['Ren', '壬'], ['Gui', '癸'],
]


const BRANCH_NAMES = [
  ['Zi', '子'], ['Chou', '丑'], ['Yin', '寅'], ['Mao', '卯'], ['Chen', '辰'], ['Si', '巳'],
  ['Wu', '午'], ['Wei', '未'], ['Shen', '申'], ['You', '酉'], ['Xu', '戌'], ['Hai', '亥'],
]


const PLANET_ASSOCIATIONS = {
  Sun: 'vitality and authority', Moon: 'change and nurture', Mars: 'action and conflict',
  Mercury: 'communication and exchange', Jupiter: 'growth and justice',
  Venus: 'harmony and attraction', Saturn: 'limits and endurance',
}

const WEEKDAY_NAMES = Object.keys(PLANETARY_WEEKDAYS)
const CHALDEAN_ORDER = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon']


function mod(value, divisor) {
  return (
    (value % divisor) +
    divisor
  ) % divisor
}


function amod(value, divisor) {
  const result =
    mod(value, divisor)

  return result === 0
    ? divisor
    : result
}


function getTropicalZodiac(longitude) {
  const normalized =
    mod(longitude, 360)

  const index =
    Math.floor(
      normalized / 30,
    )

  const sign =
    ZODIAC_SIGNS[index]

  return {
    ...sign,

    longitude:
      normalized,

    degree:
      normalized % 30,
  }
}


function getSiderealData(year, month, day, sunLongitude, moonLongitude) {
  const dayOfYear = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 1)) / 86400000)
  const decimalYear = year + dayOfYear / 365.2425
  const ayanamsha = 23.85675 + (decimalYear - 2000) * 0.013968
  const sun = getTropicalZodiac(sunLongitude - ayanamsha)
  const moon = getTropicalZodiac(moonLongitude - ayanamsha)
  const mansionSize = 360 / 27
  const nakshatraIndex = Math.floor(mod(moon.longitude, 360) / mansionSize)
  const positionWithinMansion = mod(moon.longitude, mansionSize)

  return {
    ayanamsha,
    sun,
    moon,
    nakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraIndex: nakshatraIndex + 1,
    pada: Math.floor(positionWithinMansion / (mansionSize / 4)) + 1,
  }
}


function getArabicMansion(moonLongitude) {
  const mansionSize = 360 / 28
  const index = Math.floor(mod(moonLongitude, 360) / mansionSize)
  const [name, stars] = ARABIC_MANSIONS[index]

  return {
    number: index + 1,
    name,
    stars,
    longitudeWithin: mod(moonLongitude, mansionSize),
  }
}


function sexagenaryName(index) {
  const stem = STEM_NAMES[mod(index, 10)]
  const branch = BRANCH_NAMES[mod(index, 12)]
  return {
    index: mod(index, 60),
    stemIndex: mod(index, 10),
    branchIndex: mod(index, 12),
    stem: `${stem[0]} ${stem[1]}`,
    branch: `${branch[0]} ${branch[1]}`,
    formatted: `${stem[0]}-${branch[0]} ${stem[1]}${branch[1]}`,
  }
}

function getHourPillar(dayPillar, hour, minute) {
  if (!dayPillar || hour == null) return null

  const branchIndex = Math.floor(mod(hour + 1, 24) / 2)
  const stemIndex = mod((dayPillar.stemIndex % 5) * 2 + branchIndex, 10)
  const pillarIndex = Array.from({ length: 60 }, (_, index) => index)
    .find((index) => index % 10 === stemIndex && index % 12 === branchIndex)

  return {
    ...sexagenaryName(pillarIndex),
    time: `${String(hour).padStart(2, '0')}:${String(minute ?? 0).padStart(2, '0')}`,
  }
}

function getPlanetaryHour(weekday, solarHourWindow) {
  if (!solarHourWindow) return null

  const weekdayIndex = WEEKDAY_NAMES.indexOf(weekday)
  const rulingWeekday = WEEKDAY_NAMES[mod(weekdayIndex + solarHourWindow.dayOffset, 7)]
  const dayRuler = PLANETARY_WEEKDAYS[rulingWeekday]?.body
  const startIndex = CHALDEAN_ORDER.indexOf(dayRuler)
  if (startIndex < 0) return null

  const sequenceIndex = solarHourWindow.hourIndex + (solarHourWindow.daytime ? 0 : 12)
  const body = CHALDEAN_ORDER[mod(startIndex + sequenceIndex, 7)]
  const ruler = Object.values(PLANETARY_WEEKDAYS).find((item) => item.body === body)

  return {
    body,
    symbol: ruler?.symbol ?? '',
    period: solarHourWindow.daytime ? 'day' : 'night',
    number: solarHourWindow.hourIndex + 1,
    start: solarHourWindow.start,
    end: solarHourWindow.end,
  }
}


function getChineseCycles(chinese, julianDay, sunLongitude) {
  if (!chinese?.stem || !chinese?.branch) return null

  const stemKeys = Object.keys(CHINESE_STEMS)
  const branchKeys = Object.keys(CHINESE_BRANCHES)
  const yearStemIndex = stemKeys.indexOf(chinese.stem)
  const yearBranchIndex = branchKeys.indexOf(chinese.branch)
  const yearIndex = Array.from({ length: 60 }, (_, index) => index)
    .find((index) => index % 10 === yearStemIndex && index % 12 === yearBranchIndex)
  const solarMonth = Math.floor(mod(sunLongitude - 315, 360) / 30) + 1
  const monthStemIndex = mod(yearStemIndex * 2 + 2 + solarMonth - 1, 10)
  const monthBranchIndex = mod(solarMonth + 1, 12)
  const monthIndex = Array.from({ length: 60 }, (_, index) => index)
    .find((index) => index % 10 === monthStemIndex && index % 12 === monthBranchIndex)
  const dayIndex = mod(Math.floor(julianDay + 0.5) + 49, 60)

  return {
    year: sexagenaryName(yearIndex),
    month: sexagenaryName(monthIndex),
    day: sexagenaryName(dayIndex),
  }
}


function getSeasonalTraditions(month, day) {
  const dateCode = month * 100 + day
  const festivals = [
    [201, 'Imbolc'], [320, 'March Equinox'], [501, 'Beltane'], [621, 'June Solstice'],
    [801, 'Lughnasadh'], [922, 'September Equinox'], [1031, 'Samhain'], [1221, 'December Solstice'],
  ]
  const currentIndex = festivals.reduce(
    (match, festival, index) => dateCode >= festival[0] ? index : match,
    festivals.length - 1,
  )
  const nextIndex = (currentIndex + 1) % festivals.length

  return {
    wheel: `${festivals[currentIndex][1]} → ${festivals[nextIndex][1]}`,
    currentFestival: festivals[currentIndex][1],
    nextFestival: festivals[nextIndex][1],
    quarterDays: 'March equinox · June solstice · September equinox · December solstice',
    crossQuarterDays: 'Imbolc · Beltane · Lughnasadh · Samhain',
  }
}


function getCelticTreeSign(month, day) {
  const dateCode = month * 100 + day
  const signs = [
    [121, 217, 'Rowan', 'Luis'],
    [218, 317, 'Ash', 'Nion'],
    [318, 414, 'Alder', 'Fearn'],
    [415, 512, 'Willow', 'Saille'],
    [513, 609, 'Hawthorn', 'Huath'],
    [610, 707, 'Oak', 'Duir'],
    [708, 804, 'Holly', 'Tinne'],
    [805, 901, 'Hazel', 'Coll'],
    [902, 929, 'Vine', 'Muin'],
    [930, 1027, 'Ivy', 'Gort'],
    [1028, 1124, 'Reed', 'Ngetal'],
    [1125, 1223, 'Elder', 'Ruis'],
  ]

  if (dateCode >= 1224 || dateCode <= 120) {
    return { tree: 'Birch', ogham: 'Beith' }
  }

  const [, , tree, ogham] = signs.find(([start, end]) => dateCode >= start && dateCode <= end)
  return { tree, ogham }
}


function getNumerology(year, month, day) {
  const digits = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
    .split('')
    .map(Number)
  const dateNumber = digits.reduce((sum, digit) => sum + digit, 0)
  let digitalRoot = dateNumber

  while (digitalRoot > 9) {
    digitalRoot = String(digitalRoot).split('').reduce((sum, digit) => sum + Number(digit), 0)
  }

  let lifePath = dateNumber
  while (lifePath > 9 && ![11, 22, 33].includes(lifePath)) {
    lifePath = String(lifePath).split('').reduce((sum, digit) => sum + Number(digit), 0)
  }

  return { dateNumber, digitalRoot, lifePath }
}


function getChineseYearData(
  year,
  month,
  day,
) {
  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        12,
      ),
    )

  try {
    const formatter =
      new Intl.DateTimeFormat(
        'en-u-ca-chinese',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          timeZone: 'UTC',
        },
      )


    const parts =
      formatter.formatToParts(date)


    const yearNamePart =
      parts.find(
        (part) =>
          part.type === 'yearName',
      )


    const relatedYearPart =
      parts.find(
        (part) =>
          part.type === 'relatedYear',
      )


    let stem
    let branch
    let displayYearName


    if (yearNamePart) {
      const yearName = yearNamePart.value
        .toLowerCase()
        .replace(/[^a-z-]/g, '')

      ;[stem, branch] = yearName.split('-')
      displayYearName = yearNamePart.value
    } else if (relatedYearPart) {
      const relatedYear = Number(relatedYearPart.value)
      const cycleIndex = mod(relatedYear - 4, 60)
      stem = Object.keys(CHINESE_STEMS)[cycleIndex % 10]
      branch = Object.keys(CHINESE_BRANCHES)[cycleIndex % 12]
      displayYearName = `${stem[0].toUpperCase()}${stem.slice(1)}-${branch[0].toUpperCase()}${branch.slice(1)}`
    } else {
      return null
    }


    const stemData =
      CHINESE_STEMS[stem]


    const animal =
      CHINESE_BRANCHES[branch]


    if (
      !stemData ||
      !animal
    ) {
      return {
        yearName:
          displayYearName,

        animal:
          'Unknown',

        element:
          'Unknown',

        polarity:
          'Unknown',
      }
    }


    return {
      yearName:
        displayYearName,

      animal,

      element:
        stemData.element,

      polarity:
        stemData.polarity,

      stem,

      branch,
    }

  } catch {
    return null
  }
}


function getMayaData(julianDay) {

  /*
    Goodman-Martínez-Thompson correlation:
    Long Count 0.0.0.0.0 =
    Julian Day Number 584283.

    The integer civil day is obtained by
    shifting astronomical JD by 0.5.
  */

  const jdn =
    Math.floor(
      julianDay + 0.5,
    )


  const totalDays =
    jdn - 584283


  /*
    Tzolk'in

    Long Count epoch:
    4 Ajaw
  */

  const tzolkinNumber =
    amod(
      totalDays + 4,
      13,
    )


  const tzolkinName =
    TZOLKIN_NAMES[
      mod(
        totalDays + 19,
        20,
      )
    ]


  /*
    Haab'

    Long Count epoch:
    8 Kumk'u

    Kumk'u is month 17
    zero-indexed.

    17 × 20 + 8 = 348
  */

  const haabIndex =
    mod(
      totalDays + 348,
      365,
    )


  let haabMonthIndex
  let haabDay


  if (
    haabIndex < 360
  ) {

    haabMonthIndex =
      Math.floor(
        haabIndex / 20,
      )

    haabDay =
      haabIndex % 20

  } else {

    haabMonthIndex = 18

    haabDay =
      haabIndex - 360

  }


  const haabMonth =
    HAAB_MONTHS[
      haabMonthIndex
    ]


  /*
    Maya Long Count

    Standard units:
    1 kin   = 1 day
    1 uinal = 20 kin
    1 tun   = 18 uinal = 360 days
    1 katun = 20 tun
    1 baktun = 20 katun
  */

  let remaining =
    totalDays


  const baktun =
    Math.floor(
      remaining / 144000,
    )


  remaining =
    mod(
      remaining,
      144000,
    )


  const katun =
    Math.floor(
      remaining / 7200,
    )


  remaining %=
    7200


  const tun =
    Math.floor(
      remaining / 360,
    )


  remaining %=
    360


  const uinal =
    Math.floor(
      remaining / 20,
    )


  const kin =
    remaining % 20


  return {
    totalDays,

    tzolkin: {
      number:
        tzolkinNumber,

      name:
        tzolkinName,

      formatted:
        `${tzolkinNumber} ${tzolkinName}`,
    },

    haab: {
      day:
        haabDay,

      month:
        haabMonth,

      formatted:
        `${haabDay} ${haabMonth}`,
    },

    calendarRound:
      `${tzolkinNumber} ${tzolkinName} · ${haabDay} ${haabMonth}`,

    longCount: {
      baktun,
      katun,
      tun,
      uinal,
      kin,

      formatted:
        `${baktun}.${katun}.${tun}.${uinal}.${kin}`,
    },
  }
}


export function getCulturalData({
  year,
  month,
  day,
  weekday,
  julianDay,
  sunLongitude,
  moonLongitude,
  hour = null,
  minute = 0,
  solarHourWindow = null,
}) {

  const sunZodiac =
    getTropicalZodiac(
      sunLongitude,
    )


  const moonZodiac =
    getTropicalZodiac(
      moonLongitude,
    )


  const planetaryRuler =
    PLANETARY_WEEKDAYS[
      weekday
    ]


  const chinese =
    getChineseYearData(
      year,
      month,
      day,
    )


  const maya =
    getMayaData(
      julianDay,
    )


  const sidereal =
    getSiderealData(
      year,
      month,
      day,
      sunLongitude,
      moonLongitude,
    )


  const arabicMansion =
    getArabicMansion(
      moonLongitude,
    )


  const chineseCycles =
    getChineseCycles(
      chinese,
      julianDay,
      sunLongitude,
    )


  const hourPillar =
    getHourPillar(chineseCycles?.day, hour, minute)


  const planetaryHour =
    getPlanetaryHour(weekday, solarHourWindow)


  const seasonal =
    getSeasonalTraditions(
      month,
      day,
    )


  const numerology =
    getNumerology(
      year,
      month,
      day,
    )

  const celticTree =
    getCelticTreeSign(
      month,
      day,
    )


  return {

    westernZodiac: {
      name:
        sunZodiac.name,

      symbol:
        sunZodiac.symbol,

      degree:
        sunZodiac.degree,

      longitude:
        sunZodiac.longitude,

      formatted:
        `${sunZodiac.symbol} ${sunZodiac.name}`,
    },


    moonZodiac: {
      name:
        moonZodiac.name,

      symbol:
        moonZodiac.symbol,

      degree:
        moonZodiac.degree,

      longitude:
        moonZodiac.longitude,

      formatted:
        `${moonZodiac.symbol} ${moonZodiac.name}`,
    },


    planetaryRuler,


    classicalPlanetAssociation:
      planetaryRuler
        ? PLANET_ASSOCIATIONS[planetaryRuler.body]
        : null,


    chinese,


    chineseCycles,

    hourPillar,

    planetaryHour,

    maya,


    sidereal,


    arabicMansion,


    seasonal,

    celticTree,


    numerology,
  }
}
