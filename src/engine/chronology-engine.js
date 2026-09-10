import * as Astronomy from 'astronomy-engine'


const DAY_MS = 86400000

/*
  The original French Republican calendar
  used the autumn equinox at the Paris meridian.

  Paris mean time was approximately
  UTC + 9 minutes 21 seconds.
*/
const PARIS_MEAN_TIME_MS =
  (9 * 60 + 21) * 1000


const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]


const IFC_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'Sol',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]


const WORLD_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]


const DISCORDIAN_SEASONS = [
  'Chaos',
  'Discord',
  'Confusion',
  'Bureaucracy',
  'The Aftermath',
]


const DISCORDIAN_WEEKDAYS = [
  'Sweetmorn',
  'Boomtime',
  'Pungenday',
  'Prickle-Prickle',
  'Setting Orange',
]


const REPUBLICAN_MONTHS = [
  'Vendémiaire',
  'Brumaire',
  'Frimaire',
  'Nivôse',
  'Pluviôse',
  'Ventôse',
  'Germinal',
  'Floréal',
  'Prairial',
  'Messidor',
  'Thermidor',
  'Fructidor',
]


const COMPLEMENTARY_DAYS = [
  'Virtue',
  'Genius',
  'Labour',
  'Opinion',
  'Rewards',
  'Revolution',
]


function mod(value, divisor) {
  return (
    (value % divisor) +
    divisor
  ) % divisor
}


function makeUTCDate(
  year,
  month,
  day,
  hour = 0,
) {
  const date =
    new Date(0)

  date.setUTCFullYear(
    year,
    month - 1,
    day,
  )

  date.setUTCHours(
    hour,
    0,
    0,
    0,
  )

  return date
}


function isGregorianLeapYear(year) {
  return (
    year % 4 === 0 &&
    (
      year % 100 !== 0 ||
      year % 400 === 0
    )
  )
}


function compareYMD(a, b) {

  if (a.year !== b.year) {
    return a.year - b.year
  }

  if (a.month !== b.month) {
    return a.month - b.month
  }

  return a.day - b.day
}


function daysBetween(a, b) {

  const start =
    makeUTCDate(
      a.year,
      a.month,
      a.day,
    )


  const end =
    makeUTCDate(
      b.year,
      b.month,
      b.day,
    )


  return Math.round(
    (
      end.getTime() -
      start.getTime()
    ) / DAY_MS,
  )
}


/* ========================================
   Julian calendar
======================================== */

function jdnToJulian(jdn) {

  const c =
    jdn + 32082


  const d =
    Math.floor(
      (4 * c + 3) /
      1461,
    )


  const e =
    c -
    Math.floor(
      (1461 * d) /
      4,
    )


  const m =
    Math.floor(
      (5 * e + 2) /
      153,
    )


  const day =
    e -
    Math.floor(
      (153 * m + 2) /
      5,
    ) +
    1


  const month =
    m +
    3 -
    12 *
    Math.floor(
      m / 10,
    )


  const year =
    d -
    4800 +
    Math.floor(
      m / 10,
    )


  return {
    year,
    month,
    day,
  }
}


/* ========================================
   ISO Week Date
======================================== */

function getISOWeekDate(
  year,
  month,
  day,
) {

  const date =
    makeUTCDate(
      year,
      month,
      day,
    )


  const weekday =
    date.getUTCDay() || 7


  date.setUTCDate(
    date.getUTCDate() +
    4 -
    weekday,
  )


  const isoYear =
    date.getUTCFullYear()


  const yearStart =
    makeUTCDate(
      isoYear,
      1,
      1,
    )


  const week =
    Math.ceil(
      (
        (
          (
            date -
            yearStart
          ) /
          DAY_MS
        ) +
        1
      ) /
      7,
    )


  const originalWeekday =
    makeUTCDate(
      year,
      month,
      day,
    ).getUTCDay() || 7


  return {

    year:
      isoYear,

    week,

    weekday:
      originalWeekday,

    formatted:
      `${isoYear}-W${String(
        week,
      ).padStart(
        2,
        '0',
      )}-${originalWeekday}`,

  }
}


/* ========================================
   International Fixed Calendar
======================================== */

function getInternationalFixed(
  year,
  dayOfYear,
) {

  const leap =
    isGregorianLeapYear(year)


  /*
    Leap Day occurs after June 28
    and before Sol 1.
  */

  if (
    leap &&
    dayOfYear === 169
  ) {

    return {

      formatted:
        `Leap Day, ${year}`,

      meta:
        'Outside month and weekday cycle',

    }

  }


  let adjusted =
    dayOfYear


  if (
    leap &&
    dayOfYear > 169
  ) {

    adjusted -= 1

  }


  if (
    adjusted === 365
  ) {

    return {

      formatted:
        `Year Day, ${year}`,

      meta:
        'Outside month and weekday cycle',

    }

  }


  const monthIndex =
    Math.floor(
      (adjusted - 1) /
      28,
    )


  const day =
    mod(
      adjusted - 1,
      28,
    ) +
    1


  return {

    formatted:
      `${IFC_MONTHS[monthIndex]} ${day}, ${year}`,

    meta:
      '13 × 28-day months',

  }
}


/* ========================================
   World Calendar
======================================== */

function getWorldCalendar(
  year,
  dayOfYear,
) {

  const leap =
    isGregorianLeapYear(year)


  /*
    Leapyear Day sits between
    the second and third quarters.
  */

  if (
    leap &&
    dayOfYear === 183
  ) {

    return {

      formatted:
        `Leapyear Day, ${year}`,

      meta:
        'Intercalary day outside the week',

    }

  }


  let adjusted =
    dayOfYear


  if (
    leap &&
    dayOfYear > 183
  ) {

    adjusted -= 1

  }


  if (
    adjusted === 365
  ) {

    return {

      formatted:
        `Worldsday, ${year}`,

      meta:
        'Intercalary year-end day',

    }

  }


  const monthLengths = [

    31,
    30,
    30,

    31,
    30,
    30,

    31,
    30,
    30,

    31,
    30,
    30,

  ]


  let remaining =
    adjusted


  let monthIndex =
    0


  while (
    remaining >
    monthLengths[
      monthIndex
    ]
  ) {

    remaining -=
      monthLengths[
        monthIndex
      ]


    monthIndex += 1

  }


  return {

    formatted:
      `${WORLD_MONTHS[monthIndex]} ${remaining}, ${year}`,

    meta:
      'Equal 91-day quarters',

  }
}


/* ========================================
   Discordian Calendar
======================================== */

function getDiscordian(
  year,
  month,
  day,
  dayOfYear,
) {

  const leap =
    isGregorianLeapYear(year)


  const yold =
    year + 1166


  if (
    leap &&
    month === 2 &&
    day === 29
  ) {

    return {

      formatted:
        `St. Tib's Day, ${yold} YOLD`,

      meta:
        'Intercalary Discordian leap day',

    }

  }


  let adjusted =
    dayOfYear


  if (
    leap &&
    dayOfYear > 60
  ) {

    adjusted -= 1

  }


  const zeroBased =
    adjusted - 1


  const seasonIndex =
    Math.floor(
      zeroBased /
      73,
    )


  const seasonDay =
    mod(
      zeroBased,
      73,
    ) +
    1


  const weekday =
    DISCORDIAN_WEEKDAYS[
      mod(
        zeroBased,
        5,
      )
    ]


  return {

    formatted:
      `${weekday}, ${DISCORDIAN_SEASONS[seasonIndex]} ${seasonDay}, ${yold} YOLD`,

    meta:
      '5 seasons × 73 days',

  }
}


/* ========================================
   Roman AUC
======================================== */

function toRomanNumeral(value) {

  if (
    !Number.isInteger(value) ||
    value <= 0 ||
    value >= 4000
  ) {

    return null

  }


  const table = [

    [1000, 'M'],

    [900, 'CM'],

    [500, 'D'],

    [400, 'CD'],

    [100, 'C'],

    [90, 'XC'],

    [50, 'L'],

    [40, 'XL'],

    [10, 'X'],

    [9, 'IX'],

    [5, 'V'],

    [4, 'IV'],

    [1, 'I'],

  ]


  let remaining =
    value


  let output =
    ''


  for (
    const [
      amount,
      numeral,
    ]
    of table
  ) {

    while (
      remaining >=
      amount
    ) {

      output +=
        numeral


      remaining -=
        amount

    }

  }


  return output
}


function getRomanAUC(year) {

  const auc =
    year + 753


  const roman =
    toRomanNumeral(auc)


  return {

    formatted:
      roman
        ? `${auc} AUC · ${roman}`
        : `${auc} AUC`,

    meta:
      'Varro epoch: 753 BCE',

  }
}


/* ========================================
   Byzantine Anno Mundi
======================================== */

function getByzantineDate(
  julianDate,
) {

  /*
    Byzantine civil year begins
    1 September JULIAN.
  */

  const amYear =
    julianDate.month >= 9
      ? julianDate.year + 5509
      : julianDate.year + 5508


  return {

    formatted:
      `${julianDate.day} ${MONTHS[julianDate.month - 1]} ${amYear} AM`,

    meta:
      'Julian calendar · year begins 1 September',

  }
}


/* ========================================
   Continuous day counts
======================================== */

function getRataDie(jdn) {

  /*
    RD 1 =
    1 January 1 Gregorian
  */

  return (
    jdn -
    1721425
  )
}


function getLilianDay(jdn) {

  /*
    LDN 1 =
    15 October 1582 Gregorian
  */

  return (
    jdn -
    2299160
  )
}


/* ========================================
   Unix
======================================== */

function getUnixData(
  year,
  month,
  day,
) {

  const date =
    makeUTCDate(
      year,
      month,
      day,
    )


  const unixSeconds =
    Math.floor(
      date.getTime() /
      1000,
    )


  const unixDays =
    Math.floor(
      unixSeconds /
      86400,
    )


  return {

    formatted:
      `${unixDays.toLocaleString(
        'en-US',
      )} Unix days`,

    meta:
      `${unixSeconds.toLocaleString(
        'en-US',
      )} seconds at 00:00 UTC`,

  }
}


/* ========================================
   GPS Week
======================================== */

function getGPSData(
  year,
  month,
  day,
) {

  const epoch =
    makeUTCDate(
      1980,
      1,
      6,
    )


  const date =
    makeUTCDate(
      year,
      month,
      day,
    )


  const days =
    Math.round(
      (
        date -
        epoch
      ) /
      DAY_MS,
    )


  if (
    days < 0
  ) {

    return {

      formatted:
        'Before GPS epoch',

      meta:
        `${Math.abs(
          days,
        ).toLocaleString(
          'en-US',
        )} days before 6 January 1980`,

    }

  }


  const week =
    Math.floor(
      days /
      7,
    )


  const dayOfWeek =
    mod(
      days,
      7,
    )


  return {

    formatted:
      `GPS Week ${week} · Day ${dayOfWeek}`,

    meta:
      'Sunday = day 0',

  }
}


/* ========================================
   French Republican Calendar
======================================== */

function parisEquinoxDate(year) {

  const equinox =
    Astronomy
      .Seasons(year)
      .sep_equinox
      .date


  const parisMean =
    new Date(
      equinox.getTime() +
      PARIS_MEAN_TIME_MS,
    )


  return {

    year:
      parisMean
        .getUTCFullYear(),

    month:
      parisMean
        .getUTCMonth() +
      1,

    day:
      parisMean
        .getUTCDate(),

  }
}


function getFrenchRepublican(
  year,
  month,
  day,
) {

  const input = {
    year,
    month,
    day,
  }


  const epoch = {
    year: 1792,
    month: 9,
    day: 22,
  }


  if (
    compareYMD(
      input,
      epoch,
    ) < 0
  ) {

    return {

      formatted:
        'Predates Year I',

      meta:
        'Republican Era begins 22 September 1792',

    }

  }


  const currentEquinox =
    parisEquinoxDate(year)


  let start

  let republicanYear


  if (
    compareYMD(
      input,
      currentEquinox,
    ) >= 0
  ) {

    start =
      currentEquinox


    republicanYear =
      year -
      1791

  } else {

    start =
      parisEquinoxDate(
        year - 1,
      )


    republicanYear =
      year -
      1792

  }


  const nextStart =
    parisEquinoxDate(
      start.year + 1,
    )


  const yearLength =
    daysBetween(
      start,
      nextStart,
    )


  const zeroBased =
    daysBetween(
      start,
      input,
    )


  if (
    zeroBased < 360
  ) {

    const monthIndex =
      Math.floor(
        zeroBased /
        30,
      )


    const republicanDay =
      mod(
        zeroBased,
        30,
      ) +
      1


    return {

      formatted:
        `${republicanDay} ${REPUBLICAN_MONTHS[monthIndex]}, Year ${republicanYear}`,

      meta:
        `Astronomical equinox method · ${yearLength}-day year`,

    }

  }


  const complementaryIndex =
    zeroBased -
    360


  const complementaryName =
    COMPLEMENTARY_DAYS[
      complementaryIndex
    ] ??
    `Complementary Day ${complementaryIndex + 1}`


  return {

    formatted:
      `${complementaryName}, Year ${republicanYear}`,

    meta:
      `Complementary Day ${complementaryIndex + 1} · ${yearLength}-day year`,

  }
}


/* ========================================
   Public chronology registry
======================================== */

export function getChronologyData({
  year,
  month,
  day,
  dayOfYear,
  julianDay,
}) {

  const jdn =
    Math.floor(
      julianDay +
      0.5,
    )


  const julian =
    jdnToJulian(jdn)


  const isoWeek =
    getISOWeekDate(
      year,
      month,
      day,
    )


  const internationalFixed =
    getInternationalFixed(
      year,
      dayOfYear,
    )


  const world =
    getWorldCalendar(
      year,
      dayOfYear,
    )


  const discordian =
    getDiscordian(
      year,
      month,
      day,
      dayOfYear,
    )


  const roman =
    getRomanAUC(year)


  const byzantine =
    getByzantineDate(
      julian,
    )


  const french =
    getFrenchRepublican(
      year,
      month,
      day,
    )


  const unix =
    getUnixData(
      year,
      month,
      day,
    )


  const gps =
    getGPSData(
      year,
      month,
      day,
    )


  return [

    {
      id:
        'julian-calendar',

      badge:
        'CALENDAR',

      family:
        'Historical',

      name:
        'Julian Calendar',

      value:
        `${julian.day} ${MONTHS[julian.month - 1]} ${julian.year}`,

      meta:
        'Proleptic Julian conversion',

      description:
        'Earlier Roman-derived solar calendar introduced under Julius Caesar.',
    },


    {
      id:
        'iso-week-date',

      badge:
        'CHRONOLOGY',

      family:
        'ISO',

      name:
        'ISO Week Date',

      value:
        isoWeek.formatted,

      meta:
        `Week ${isoWeek.week} · weekday ${isoWeek.weekday}`,

      description:
        'ISO representation using week-numbering year, week and weekday.',
    },


    {
      id:
        'iso-ordinal-date',

      badge:
        'CHRONOLOGY',

      family:
        'ISO',

      name:
        'ISO Ordinal Date',

      value:
        `${year}-${String(
          dayOfYear,
        ).padStart(
          3,
          '0',
        )}`,

      meta:
        `Day ${dayOfYear} of ${year}`,

      description:
        'Year plus sequential day number within the Gregorian year.',
    },


    {
      id:
        'international-fixed',

      badge:
        'CALENDAR',

      family:
        'Reform',

      name:
        'International Fixed Calendar',

      value:
        internationalFixed.formatted,

      meta:
        internationalFixed.meta,

      description:
        'Perennial reform calendar with thirteen 28-day months and intercalary days.',
    },


    {
      id:
        'world-calendar',

      badge:
        'CALENDAR',

      family:
        'Reform',

      name:
        'World Calendar',

      value:
        world.formatted,

      meta:
        world.meta,

      description:
        'Twelve-month perennial proposal arranged as four equal 91-day quarters.',
    },


    {
      id:
        'discordian',

      badge:
        'ALTERNATIVE',

      family:
        'Discordian',

      name:
        'Discordian Calendar',

      value:
        discordian.formatted,

      meta:
        discordian.meta,

      description:
        'Erisian calendar of five seasons, five weekdays and the YOLD era.',
    },


    {
      id:
        'french-republican',

      badge:
        'CALENDAR',

      family:
        'Revolutionary',

      name:
        'French Republican Calendar',

      value:
        french.formatted,

      meta:
        french.meta,

      description:
        'Republican date using the autumn-equinox-at-Paris method of the original calendar.',
    },


    {
      id:
        'holocene',

      badge:
        'ERA',

      family:
        'Alternative',

      name:
        'Holocene / Human Era',

      value:
        `${year + 10000} HE`,

      meta:
        'CE year + 10,000',

      description:
        'Year-numbering proposal that shifts the Common Era by ten millennia.',
    },


    {
      id:
        'roman-auc',

      badge:
        'ERA',

      family:
        'Roman',

      name:
        'Ab Urbe Condita',

      value:
        roman.formatted,

      meta:
        roman.meta,

      description:
        'Year count from the traditional Varro date for the founding of Rome.',
    },


    {
      id:
        'byzantine-am',

      badge:
        'ERA',

      family:
        'Byzantine',

      name:
        'Byzantine Anno Mundi',

      value:
        byzantine.formatted,

      meta:
        byzantine.meta,

      description:
        'Byzantine world era using the Julian calendar and a September new year.',
    },


    {
      id:
        'rata-die',

      badge:
        'DAY COUNT',

      family:
        'Computational',

      name:
        'Rata Die',

      value:
        `RD ${getRataDie(
          jdn,
        ).toLocaleString(
          'en-US',
        )}`,

      meta:
        'RD 1 = 1 January 1 Gregorian',

      description:
        'Continuous count of civil days from the start of the proleptic Gregorian calendar.',
    },


    {
      id:
        'lilian-day',

      badge:
        'DAY COUNT',

      family:
        'Computational',

      name:
        'Lilian Day Number',

      value:
        `LDN ${getLilianDay(
          jdn,
        ).toLocaleString(
          'en-US',
        )}`,

      meta:
        'LDN 1 = 15 October 1582',

      description:
        'Continuous day numbering tied to the first day of the Gregorian reform.',
    },


    {
      id:
        'unix-date',

      badge:
        'COMPUTING',

      family:
        'Unix',

      name:
        'Unix Epoch',

      value:
        unix.formatted,

      meta:
        unix.meta,

      description:
        'Elapsed days and seconds from 1 January 1970 at 00:00 UTC.',
    },


    {
      id:
        'gps-week',

      badge:
        'COMPUTING',

      family:
        'Navigation',

      name:
        'GPS Week',

      value:
        gps.formatted,

      meta:
        gps.meta,

      description:
        'GPS week-and-day count from the GPS epoch of 6 January 1980.',
    },

  ]
}