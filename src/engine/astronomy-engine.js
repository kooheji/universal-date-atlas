import * as Astronomy from 'astronomy-engine'

const AU_KM = 149597870.7
const DAY_MS = 86400000

const PLANET_BODIES = [
  ['Mercury', Astronomy.Body.Mercury],
  ['Venus', Astronomy.Body.Venus],
  ['Mars', Astronomy.Body.Mars],
  ['Jupiter', Astronomy.Body.Jupiter],
  ['Saturn', Astronomy.Body.Saturn],
  ['Uranus', Astronomy.Body.Uranus],
  ['Neptune', Astronomy.Body.Neptune],
]


function getMoonPhaseName(angle) {
  const phase = ((angle % 360) + 360) % 360

  if (phase < 22.5 || phase >= 337.5) {
    return 'New Moon'
  }

  if (phase < 67.5) {
    return 'Waxing Crescent'
  }

  if (phase < 112.5) {
    return 'First Quarter'
  }

  if (phase < 157.5) {
    return 'Waxing Gibbous'
  }

  if (phase < 202.5) {
    return 'Full Moon'
  }

  if (phase < 247.5) {
    return 'Waning Gibbous'
  }

  if (phase < 292.5) {
    return 'Third Quarter'
  }

  return 'Waning Crescent'
}


function getNorthernSeason(date, seasons) {
  const time = date.getTime()

  const march =
    seasons.mar_equinox.date.getTime()

  const june =
    seasons.jun_solstice.date.getTime()

  const september =
    seasons.sep_equinox.date.getTime()

  const december =
    seasons.dec_solstice.date.getTime()

  if (time < march) {
    return 'Winter'
  }

  if (time < june) {
    return 'Spring'
  }

  if (time < september) {
    return 'Summer'
  }

  if (time < december) {
    return 'Autumn'
  }

  return 'Winter'
}


function getSouthernSeason(northernSeason) {
  const opposites = {
    Spring: 'Autumn',
    Summer: 'Winter',
    Autumn: 'Spring',
    Winter: 'Summer',
  }

  return opposites[northernSeason]
}


function getEquatorialData(body, date) {
  const vector = Astronomy.GeoVector(body, date, true)
  const equatorial = Astronomy.EquatorFromVector(vector)
  const ecliptic = Astronomy.Ecliptic(vector)
  const constellation = Astronomy.Constellation(equatorial.ra, equatorial.dec)

  return {
    rightAscension: equatorial.ra,
    declination: equatorial.dec,
    distanceAu: vector.Length(),
    longitude: ecliptic.elon,
    latitude: ecliptic.elat,
    constellation: constellation.name,
  }
}


function getMoonEvent(angle, date, direction) {
  return Astronomy.SearchMoonPhase(angle, date, direction * 40)?.date ?? null
}


function getNearestSeasonEvent(date, years, eventNames) {
  const events = years.flatMap((eventYear) => {
    const seasons = Astronomy.Seasons(eventYear)
    return eventNames.map(([name, key]) => ({ name, date: seasons[key].date }))
  })

  return events.reduce((nearest, event) => (
    !nearest || Math.abs(event.date - date) < Math.abs(nearest.date - date)
      ? event
      : nearest
  ), null)
}

function getSolarHourWindow(date, observerCoordinates) {
  if (!observerCoordinates) return null

  try {
    const observer = new Astronomy.Observer(
      observerCoordinates.latitude,
      observerCoordinates.longitude,
      observerCoordinates.height ?? 0,
    )
    const previousRise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, date, -2)?.date
    const previousSet = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, date, -2)?.date
    const nextRise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, 1, date, 2)?.date
    const nextSet = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, date, 2)?.date

    if (!previousRise || !previousSet || !nextRise || !nextSet) return null

    const daytime = previousRise > previousSet
    const start = daytime ? previousRise : previousSet
    const end = daytime ? nextSet : nextRise
    const progress = (date - start) / (end - start)

    return {
      daytime,
      start,
      end,
      hourIndex: Math.min(11, Math.max(0, Math.floor(progress * 12))),
      dayOffset: !daytime && start.getUTCDate() !== date.getUTCDate() ? -1 : 0,
      latitude: observerCoordinates.latitude,
      longitude: observerCoordinates.longitude,
    }
  } catch {
    return null
  }
}


export function getAstronomyData(
  year,
  month,
  day,
  { hour = 12, minute = 0, observer = null } = {},
) {
  /*
    Date-only astronomical calculations are
    evaluated at 12:00 UTC.

    Optional user time is interpreted as UTC.
    Date-only requests retain the noon default.
  */

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
      ),
    )


  const moonPhaseAngle =
    Astronomy.MoonPhase(date)


  const moonIllumination =
    Astronomy.Illumination(
      Astronomy.Body.Moon,
      date,
    )


  const moonPosition =
    Astronomy.EclipticGeoMoon(date)


  const sunPosition =
    Astronomy.SunPosition(date)


  const moonEquatorial =
    getEquatorialData(
      Astronomy.Body.Moon,
      date,
    )


  const sunEquatorial =
    getEquatorialData(
      Astronomy.Body.Sun,
      date,
    )


  const previousNewMoon =
    getMoonEvent(0, date, -1)


  const nextNewMoon =
    getMoonEvent(0, date, 1)


  const previousFullMoon =
    getMoonEvent(180, date, -1)


  const nextFullMoon =
    getMoonEvent(180, date, 1)


  const siderealTime =
    Astronomy.SiderealTime(date)


  const seasons =
    Astronomy.Seasons(year)


  const northernSeason =
    getNorthernSeason(
      date,
      seasons,
    )


  const southernSeason =
    getSouthernSeason(
      northernSeason,
    )


  const adjacentYears =
    [year - 1, year, year + 1]


  const nearestEquinox =
    getNearestSeasonEvent(
      date,
      adjacentYears,
      [
        ['March Equinox', 'mar_equinox'],
        ['September Equinox', 'sep_equinox'],
      ],
    )


  const nearestSolstice =
    getNearestSeasonEvent(
      date,
      adjacentYears,
      [
        ['June Solstice', 'jun_solstice'],
        ['December Solstice', 'dec_solstice'],
      ],
    )


  const marchStart =
    date >= seasons.mar_equinox.date
      ? seasons.mar_equinox.date
      : Astronomy.Seasons(year - 1).mar_equinox.date


  const nextMarch =
    Astronomy.Seasons(
      date >= seasons.mar_equinox.date
        ? year + 1
        : year,
    ).mar_equinox.date


  const orbitalProgress =
    (
      (date - marchStart) /
      (nextMarch - marchStart)
    ) * 100


  const planets =
    PLANET_BODIES.map(([name, body]) => ({
      name,
      ...getEquatorialData(body, date),
      magnitude: Astronomy.Illumination(body, date).mag,
    }))


  const solarHourWindow =
    getSolarHourWindow(date, observer)


  return {

    calculationTime:
      `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} UTC`,


    moonPhase: {
      name:
        getMoonPhaseName(
          moonPhaseAngle,
        ),

      angle:
        moonPhaseAngle,

      illumination:
        moonIllumination.phase_fraction * 100,

      phaseAngle:
        moonIllumination.phase_angle,

      magnitude:
        moonIllumination.mag,

      distanceKm:
        moonIllumination.geo_dist * AU_KM,

      ageDays:
        previousNewMoon
          ? (date - previousNewMoon) / DAY_MS
          : null,

      declination:
        moonEquatorial.declination,

      constellation:
        moonEquatorial.constellation,

      previousNewMoon,

      nextNewMoon,

      previousFullMoon,

      nextFullMoon,
    },


    moonPosition: {
      longitude:
        moonPosition.lon,

      latitude:
        moonPosition.lat,
    },


    sunPosition: {
      longitude:
        sunPosition.elon,

      latitude:
        sunPosition.elat,

      declination:
        sunEquatorial.declination,

      distanceAu:
        sunEquatorial.distanceAu,

      constellation:
        sunEquatorial.constellation,
    },


    planets,


    julianInstant:
      Astronomy.MakeTime(date).ut + 2451545,


    orbitalProgress,


    siderealTime,


    observer,


    solarHourWindow,


    seasons: {
      northern:
        northernSeason,

      southern:
        southernSeason,

      marchEquinox:
        seasons.mar_equinox.date,

      juneSolstice:
        seasons.jun_solstice.date,

      septemberEquinox:
        seasons.sep_equinox.date,

      decemberSolstice:
        seasons.dec_solstice.date,

      nearestEquinox,

      nearestSolstice,
    },

  }
}
