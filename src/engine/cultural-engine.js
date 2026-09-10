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


    if (!yearNamePart) {
      return null
    }


    const yearName =
      yearNamePart.value
        .toLowerCase()
        .replace(
          /[^a-z-]/g,
          '',
        )


    const [
      stem,
      branch,
    ] =
      yearName.split('-')


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
          yearNamePart.value,

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
        yearNamePart.value,

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


    chinese,

    maya,
  }
}