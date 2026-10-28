import { FICTION_SYSTEMS } from './fiction-registry.js'
import {
  getImplementedSystems,
  getSystemsByCategory,
  SYSTEM_REGISTRY,
} from './system-registry.js'

export const PROVENANCE_AUTHORITY_VALUES = Object.freeze([
  'standard',
  'official-civil',
  'religious-traditional',
  'astronomical',
  'historical-source',
  'historical-reconstruction',
  'modern-popular',
  'cultural-traditional',
  'astrological-traditional',
  'source-derived-fiction',
  'fiction-canonical',
  'atlas-convention',
  'project-canon',
])

export const PROVENANCE_METHOD_VALUES = Object.freeze([
  'library',
  'algorithm',
  'astronomical-model',
  'correlation',
  'historical-reconstruction',
  'direct-conversion',
  'reference-alignment',
  'atlas-sync',
  'proleptic-extension',
  'approximation',
])

export const PROVENANCE_EVIDENCE_VALUES = Object.freeze([
  'high',
  'medium',
  'low',
  'under-review',
])

export const PROVENANCE_SOURCE_TYPES = Object.freeze([
  'standard',
  'specification',
  'government',
  'institutional',
  'academic',
  'software',
])

const LAST_REVIEWED = '2026-10-28'

const SOURCES = Object.freeze({
  iso8601: {
    title: 'ISO 8601 — Date and time format',
    author: 'International Organization for Standardization',
    url: 'https://www.iso.org/iso-8601-date-and-time-format.html',
    type: 'standard',
  },
  temporal: {
    title: 'Temporal specification',
    author: 'TC39',
    url: 'https://tc39.es/proposal-temporal/',
    type: 'specification',
  },
  temporalPolyfill: {
    title: 'Temporal Polyfill',
    author: 'FullCalendar',
    url: 'https://github.com/fullcalendar/temporal-polyfill',
    type: 'software',
  },
  unicodeDates: {
    title: 'Unicode Technical Standard #35, Part 4: Dates',
    author: 'Unicode Consortium',
    url: 'https://unicode.org/reports/tr35/tr35-dates.html',
    type: 'standard',
  },
  usnoJulianDate: {
    title: 'Julian Date Converter and explanatory notes',
    author: 'U.S. Naval Observatory',
    url: 'https://aa.usno.navy.mil/data/JulianDate',
    type: 'institutional',
  },
  calendricalCalculations: {
    title: 'Calendrical Calculations: The Ultimate Edition — book, papers, and code',
    author: 'Edward M. Reingold and Nachum Dershowitz',
    url: 'https://reingold.co/calendars.shtml',
    type: 'academic',
  },
  ibmLilian: {
    title: 'ILE CL usage of CEE APIs: CEEDAYS, CEEDATE, CEEDYWK',
    author: 'IBM',
    url: 'https://www.ibm.com/support/pages/ile-cl-usage-cee-apis-ceedays-ceedate-ceedywk',
    type: 'institutional',
  },
  posixEpoch: {
    title: 'The Epoch',
    author: 'The Open Group',
    url: 'https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html#tag_04_19',
    type: 'standard',
  },
  gpsInterface: {
    title: 'IS-GPS-200N: Navstar GPS Space Segment/Navigation User Interfaces',
    author: 'GPS Directorate',
    url: 'https://archive.gps.gov/technical/icwg/IS-GPS-200N.pdf',
    type: 'specification',
  },
  astronomyEngine: {
    title: 'Astronomy Engine',
    author: 'Donald Cross',
    url: 'https://github.com/cosinekitty/astronomy',
    type: 'software',
  },
  bahrainCalendar: {
    title: 'The Islamic Calendar: A Guidance Booklet',
    author: 'Kingdom of Bahrain, Ministry of Justice and Islamic Affairs',
    url: 'https://www.islam.gov.bh/wp-content/uploads/2020/06/Hijjri-Booklet-1441.pdf',
    type: 'government',
  },
  indianNationalCalendar: {
    title: 'Rashtriya Panchanga — explanation of the National Calendar',
    author: 'Positional Astronomy Centre, India Meteorological Department',
    url: 'https://packolkata.imd.gov.in/panchang/en/explanation',
    type: 'government',
  },
  japaneseEra: {
    title: 'Cabinet Order No. 143 of 2019 (Reiwa era)',
    author: 'Government of Japan',
    url: 'https://laws.e-gov.go.jp/law/431CO0000000143',
    type: 'government',
  },
  mayaCalendar: {
    title: 'The Calendar System — Living Maya Time',
    author: 'Smithsonian National Museum of the American Indian',
    url: 'https://maya.nmai.si.edu/calendar/calendar-system',
    type: 'institutional',
  },
  bengaliLibrary: {
    title: 'date-bengali-revised',
    author: 'commenthol',
    url: 'https://github.com/commenthol/date-bengali-revised',
    type: 'software',
  },
  bikramLibrary: {
    title: 'bikram-sambat',
    author: 'Medic',
    url: 'https://github.com/medic/bikram-sambat',
    type: 'software',
  },
  balineseLibrary: {
    title: 'balinese-date-js-lib',
    author: 'Ida Bagus Putu Peradnya Dinata',
    url: 'https://github.com/peradnya/balinese-date-js-lib',
    type: 'software',
  },
})

const entry = (data) => ({
  sources: [],
  assumptions: [],
  notes: '',
  lastReviewed: LAST_REVIEWED,
  ...data,
})

const temporalCalendar = ({ id, authority, evidenceLevel = 'medium', sources = [], assumptions = [], notes }) => entry({
  id,
  authority,
  method: ['library', 'direct-conversion'],
  evidenceLevel,
  sources: [SOURCES.temporal, SOURCES.temporalPolyfill, SOURCES.unicodeDates, ...sources],
  assumptions: [
    'The Atlas converts from an ISO 8601 PlainDate through Temporal and falls back to Intl.DateTimeFormat when necessary.',
    'Rendered names and era labels can vary with the JavaScript internationalization data available in the runtime.',
    ...assumptions,
  ],
  notes,
})

const manualEntries = [
  temporalCalendar({
    id: 'gregory',
    authority: ['standard', 'official-civil'],
    evidenceLevel: 'high',
    sources: [SOURCES.iso8601],
    notes: 'The Atlas uses the proleptic Gregorian calendar as its canonical CE input calendar.',
  }),
  temporalCalendar({
    id: 'islamic-umalqura',
    authority: ['official-civil', 'religious-traditional'],
    assumptions: ['This is the runtime-provided Umm al-Qura calculation and is not a claim about an official religious sighting.'],
    notes: 'The precise runtime calendar data should be rechecked when the Temporal or internationalization dependency changes.',
  }),
  temporalCalendar({
    id: 'islamic-civil',
    authority: 'religious-traditional',
    sources: [SOURCES.calendricalCalculations],
    assumptions: ['This is an arithmetic tabular calendar, not an observational crescent calendar.'],
    notes: 'The calendar identifier used by the implementation is islamic-civil.',
  }),
  temporalCalendar({
    id: 'persian',
    authority: 'official-civil',
    sources: [SOURCES.calendricalCalculations],
    notes: 'Conversion is delegated to the runtime Persian calendar implementation.',
  }),
  temporalCalendar({
    id: 'hebrew',
    authority: 'religious-traditional',
    sources: [SOURCES.calendricalCalculations],
    notes: 'Conversion is delegated to the runtime Hebrew calendar implementation.',
  }),
  temporalCalendar({
    id: 'chinese',
    authority: 'cultural-traditional',
    sources: [SOURCES.calendricalCalculations],
    notes: 'Conversion is delegated to the runtime Chinese calendar implementation.',
  }),
  temporalCalendar({
    id: 'japanese',
    authority: 'official-civil',
    sources: [SOURCES.japaneseEra],
    assumptions: ['Era boundaries and names depend on maintained runtime era data.'],
    notes: 'The government source records the current Reiwa era; older era coverage comes from runtime calendar data.',
  }),
  temporalCalendar({
    id: 'roc',
    authority: 'official-civil',
    notes: 'The Minguo era conversion is supplied by Temporal/Intl; a primary civil reference remains to be added.',
  }),
  temporalCalendar({
    id: 'indian',
    authority: 'official-civil',
    evidenceLevel: 'high',
    sources: [SOURCES.indianNationalCalendar],
    notes: 'The government source identifies the National Calendar and its 1957 adoption.',
  }),
  temporalCalendar({
    id: 'coptic',
    authority: 'religious-traditional',
    sources: [SOURCES.calendricalCalculations],
    notes: 'Conversion is delegated to the runtime Coptic calendar implementation.',
  }),
  temporalCalendar({
    id: 'ethiopic',
    authority: ['official-civil', 'religious-traditional'],
    sources: [SOURCES.calendricalCalculations],
    notes: 'Conversion is delegated to the runtime Ethiopic calendar implementation.',
  }),
  entry({
    id: 'bahrain-hijri',
    authority: ['astronomical', 'religious-traditional', 'atlas-convention'],
    method: ['astronomical-model', 'algorithm'],
    evidenceLevel: 'under-review',
    sources: [SOURCES.bahrainCalendar, SOURCES.astronomyEngine],
    assumptions: [
      'The reference observer is Makkah at latitude 21.4225°, longitude 39.8262°, and elevation 300 metres.',
      'A candidate month begins only after lunar conjunction and a later Makkah sunset.',
      'At sunset, the Moon centre must be more than 0.26° above the normal refracted horizon so the model treats the full lunar disc as above the horizon.',
      'The returned civil date is the day after the qualifying Makkah sunset; the implementation does not model an official observation or testimony.',
      'AH input is accepted for years 1–9999; CE-to-AH conversion is restricted to CE years 1–10323.',
    ],
    notes: 'The code implements a Bahrain-focused computational model. The official Bahrain booklet establishes calendar context, but a primary publication for the exact 0.26° Makkah criterion has not yet been recorded, so the evidence remains under review.',
  }),
  entry({
    id: 'julian-calendar',
    authority: 'historical-source',
    method: ['algorithm', 'proleptic-extension'],
    evidenceLevel: 'high',
    sources: [SOURCES.usnoJulianDate, SOURCES.calendricalCalculations],
    assumptions: ['The Atlas applies Julian leap-year rules proleptically instead of using country-specific historical adoption dates.'],
    notes: 'The result is a mathematical Julian-calendar conversion, not a claim about the civil calendar used at a location on the selected date.',
  }),
  entry({
    id: 'iso-week-date',
    authority: 'standard',
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.iso8601],
    assumptions: ['Weeks begin Monday and week 1 is the week containing the first Thursday of the Gregorian year.'],
    notes: 'The implementation returns ISO week-numbering year, week, and weekday.',
  }),
  entry({
    id: 'iso-ordinal-date',
    authority: 'standard',
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.iso8601],
    assumptions: ['The ordinal is counted from 1 January in the proleptic Gregorian year.'],
    notes: 'The output is Gregorian year plus a three-digit ordinal day.',
  }),
  entry({
    id: 'julian-day',
    authority: ['standard', 'astronomical'],
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.usnoJulianDate],
    assumptions: ['The overview date is evaluated at 00:00 UTC, yielding a Julian Date ending in .5.'],
    notes: 'This is the continuous astronomical Julian Date computed from the proleptic Gregorian input.',
  }),
  entry({
    id: 'modified-julian-day',
    authority: ['standard', 'astronomical'],
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.usnoJulianDate],
    assumptions: ['Modified Julian Date is calculated as JD − 2,400,000.5.'],
    notes: 'The implementation follows the USNO relationship between JD and MJD.',
  }),
  entry({
    id: 'rata-die',
    authority: 'standard',
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.calendricalCalculations],
    assumptions: ['RD 1 is 1 January 1 in the proleptic Gregorian calendar.'],
    notes: 'The Atlas derives Rata Die from the integer Julian day number.',
  }),
  entry({
    id: 'lilian-day',
    authority: 'standard',
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.ibmLilian],
    assumptions: ['Lilian day 1 is 15 October 1582 Gregorian.'],
    notes: 'The Atlas calculates the continuous day number from the Gregorian reform epoch.',
  }),
  entry({
    id: 'unix-time',
    authority: 'standard',
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.posixEpoch],
    assumptions: ['The selected civil date is evaluated at 00:00 UTC.', 'Leap seconds are not represented by JavaScript Date.'],
    notes: 'Output is elapsed POSIX-style seconds from 1970-01-01T00:00:00Z.',
  }),
  entry({
    id: 'unix-day-number',
    authority: 'atlas-convention',
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.posixEpoch],
    assumptions: ['The Atlas divides the 00:00 UTC Unix timestamp by exactly 86,400 seconds and labels the epoch day as 0.'],
    notes: 'Unix day number is an Atlas display derived from the Unix epoch rather than a separately standardized field.',
  }),
  entry({
    id: 'gps-week',
    authority: 'standard',
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.gpsInterface],
    assumptions: ['The Atlas displays the continuous full week count from 6 January 1980 and does not emulate truncated broadcast rollover fields.'],
    notes: 'Dates before the GPS epoch are reported as before epoch.',
  }),
  entry({
    id: 'gps-day',
    authority: 'standard',
    method: 'algorithm',
    evidenceLevel: 'high',
    sources: [SOURCES.gpsInterface],
    assumptions: ['Sunday is day 0 within the GPS week.'],
    notes: 'Dates before the GPS epoch are reported as before epoch.',
  }),
  entry({
    id: 'maya-long-count',
    authority: 'historical-source',
    method: ['correlation', 'algorithm'],
    evidenceLevel: 'high',
    sources: [SOURCES.mayaCalendar, SOURCES.calendricalCalculations],
    assumptions: ['The Gregorian bridge uses the Goodman–Martínez–Thompson correlation constant 584283.'],
    notes: 'The mixed-radix count uses kin, uinal, tun, katun, and baktun units.',
  }),
  ...['maya-tzolkin', 'maya-haab', 'maya-calendar-round'].map((id) => entry({
    id,
    authority: ['historical-source', 'cultural-traditional'],
    method: ['correlation', 'algorithm'],
    evidenceLevel: 'high',
    sources: [SOURCES.mayaCalendar, SOURCES.calendricalCalculations],
    assumptions: ['The Gregorian bridge uses the Goodman–Martínez–Thompson correlation constant 584283.'],
    notes: id === 'maya-calendar-round'
      ? 'The Calendar Round combines the 260-day Tzolkʼin and 365-day Haabʼ cycles.'
      : 'The cycle position is derived from the same correlated Maya day count used by the Long Count.',
  })),
  entry({
    id: 'bengali',
    authority: 'official-civil',
    method: 'library',
    evidenceLevel: 'medium',
    sources: [SOURCES.bengaliLibrary],
    assumptions: ['The Atlas accepts the npm library output as the revised Bengali civil-calendar conversion.'],
    notes: 'A Bangladesh government primary source for the exact implemented revision remains to be added.',
  }),
  entry({
    id: 'nepali-bikram-sambat',
    authority: 'official-civil',
    method: 'library',
    evidenceLevel: 'medium',
    sources: [SOURCES.bikramLibrary],
    assumptions: ['Conversion is delegated to bikram-sambat version 1.8.1.'],
    notes: 'A Nepal government primary source for the library tables remains to be added.',
  }),
  entry({
    id: 'balinese-pawukon',
    authority: 'cultural-traditional',
    method: 'library',
    evidenceLevel: 'medium',
    sources: [SOURCES.balineseLibrary],
    assumptions: ['The Atlas displays the library-provided sapta wara, panca wara, and wuku positions.'],
    notes: 'The underlying 210-day Pawukon computation is delegated to the external library.',
  }),
  entry({
    id: 'ancient-egyptian',
    authority: 'historical-reconstruction',
    method: ['historical-reconstruction', 'correlation'],
    evidenceLevel: 'under-review',
    sources: [],
    assumptions: ['The Atlas uses a fixed 365-day calendar anchored to Julian day 1448637.5 and labels the result with a Nabonassar-era reconstruction.'],
    notes: 'The exact epoch and naming convention require a directly recorded academic source.',
  }),
  entry({
    id: 'babylonian',
    authority: 'historical-reconstruction',
    method: ['astronomical-model', 'historical-reconstruction'],
    evidenceLevel: 'under-review',
    sources: [SOURCES.astronomyEngine],
    assumptions: ['The year begins at the first calculated new moon after the March equinox.', 'Month declarations and historical intercalations are not reconstructed from dated records.'],
    notes: 'Astronomy Engine supports the computed lunar phases, but the historical model itself still requires academic sourcing.',
  }),
  entry({
    id: 'attic',
    authority: 'historical-reconstruction',
    method: ['astronomical-model', 'historical-reconstruction'],
    evidenceLevel: 'under-review',
    sources: [SOURCES.astronomyEngine],
    assumptions: ['The year begins at the first calculated new moon after the June solstice.', 'Historical month declarations, intercalations, and local decisions are not reproduced.'],
    notes: 'Astronomy Engine supports the computed lunar phases, but the chosen Attic reconstruction still requires academic sourcing.',
  }),
  entry({
    id: 'roman-republican',
    authority: 'historical-reconstruction',
    method: ['historical-reconstruction', 'proleptic-extension'],
    evidenceLevel: 'under-review',
    sources: [],
    assumptions: ['The Atlas maps a proleptic Julian date to Roman month names and an AUC year offset.', 'It does not reconstruct the irregular historical Republican calendar.'],
    notes: 'This is an explicitly labelled reference reconstruction, not an exact Republican conversion.',
  }),
  entry({
    id: 'inca',
    authority: 'historical-reconstruction',
    method: ['reference-alignment', 'approximation'],
    evidenceLevel: 'under-review',
    sources: [],
    assumptions: ['Gregorian months are aligned directly to a twelve-name seasonal list.'],
    notes: 'The result is a seasonal reference and not an exact historical date conversion.',
  }),
  entry({
    id: 'western-tropical-zodiac',
    authority: 'astrological-traditional',
    method: 'algorithm',
    evidenceLevel: 'under-review',
    sources: [],
    assumptions: ['The ecliptic is divided into twelve equal 30° tropical signs from 0° Aries.'],
    notes: 'This is a symbolic astrological classification, not an astronomical constellation.',
  }),
  entry({
    id: 'moon-zodiac',
    authority: 'astrological-traditional',
    method: 'algorithm',
    evidenceLevel: 'under-review',
    sources: [SOURCES.astronomyEngine],
    assumptions: ['Astronomy Engine supplies lunar longitude, which the Atlas divides into twelve equal tropical signs.'],
    notes: 'The longitude is astronomical; the zodiac interpretation is astrological.',
  }),
  entry({
    id: 'planetary-weekday-ruler',
    authority: 'cultural-traditional',
    method: 'correlation',
    evidenceLevel: 'under-review',
    sources: [],
    assumptions: ['Each weekday is associated with a classical planetary ruler through a fixed lookup table.'],
    notes: 'A primary historical reference for the table remains to be recorded.',
  }),
  ...[
    ['chinese-zodiac-animal', 'Chinese zodiac animal'],
    ['chinese-element', 'Chinese element'],
    ['yin---yang', 'Yin/Yang polarity'],
    ['chinese-sexagenary-year', 'Chinese sexagenary year'],
  ].map(([id, label]) => entry({
    id,
    authority: 'cultural-traditional',
    method: ['library', 'correlation'],
    evidenceLevel: 'under-review',
    sources: [SOURCES.unicodeDates],
    assumptions: ['The runtime Chinese calendar supplies a cyclical year name; the Atlas maps its stem and branch to the displayed association.'],
    notes: `${label} methodology is documented, but a primary cultural source remains to be recorded.`,
  })),
  ...[
    ['maya-tzolkʼin', 'Tzolkʼin'],
    ['maya-haabʼ', 'Haabʼ'],
    ['maya-calendar-round-tradition', 'Calendar Round'],
  ].map(([id, label]) => entry({
    id,
    authority: ['historical-source', 'cultural-traditional'],
    method: ['correlation', 'algorithm'],
    evidenceLevel: 'high',
    sources: [SOURCES.mayaCalendar],
    assumptions: ['The cultural card uses the same GMT-correlated calculation as the Maya calendar outputs.'],
    notes: `${label} is presented as a calendrical/cultural cycle rather than empirical astronomy.`,
  })),
]

const astronomyEntries = getSystemsByCategory('astronomy').map((system) => entry({
  id: system.id,
  authority: 'astronomical',
  method: ['library', 'astronomical-model'],
  evidenceLevel: 'high',
  sources: [SOURCES.astronomyEngine],
  assumptions: [
    'Date-only calculations are evaluated at 12:00 UTC; an optional supplied time is interpreted as UTC.',
    'The Atlas reports the Astronomy Engine result or a direct display value derived from it.',
  ],
  notes: 'Astronomy Engine states that its planetary models are based on VSOP87 and NOVAS and are tested against established ephemeris sources.',
}))

const canonicalFictionAuthorities = new Set([
  'tolkien-rules',
  'canonical-structure',
  'canonical-era',
  'canonical-chronology',
  'canonical',
])

function getFictionAuthority(system) {
  if (system.systemAuthority === 'canonical' && system.id === 'ninxa-ahdm') return 'project-canon'
  if (system.systemAuthority === 'atlas-convention') return 'atlas-convention'
  if (canonicalFictionAuthorities.has(system.systemAuthority)) return 'fiction-canonical'
  return 'source-derived-fiction'
}

function getFictionBridge(system) {
  if (system.earthBridge === 'bahrain-hijri') {
    return { authority: 'project-canon', method: 'atlas-sync' }
  }
  if (system.earthBridge === 'reconstructed-sync') {
    return { authority: 'atlas-convention', method: ['atlas-sync', 'approximation'] }
  }
  if (system.earthBridge === 'atlas-sync' || system.earthBridge === 'modern-sync') {
    return { authority: 'atlas-convention', method: 'atlas-sync' }
  }
  return { authority: 'source-derived-fiction', method: 'direct-conversion' }
}

const fictionEntries = FICTION_SYSTEMS.map((system) => {
  const fictionalAuthority = getFictionAuthority(system)
  const earthBridge = getFictionBridge(system)
  const methods = new Set(Array.isArray(earthBridge.method) ? earthBridge.method : [earthBridge.method])
  if (system.conversionType.includes('proleptic')) methods.add('proleptic-extension')
  if (system.conversionType === 'seasonal-analogue') methods.add('approximation')

  return entry({
    id: system.id,
    authority: [...new Set([fictionalAuthority, earthBridge.authority])],
    method: [...methods],
    evidenceLevel: 'under-review',
    sources: [],
    assumptions: [
      `Approved fiction metadata: systemAuthority=${system.systemAuthority}, earthBridge=${system.earthBridge}, conversionType=${system.conversionType}.`,
      'The central provenance entry is derived from the fiction registry and does not replace its domain-specific fields.',
    ],
    notes: 'The chronology classification is preserved, but direct franchise or publication citations have not yet been recorded in the central source catalogue.',
    fictionalSystem: {
      authority: fictionalAuthority,
      registryValue: system.systemAuthority,
    },
    earthBridge: {
      ...earthBridge,
      registryValue: system.earthBridge,
    },
  })
})

export const PROVENANCE_REGISTRY = Object.freeze([
  ...manualEntries,
  ...astronomyEntries,
  ...fictionEntries,
])

const provenanceById = new Map(PROVENANCE_REGISTRY.map((item) => [item.id, item]))

export function getProvenance(id) {
  return provenanceById.get(id) ?? null
}

export function getSources(id) {
  return getProvenance(id)?.sources ?? []
}

export function getSystemsByEvidenceLevel(level) {
  return PROVENANCE_REGISTRY.filter((item) => item.evidenceLevel === level)
}

export function getSystemsMissingProvenance() {
  return getImplementedSystems().filter((system) => !provenanceById.has(system.id))
}

export function getSystemsMissingSources() {
  return getImplementedSystems().filter((system) => getSources(system.id).length === 0)
}

function includesControlledValue(value, expected) {
  return (Array.isArray(value) ? value : [value]).includes(expected)
}

export function getProvenanceAuditReport() {
  const implemented = getImplementedSystems()
  const implementedIds = new Set(implemented.map(({ id }) => id))
  const implementedProvenance = PROVENANCE_REGISTRY.filter(({ id }) => implementedIds.has(id))
  const requiringResearch = implemented.filter((system) => {
    const provenance = getProvenance(system.id)
    return !provenance || provenance.evidenceLevel === 'under-review'
  })

  return {
    totalImplementedSystems: implemented.length,
    systemsWithDocumentedSources: implementedProvenance.filter(({ sources }) => sources.length > 0).length,
    systemsWithMethodologyButNoSource: implementedProvenance.filter(({ sources }) => sources.length === 0).length,
    systemsRequiringResearch: requiringResearch.length,
    reconstructedSystems: implementedProvenance.filter((item) => (
      includesControlledValue(item.authority, 'historical-reconstruction') ||
      includesControlledValue(item.method, 'historical-reconstruction')
    )).length,
    atlasSynchronizedSystems: implementedProvenance.filter((item) => includesControlledValue(item.method, 'atlas-sync')).length,
    externalLibrarySystems: implementedProvenance.filter((item) => includesControlledValue(item.method, 'library')).length,
    missingProvenanceIds: getSystemsMissingProvenance().map(({ id }) => id),
    missingSourceIds: getSystemsMissingSources().map(({ id }) => id),
    researchRequiredIds: requiringResearch.map(({ id }) => id),
    registrySize: SYSTEM_REGISTRY.length,
    provenanceSize: PROVENANCE_REGISTRY.length,
  }
}
