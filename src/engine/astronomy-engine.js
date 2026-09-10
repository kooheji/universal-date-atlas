import * as Astronomy from 'astronomy-engine'

const AU_KM = 149597870.7


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


export function getAstronomyData(
  year,
  month,
  day,
) {
  /*
    Date-only astronomical calculations are
    evaluated at 12:00 UTC.

    Later we will replace this with optional
    user-selected time and geographic location.
  */

  const date =
    new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        12,
        0,
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


  return {

    calculationTime:
      '12:00 UTC',


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
    },


    siderealTime,


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
    },

  }
}