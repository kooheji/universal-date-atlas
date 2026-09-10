import { CALENDARS } from './calendars'


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
    id: 'world-calendar',
    name: 'World Calendar',
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
    id: 'unix-date',
    name: 'Unix Epoch',
    category: 'chronology',
    family: 'Computing',
  },

  {
    id: 'gps-week',
    name: 'GPS Week',
    category: 'chronology',
    family: 'Navigation',
  },

].map((system) => ({

  ...system,

  status: 'implemented',

  outputSupported: true,

  inputSupported: false,

  accuracy: 'calculated',

}))


const astronomySystems = [

  'Moon phase',

  'Moon illumination',

  'Moon phase angle',

  'Lunar illumination angle',

  'Moon distance',

  'Moon magnitude',

  'Moon ecliptic longitude',

  'Moon ecliptic latitude',

  'Sun ecliptic longitude',

  'Sun ecliptic latitude',

  'Northern season',

  'Southern season',

  'Greenwich sidereal time',

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

  'Maya Long Count',

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
   Planned calendar catalogue
======================================== */

const plannedCalendars = [

  ['revised-julian', 'Revised Julian', 'Christian'],

  ['armenian', 'Armenian Calendar', 'Christian'],

  ['bahai', 'Baháʼí / Badíʿ Calendar', 'Baháʼí'],

  ['bengali', 'Bengali Calendar', 'South Asian'],

  ['tamil', 'Tamil Calendar', 'South Asian'],

  ['malayalam', 'Malayalam Calendar', 'South Asian'],

  ['nepali-bikram-sambat', 'Bikram Sambat', 'South Asian'],

  ['vikram-samvat', 'Vikram Samvat', 'Indian'],

  ['jain', 'Jain Calendar', 'Indian'],

  ['nanakshahi', 'Nanakshahi Calendar', 'Sikh'],

  ['thai-lunar', 'Thai Lunar Calendar', 'Southeast Asian'],

  ['burmese', 'Burmese Calendar', 'Southeast Asian'],

  ['khmer', 'Khmer Calendar', 'Southeast Asian'],

  ['balinese-pawukon', 'Balinese Pawukon', 'Indonesian'],

  ['javanese', 'Javanese Calendar', 'Indonesian'],

  ['ancient-egyptian', 'Ancient Egyptian Civil Calendar', 'Ancient Egyptian'],

  ['babylonian', 'Babylonian Calendar', 'Mesopotamian'],

  ['assyrian', 'Assyrian Calendar', 'Mesopotamian'],

  ['seleucid', 'Seleucid Era', 'Hellenistic'],

  ['attic', 'Attic Calendar', 'Ancient Greek'],

  ['olympiad', 'Olympiad Dating', 'Ancient Greek'],

  ['roman-republican', 'Roman Republican Calendar', 'Roman'],

  ['aztec-xiuhpohualli', 'Xiuhpohualli', 'Aztec'],

  ['aztec-tonalpohualli', 'Tonalpohualli', 'Aztec'],

  ['maya-long-count', 'Maya Long Count', 'Maya'],

  ['maya-tzolkin', 'Maya Tzolkʼin', 'Maya'],

  ['maya-haab', 'Maya Haabʼ', 'Maya'],

  ['inca', 'Inca Calendar', 'Andean'],

  ['zoroastrian', 'Zoroastrian Calendar', 'Iranian'],

  ['alexandrian', 'Alexandrian Calendar', 'Historical'],

  ['geez', 'Geʽez Calendar', 'Ethiopian'],

  ['berber', 'Berber Calendar', 'North African'],

  ['amazigh', 'Amazigh Era', 'North African'],

  ['igbo', 'Igbo Calendar', 'West African'],

  ['akan', 'Akan Calendar', 'West African'],

  ['yoruba', 'Yoruba Calendar', 'West African'],

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

const plannedAstronomy = [

  'Sun constellation',

  'Moon constellation',

  'Moon age',

  'Next new moon',

  'Next full moon',

  'Previous new moon',

  'Previous full moon',

  'Mercury position',

  'Venus position',

  'Mars position',

  'Jupiter position',

  'Saturn position',

  'Uranus position',

  'Neptune position',

  'Nearest equinox',

  'Nearest solstice',

  'Solar declination',

  'Lunar declination',

  'Earth–Sun distance',

].map((name) => ({

  id:
    `planned-${name
      .toLowerCase()
      .replaceAll(' ', '-')}`,

  name,

  category:
    'astronomy',

  family:
    'Astronomical',

  status:
    'planned',

}))


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


/* ========================================
   Fiction — catalogue only for now
======================================== */

const plannedFiction = [

  ['star-trek-stardate', 'Star Trek Stardate'],

  ['star-wars-galactic', 'Star Wars Galactic Dating'],

  ['tolkien-shire', 'Shire Reckoning'],

  ['tolkien-kings', 'Tolkien King’s Reckoning'],

  ['elder-scrolls', 'The Elder Scrolls Era Dating'],

  ['warhammer-imperial', 'Warhammer 40,000 Imperial Dating'],

  ['fallout', 'Fallout Timeline'],

  ['halo', 'Halo Military Calendar'],

  ['mass-effect', 'Mass Effect Timeline'],

  ['dune', 'Dune Imperial Dating'],

  ['foundation', 'Foundation Galactic Era'],

].map(
  ([
    id,
    name,
  ]) => ({

    id,

    name,

    category:
      'fiction',

    family:
      'Fictional',

    status:
      'planned',

    canonicality:
      'research-required',

  }),
)


export const SYSTEM_REGISTRY = [

  ...calendarSystems,

  bahrainCalendar,

  ...chronologySystems,

  ...astronomySystems,

  ...traditionSystems,

  ...plannedCalendars,

  ...plannedAstronomy,

  ...plannedTraditions,

  ...plannedFiction,

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