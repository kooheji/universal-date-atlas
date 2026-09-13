import { CALENDARS } from './calendars'
import { FICTION_SYSTEMS } from './fiction-registry'


/*
  Universal Chronology Atlas
  Master System Registry

  Important:
  This file describes systems and their status.
  It does NOT perform conversions.

  Calculation logic remains inside the engine modules.
*/


const calendarSystems =
  CALENDARS.map((calendar) => ({

    id: calendar.id,

    name: calendar.name,

    category: 'calendar',

    family: calendar.family,

    status: 'implemented',

    outputSupported: true,

    inputSupported:
      calendar.id === 'gregory',

    accuracy:
      'library',

    description:
      calendar.description,

  }))


const chronologySystems = [

  {
    id: 'julian-calendar',
    name: 'Julian Calendar',
    category: 'chronology',
    family: 'Historical',
  },

  {
    id: 'iso-week-date',
    name: 'ISO Week Date',
    category: 'chronology',
    family: 'ISO',
  },

  {
    id: 'iso-ordinal-date',
    name: 'ISO Ordinal Date',
    category: 'chronology',
    family: 'ISO',
  },

  {
    id: 'international-fixed',
    name: 'International Fixed Calendar',
    category: 'chronology',
    family: 'Reform',
  },

  {
    id: 'discordian',
    name: 'Discordian Calendar',
    category: 'chronology',
    family: 'Alternative',
  },

  {
    id: 'french-republican',
    name: 'French Republican Calendar',
    category: 'chronology',
    family: 'Revolutionary',
  },

  {
    id: 'holocene',
    name: 'Holocene / Human Era',
    category: 'chronology',
    family: 'Alternative',
  },

  {
    id: 'roman-auc',
    name: 'Ab Urbe Condita',
    category: 'chronology',
    family: 'Roman',
  },

  {
    id: 'byzantine-am',
    name: 'Byzantine Anno Mundi',
    category: 'chronology',
    family: 'Byzantine',
  },

  {
    id: 'rata-die',
    name: 'Rata Die',
    category: 'chronology',
    family: 'Computational',
  },

  {
    id: 'lilian-day',
    name: 'Lilian Day Number',
    category: 'chronology',
    family: 'Computational',
  },

  {
    id: 'unix-time',
    name: 'Unix Time / Unix Epoch',
    category: 'chronology',
    family: 'Computing',
  },

  {
    id: 'unix-day-number',
    name: 'Unix Day Number',
    category: 'chronology',
    family: 'Computing',
  },

  {
    id: 'gps-week',
    name: 'GPS Week',
    category: 'chronology',
    family: 'Navigation',
  },

  {
    id: 'gps-day',
    name: 'GPS Day',
    category: 'chronology',
    family: 'Navigation',
  },

  {
    id: 'seleucid-era',
    name: 'Seleucid Era',
    category: 'chronology',
    family: 'Hellenistic',
  },

  {
    id: 'olympiad-dating',
    name: 'Olympiad Dating',
    category: 'chronology',
    family: 'Ancient Greek',
  },

  {
    id: 'amazigh-era',
    name: 'Amazigh Era',
    category: 'chronology',
    family: 'North African',
  },

  {
    id: 'maya-long-count',
    name: 'Maya Long Count',
    category: 'chronology',
    family: 'Maya',
  },

  ...[
    ['alexandrian-era', 'Alexandrian Era', 'Alexandrian'],
    ['indiction-cycle', 'Indiction Cycle', 'Roman / Byzantine'],
    ['era-of-martyrs', 'Diocletian / Era of Martyrs', 'Coptic'],
    ['spanish-era', 'Spanish Era', 'Iberian'],
  ].map(([id, name, family]) => ({
    id,
    name,
    category: 'chronology',
    family,
  })),

].map((system) => ({

  ...system,

  status: 'implemented',

  outputSupported: true,

  inputSupported: false,

  accuracy: 'calculated',

}))


const astronomySystems = [
  'Moon Phase',
  'Moon Illumination',
  'Moon Age',
  'Moon Phase Angle',
  'Lunar Illumination Angle',
  'Moon Apparent Magnitude',
  'Earth–Moon Distance',
  'Moon Ecliptic Longitude',
  'Moon Ecliptic Latitude',
  'Moon Declination',
  'Moon Astronomical Constellation',
  'Previous New Moon',
  'Next New Moon',
  'Previous Full Moon',
  'Next Full Moon',
  'Sun Ecliptic Longitude',
  'Sun Ecliptic Latitude',
  'Solar Declination',
  'Earth–Sun Distance',
  'Sun Astronomical Constellation',
  'Mercury Position',
  'Venus Position',
  'Mars Position',
  'Jupiter Position',
  'Saturn Position',
  'Uranus Position',
  'Neptune Position',
  'Greenwich Sidereal Time',
  'Julian Astronomical Instant',
  'Solar Longitude',
  'Seasonal Position Through Earth’s Orbit',
  'Northern Hemisphere Season',
  'Southern Hemisphere Season',
  'March Equinox',
  'June Solstice',
  'September Equinox',
  'December Solstice',
  'Nearest Equinox',
  'Nearest Solstice',

].map((name) => ({

  id:
    name
      .toLowerCase()
      .replaceAll(' ', '-'),

  name,

  category: 'astronomy',

  family: 'Astronomical',

  status: 'implemented',

  accuracy: 'calculated',

}))


const traditionSystems = [

  'Western Tropical Zodiac',

  'Moon Zodiac',

  'Planetary Weekday Ruler',

  'Chinese Zodiac Animal',

  'Chinese Element',

  'Yin / Yang',

  'Chinese Sexagenary Year',

  'Maya Tzolkʼin',

  'Maya Haabʼ',

  'Maya Calendar Round',

].map((name) => ({

  id:
    name
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll('/', '-'),

  name,

  category: 'tradition',

  family: 'Cultural',

  status: 'implemented',

  accuracy: 'calculated',

}))


/*
  Special Bahrain calendar.

  It is not part of CALENDARS because it uses
  its own astronomical calculation engine.
*/

const bahrainCalendar = {

  id: 'bahrain-hijri',

  name:
    'Al Zubarah & Bahrain Hijri',

  category:
    'calendar',

  family:
    'Islamic',

  status:
    'implemented',

  inputSupported:
    true,

  outputSupported:
    true,

  accuracy:
    'astronomical-model',

  calculationMethod:
    'Conjunction and lunar horizon criterion',

  note:
    'Official lunar observations may supersede calculated dates.',

}


/* ========================================
   Additional calendar implementations
======================================== */

const additionalCalendars = [
  ['zoroastrian', 'Zoroastrian Calendar', 'Iranian', 'astronomical-model'],
  ['bengali', 'Bengali Calendar', 'South Asian', 'library'],
  ['tamil', 'Tamil Calendar', 'South Asian', 'astronomical-model'],
  ['malayalam', 'Malayalam Calendar', 'South Asian', 'astronomical-model'],
  ['nepali-bikram-sambat', 'Bikram Sambat', 'South Asian', 'library'],
  ['vikram-samvat', 'Vikram Samvat', 'Indian', 'astronomical-model'],
  ['jain', 'Jain Calendar', 'Indian', 'astronomical-model'],
  ['nanakshahi', 'Nanakshahi Calendar', 'Sikh', 'calculated'],
  ['thai-lunar', 'Thai Lunar Calendar', 'Southeast Asian', 'astronomical-model'],
  ['burmese', 'Burmese Calendar', 'Southeast Asian', 'astronomical-model'],
  ['khmer', 'Khmer Calendar', 'Southeast Asian', 'astronomical-model'],
  ['balinese-pawukon', 'Balinese Pawukon', 'Indonesian', 'library'],
  ['javanese', 'Javanese Calendar', 'Indonesian', 'calculated'],
  ['armenian', 'Armenian Calendar', 'Christian & Liturgical', 'calculated'],
  ['bahai', 'Baháʼí / Badíʿ Calendar', 'Christian & Liturgical', 'astronomical-model'],
  ['ancient-egyptian', 'Ancient Egyptian Civil Calendar', 'Ancient Egyptian', 'calculated'],
  ['berber', 'Berber Calendar', 'North African', 'calculated'],
  ['babylonian', 'Babylonian Calendar', 'Mesopotamian', 'astronomical-model'],
  ['assyrian', 'Modern Assyrian Calendar', 'Mesopotamian', 'calculated'],
  ['attic', 'Attic / Athenian Reconstruction', 'Ancient Greek', 'astronomical-model'],
  ['roman-republican', 'Roman Republican Reconstruction', 'Roman', 'calculated'],
  ['maya-tzolkin', 'Maya Tzolkʼin', 'Maya', 'calculated'],
  ['maya-haab', 'Maya Haabʼ', 'Maya', 'calculated'],
  ['maya-calendar-round', 'Maya Calendar Round', 'Maya', 'calculated'],
  ['aztec-xiuhpohualli', 'Xiuhpohualli', 'Aztec', 'calculated'],
  ['aztec-tonalpohualli', 'Tonalpohualli', 'Aztec', 'calculated'],
  ['inca', 'Inca Seasonal Reference', 'Andean', 'calculated'],
  ['igbo', 'Igbo Calendar', 'West African', 'calculated'],
].map(([id, name, family, accuracy]) => ({
  id,
  name,
  category: 'calendar',
  family,
  status: 'implemented',
  inputSupported: false,
  outputSupported: true,
  accuracy,
}))


/* ========================================
   Planned calendar catalogue
======================================== */

const plannedCalendars = [

  ['maya-long-count', 'Maya Long Count', 'Maya'],

  ['geez', 'Geʽez Calendar', 'Ethiopian'],

].map(
  ([
    id,
    name,
    family,
  ]) => ({

    id,

    name,

    category:
      'calendar',

    family,

    status:
      'planned',

    inputSupported:
      false,

    outputSupported:
      false,

    accuracy:
      null,

  }),
)


/* ========================================
   Planned astronomical systems
======================================== */

const plannedAstronomy = []


/* ========================================
   Planned traditions
======================================== */

const plannedTraditions = [

  'Vedic Sidereal Zodiac',

  'Nakshatra',

  'Arabic Lunar Mansion',

  'Chinese Sexagenary Day',

  'Chinese Sexagenary Month',

  'Four Pillars — Year',

  'Four Pillars — Month',

  'Four Pillars — Day',

  'Aztec Day Sign',

  'Seasonal Wheel of the Year',

].map((name) => ({

  id:
    `planned-${name
      .toLowerCase()
      .replaceAll(' ', '-')}`,

  name,

  category:
    'tradition',

  family:
    'Cultural',

  status:
    'planned',

}))


export const SYSTEM_REGISTRY = [

  ...calendarSystems,

  bahrainCalendar,

  ...additionalCalendars,

  ...chronologySystems,

  ...astronomySystems,

  ...traditionSystems,

  ...plannedCalendars,

  ...plannedAstronomy,

  ...plannedTraditions,

  ...FICTION_SYSTEMS,

]


export function getSystemsByCategory(
  category,
) {

  return SYSTEM_REGISTRY.filter(
    (system) =>
      system.category === category,
  )
}


export function getImplementedSystems() {

  return SYSTEM_REGISTRY.filter(
    (system) =>
      system.status ===
      'implemented',
  )
}


export function getPlannedSystems() {

  return SYSTEM_REGISTRY.filter(
    (system) =>
      system.status ===
      'planned',
  )
}


export function getRegistryStats() {

  const implemented =
    getImplementedSystems()


  return {

    totalCatalogue:
      SYSTEM_REGISTRY.length,

    implemented:
      implemented.length,

    planned:
      getPlannedSystems().length,

    calendars:
      implemented.filter(
        (system) =>
          system.category ===
          'calendar',
      ).length,

    chronologies:
      implemented.filter(
        (system) =>
          system.category ===
          'chronology',
      ).length,

    astronomy:
      implemented.filter(
        (system) =>
          system.category ===
          'astronomy',
      ).length,

    traditions:
      implemented.filter(
        (system) =>
          system.category ===
          'tradition',
      ).length,

    fiction:
      implemented.filter(
        (system) =>
          system.category ===
          'fiction',
      ).length,

  }
}
