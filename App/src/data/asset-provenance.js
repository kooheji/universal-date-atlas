export const ASSET_CATEGORIES = Object.freeze([
  'project-branding',
  'calendar-symbol',
  'chronology-symbol',
  'tradition-symbol',
  'fiction-symbol',
  'inline-symbol',
  'public-site-asset',
  'shared-icon-sprite',
])

export const ASSET_DESIGN_ORIGINS = Object.freeze([
  'project-original',
  'historical-traditional-motif',
  'generic-symbol',
  'national-civil-emblem',
  'franchise-related',
  'third-party',
  'unknown',
])

export const ASSET_CREATION_METHODS = Object.freeze([
  'manual-vector',
  'manual-drawing',
  'trace-from-reference',
  'programmatic',
  'generated-favicon',
  'ai-generated-raster',
  'third-party-file',
  'unknown',
])

export const ASSET_REFERENCE_INFLUENCES = Object.freeze([
  'ai-generated-reference',
  'historical-reference',
  'cultural-reference',
  'religious-reference',
  'national-emblem-reference',
  'franchise-reference',
  'technical-reference',
  'none-recorded',
])

export const ASSET_PROVENANCE_BASES = Object.freeze([
  'owner-reported',
  'repository-evidence',
  'source-file-evidence',
  'third-party-documentation',
  'unknown',
])

export const ASSET_RIGHTS_STATUSES = Object.freeze([
  'project-owned',
  'public-domain-motif',
  'traditional-symbol-review',
  'third-party-permissive',
  'third-party-restricted',
  'trademark-reference',
  'review-required',
  'unknown',
])

export const ASSET_TRADEMARK_RISKS = Object.freeze([
  'low',
  'medium',
  'high',
  'review',
])

export const ASSET_REVIEW_CLASSIFICATIONS = Object.freeze([
  'low-risk',
  'review',
  'likely-franchise-mark',
  'not-applicable',
])

const LAST_REVIEWED = '2026-10-28'

const asset = ({
  id,
  path,
  assetKind = 'file',
  symbolId = '',
  category,
  subject,
  designOrigin,
  creationMethod,
  referenceInfluence = ['none-recorded'],
  provenanceBasis = ['repository-evidence'],
  basedOn = '',
  rightsStatus,
  trademarkRisk = 'low',
  reviewClassification = 'not-applicable',
  derivedFrom = '',
  notes = '',
  components = [],
}) => Object.freeze({
  id: id || path,
  path,
  assetKind,
  symbolId,
  category,
  subject,
  designOrigin,
  creationMethod,
  referenceInfluence: Object.freeze(referenceInfluence),
  provenanceBasis: Object.freeze(provenanceBasis),
  basedOn,
  rightsStatus,
  trademarkRisk,
  reviewClassification,
  derivedFrom,
  notes,
  components: Object.freeze(components),
  lastReviewed: LAST_REVIEWED,
})

const numberedPath = (directory, prefix, index) =>
  `src/assets/${directory}/${prefix}-${String(index + 1).padStart(2, '0')}.svg`

const CALENDAR_SUBJECTS = [
  'Gregorian Calendar',
  'Julian Calendar',
  'International Fixed Calendar',
  'French Republican Calendar',
  'Al Zubarah & Bahrain Hijri',
  'Hijri — Umm al-Qura',
  'Hijri — Civil / Tabular',
  'Persian / Solar Hijri',
  'Zoroastrian Calendar',
  'Hebrew Calendar',
  'Chinese Traditional Calendar',
  'Korean Dangi',
  'Japanese Imperial Calendar',
  'ROC / Minguo Calendar',
  'Indian National / Saka',
  'Vikram Samvat',
  'Nepali Bikram Sambat',
  'Bengali Calendar',
  'Tamil Calendar',
  'Malayalam Calendar',
  'Jain Calendar',
  'Nanakshahi Calendar',
  'Buddhist Calendar',
  'Thai Lunar Calendar',
  'Burmese Calendar',
  'Khmer Calendar',
  'Balinese Pawukon',
  'Javanese Calendar',
  'Coptic Calendar',
  'Ethiopian Calendar',
  'Ethiopic Amete Alem',
  'Armenian Calendar',
  'Baháʼí Calendar',
  'Ancient Egyptian Calendar',
  'Berber Calendar',
  'Babylonian Calendar',
  'Assyrian Calendar',
  'Attic Calendar',
  'Roman Republican Calendar',
  'Maya Tzolkʼin',
  'Maya Haabʼ',
  'Maya Calendar Round',
  'Aztec Xiuhpohualli',
  'Aztec Tonalpohualli',
  'Inca Calendar',
  'Igbo Calendar',
  'Discordian Calendar',
]

const CALENDAR_GENERIC = new Set([3])
const CALENDAR_NATIONAL_EMBLEMS = new Map([
  [13, 'Imperial chrysanthemum motif'],
  [14, 'Republic of China White Sun emblem'],
  [15, 'Ashoka Chakra'],
])

const calendarAssets = CALENDAR_SUBJECTS.map((subject, index) => {
  const number = index + 1
  const nationalEmblem = CALENDAR_NATIONAL_EMBLEMS.get(number)
  const generic = CALENDAR_GENERIC.has(number)

  return asset({
    path: numberedPath('calendar-symbols', 'calendars', index),
    category: 'calendar-symbol',
    subject,
    designOrigin: nationalEmblem
      ? 'national-civil-emblem'
      : generic
        ? 'generic-symbol'
        : 'historical-traditional-motif',
    creationMethod: 'manual-vector',
    referenceInfluence: nationalEmblem
      ? ['ai-generated-reference', 'national-emblem-reference']
      : generic
        ? ['ai-generated-reference', 'technical-reference']
        : ['ai-generated-reference', 'historical-reference', 'cultural-reference'],
    provenanceBasis: ['owner-reported', 'source-file-evidence'],
    basedOn: nationalEmblem || `${subject} historical, religious, or cultural iconography`,
    rightsStatus: nationalEmblem
      ? 'review-required'
      : generic
        ? 'project-owned'
        : 'traditional-symbol-review',
    trademarkRisk: nationalEmblem ? 'review' : 'low',
    reviewClassification: nationalEmblem ? 'review' : 'low-risk',
    notes: nationalEmblem
      ? 'The owner reports manually creating the SVG in Adobe Illustrator. Its underlying design is a national or civil emblem, so source-rendering and applicable emblem rules still require review; AI-generated material was used only as design reference/inspiration.'
      : generic
        ? 'The owner reports manually creating the vector in Adobe Illustrator, with AI-generated visual references used during ideation rather than traced into the final SVG.'
        : 'The owner reports manually creating the vector in Adobe Illustrator. Historical/cultural and AI-generated references informed ideation; reference use is separate from final-file authorship.',
  })
})

const CHRONOLOGY_SUBJECTS = [
  'ISO Week Date',
  'ISO Ordinal Date',
  'Julian Date',
  'Modified Julian Date',
  'Rata Die',
  'Lilian Day',
  'Unix Time',
  'Unix Day Number',
  'GPS Week',
  'GPS Day',
  'Roman Ab Urbe Condita',
  'Byzantine Anno Mundi',
  'Seleucid Era',
  'Olympiad Dating',
  'Amazigh Era',
  'Holocene / Human Era',
  'Maya Long Count',
  'Alexandrian Era',
  'Indiction Cycle',
  'Era of Martyrs',
  'Spanish Era',
  'Unmapped chronology cross symbol',
]

const CHRONOLOGY_HISTORICAL = new Set([11, 12, 13, 14, 15, 17, 18, 19, 20, 21])

const chronologyAssets = CHRONOLOGY_SUBJECTS.map((subject, index) => {
  const number = index + 1
  const historical = CHRONOLOGY_HISTORICAL.has(number)
  const unmapped = number === 22

  return asset({
    path: numberedPath('chronology-symbols', 'chronology', index),
    category: 'chronology-symbol',
    subject,
    designOrigin: unmapped
      ? 'unknown'
      : historical
        ? 'historical-traditional-motif'
        : 'generic-symbol',
    creationMethod: 'manual-vector',
    referenceInfluence: unmapped
      ? ['ai-generated-reference']
      : historical
        ? ['ai-generated-reference', 'historical-reference']
        : ['ai-generated-reference', 'technical-reference'],
    provenanceBasis: ['owner-reported', 'source-file-evidence'],
    basedOn: unmapped
      ? 'Cross motif; no current mapping exists in src/ui/symbols.js'
      : historical
        ? `${subject} historical iconography`
        : `${subject} technical or generic day-count iconography`,
    rightsStatus: unmapped
      ? 'unknown'
      : historical
        ? 'traditional-symbol-review'
        : 'project-owned',
    trademarkRisk: unmapped ? 'review' : 'low',
    reviewClassification: unmapped ? 'review' : 'low-risk',
    notes: unmapped
      ? 'The owner reports manual Adobe Illustrator creation and AI-generated visual-reference use. The file is committed but is not selected by the current chronology SVG mapping, so its intended subject remains unknown.'
      : 'The owner reports manual Adobe Illustrator creation; AI-generated material was used as visual reference/inspiration, not as the final artwork or a traced source.',
  })
})

const TRADITION_SUBJECTS = [
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

const traditionAssets = TRADITION_SUBJECTS.map((subject, index) => {
  const generic = index >= 38

  return asset({
    path: numberedPath('tradition-symbols', 'tradition', index),
    category: 'tradition-symbol',
    subject,
    designOrigin: generic
      ? 'generic-symbol'
      : 'historical-traditional-motif',
    creationMethod: 'manual-vector',
    referenceInfluence: generic
      ? ['ai-generated-reference', 'technical-reference']
      : ['ai-generated-reference', 'cultural-reference'],
    provenanceBasis: ['owner-reported', 'source-file-evidence'],
    basedOn: generic
      ? `${subject} generic numerical iconography`
      : `${subject} cultural, astronomical, or traditional motif`,
    rightsStatus: generic ? 'project-owned' : 'traditional-symbol-review',
    reviewClassification: generic ? 'low-risk' : 'review',
    notes: generic
      ? 'The owner reports manually creating this generic vector in Adobe Illustrator, with AI-generated visual references used for ideation rather than tracing.'
      : 'The owner reports manual Adobe Illustrator creation. Cultural and AI-generated references informed ideation; this does not make the final SVG AI-generated or establish that every underlying motif is unrestricted.',
  })
})

const FICTION_SUBJECTS = [
  ['Star Trek — TNG-era Stardate', 'Star Trek', true],
  ['Star Trek — Kelvin Timeline Stardate', 'Star Trek', true],
  ['Tolkien — Shire Reckoning', 'Tolkien / Middle-earth', false],
  ['Tolkien — Kings’ Reckoning', 'Tolkien / Middle-earth', false],
  ['Tolkien — Stewards’ Reckoning', 'Tolkien / Middle-earth', true],
  ['Tolkien — New Reckoning', 'Tolkien / Middle-earth', true],
  ['Tolkien — Reckoning of Rivendell', 'Tolkien / Middle-earth', false],
  ['The Elder Scrolls — Tamrielic Calendar', 'The Elder Scrolls', false],
  ['The Elder Scrolls — Tamrielic Era', 'The Elder Scrolls', true],
  ['Warhammer 40,000 — Imperial Dating System', 'Warhammer 40,000', true],
  ['Star Wars — BBY / ABY', 'Star Wars', true],
  ['Star Wars — Galactic Standard Calendar', 'Star Wars', true],
  ['Battlestar Galactica — Caprican Calendar', 'Battlestar Galactica', true],
  ['Warhammer Fantasy — Imperial Calendar', 'Warhammer Fantasy', true],
  ['Warhammer Fantasy — Bretonnian Calendar', 'Warhammer Fantasy', false],
  ['Warhammer Fantasy — Gospodar Calendar', 'Warhammer Fantasy', true],
  ['Warhammer Fantasy — Dwarf Calendar', 'Warhammer Fantasy', false],
  ['Warcraft — Dark Portal Reckoning', 'Warcraft', false],
  ['Warcraft — King’s Calendar', 'Warcraft', true],
  ['Final Fantasy XIV — Eorzean Calendar', 'Final Fantasy XIV', true],
  ['The Witcher — Elven Calendar', 'The Witcher', true],
  ['Dragon Age — Chantry Calendar', 'Dragon Age', true],
  ['Dragon Age — Tevinter Imperial Calendar', 'Dragon Age', true],
  ['Dragon Age — Elven Reckoning', 'Dragon Age', true],
  ['A Song of Ice and Fire — Westerosi Calendar', 'A Song of Ice and Fire / Game of Thrones', false],
  ['EVE Online — YC Calendar', 'EVE Online', false],
]

const fictionAssets = FICTION_SUBJECTS.map(([subject, universe, likelyMark], index) => asset({
  path: numberedPath('fiction-symbols', 'fiction', index),
  category: 'fiction-symbol',
  subject,
  designOrigin: 'franchise-related',
  creationMethod: 'manual-vector',
  referenceInfluence: ['ai-generated-reference', 'franchise-reference'],
  provenanceBasis: ['owner-reported', 'source-file-evidence'],
  basedOn: `${universe} visual identity or subject matter`,
  rightsStatus: likelyMark ? 'trademark-reference' : 'review-required',
  trademarkRisk: likelyMark ? 'high' : 'review',
  reviewClassification: likelyMark ? 'likely-franchise-mark' : 'review',
  notes: likelyMark
    ? 'The owner manually created the SVG in Adobe Illustrator, using AI-generated and franchise references for ideation. Manual authorship does not remove the rights risk created by recognizable franchise or faction branding.'
    : 'The owner manually created the SVG in Adobe Illustrator, using AI-generated and franchise references for ideation. The current evidence does not establish whether the design is official branding, inspired artwork, or an original chronology-specific symbol.',
}))

const inlineAssets = [
  asset({
    id: 'src/ui/symbols.js#MENORAH',
    path: 'src/ui/symbols.js',
    assetKind: 'inline',
    symbolId: 'MENORAH',
    category: 'inline-symbol',
    subject: 'Hebrew calendar menorah drawing',
    designOrigin: 'historical-traditional-motif',
    creationMethod: 'manual-vector',
    referenceInfluence: ['historical-reference', 'religious-reference', 'cultural-reference'],
    provenanceBasis: ['source-file-evidence'],
    basedOn: 'Menorah religious and historical iconography',
    rightsStatus: 'traditional-symbol-review',
    trademarkRisk: 'low',
    reviewClassification: 'review',
    notes: 'Inline SVG path artwork embedded in src/ui/symbols.js. It is inventoried without moving or changing the drawing.',
  }),
  asset({
    id: 'src/ui/symbols.js#ROMAN_EAGLE',
    path: 'src/ui/symbols.js',
    assetKind: 'inline',
    symbolId: 'ROMAN_EAGLE',
    category: 'inline-symbol',
    subject: 'Roman Republican eagle drawing',
    designOrigin: 'historical-traditional-motif',
    creationMethod: 'manual-vector',
    referenceInfluence: ['historical-reference', 'cultural-reference'],
    provenanceBasis: ['source-file-evidence'],
    basedOn: 'Roman eagle historical iconography',
    rightsStatus: 'traditional-symbol-review',
    trademarkRisk: 'low',
    reviewClassification: 'review',
    notes: 'Inline SVG path artwork embedded in src/ui/symbols.js. It is inventoried without moving or changing the drawing.',
  }),
]

const projectAndPublicAssets = [
  asset({
    path: 'src/assets/fiction-symbols/ninxa.svg',
    category: 'fiction-symbol',
    subject: 'NINXA Impratoria — AHDM Chronology',
    designOrigin: 'project-original',
    creationMethod: 'manual-vector',
    referenceInfluence: ['none-recorded'],
    provenanceBasis: ['owner-reported', 'source-file-evidence'],
    basedOn: 'NINXA project-canon insignia',
    rightsStatus: 'project-owned',
    trademarkRisk: 'low',
    reviewClassification: 'low-risk',
    notes: 'Project-canon artwork with no third-party franchise relationship identified. Retain the original editable/source record for a future ownership declaration.',
  }),
  asset({
    path: 'public/favicon.svg',
    category: 'project-branding',
    subject: 'Universal Chronology Atlas favicon master',
    designOrigin: 'project-original',
    creationMethod: 'programmatic',
    referenceInfluence: ['none-recorded'],
    provenanceBasis: ['repository-evidence'],
    basedOn: 'Generic globe, orbit, and atlas motif',
    rightsStatus: 'project-owned',
    trademarkRisk: 'low',
    reviewClassification: 'low-risk',
    notes: 'Master vector for the favicon family.',
  }),
  ...[
    ['public/favicon-16x16.png', '16×16 PNG favicon'],
    ['public/favicon-32x32.png', '32×32 PNG favicon'],
    ['public/favicon.ico', 'ICO favicon bundle'],
    ['public/apple-touch-icon.png', 'Apple touch icon'],
    ['public/android-chrome-192x192.png', '192×192 Android icon'],
    ['public/android-chrome-512x512.png', '512×512 Android icon'],
  ].map(([path, subject]) => asset({
    path,
    category: 'project-branding',
    subject,
    designOrigin: 'project-original',
    creationMethod: 'generated-favicon',
    referenceInfluence: ['none-recorded'],
    provenanceBasis: ['repository-evidence'],
    basedOn: 'Universal Chronology Atlas favicon master',
    rightsStatus: 'project-owned',
    trademarkRisk: 'low',
    reviewClassification: 'low-risk',
    derivedFrom: 'public/favicon.svg',
    notes: 'Generated size/format derivative; not independently authored artwork.',
  })),
  asset({
    path: 'public/og-image.png',
    category: 'public-site-asset',
    subject: 'Universal Chronology Atlas social preview artwork',
    designOrigin: 'unknown',
    creationMethod: 'ai-generated-raster',
    referenceInfluence: ['none-recorded'],
    provenanceBasis: ['repository-evidence'],
    basedOn: 'Atlas branding, globe, astronomical diagrams, architecture, and cultural symbols',
    rightsStatus: 'review-required',
    trademarkRisk: 'review',
    reviewClassification: 'review',
    notes: 'The composite raster is strongly indicative of an AI-assisted/generative workflow, but the model, prompt, source references, and post-processing history are not recorded. No exclusive-rights conclusion is made for generated portions.',
  }),
  asset({
    path: 'public/icons.svg',
    category: 'shared-icon-sprite',
    subject: 'Shared footer and social icon sprite',
    designOrigin: 'third-party',
    creationMethod: 'third-party-file',
    referenceInfluence: ['none-recorded'],
    provenanceBasis: ['source-file-evidence'],
    basedOn: 'Bluesky, Discord, GitHub, and X marks plus generic documentation/social icons',
    rightsStatus: 'trademark-reference',
    trademarkRisk: 'high',
    reviewClassification: 'review',
    notes: 'This is a mixed sprite. Brand glyphs remain third-party marks; the repository records no icon-library source or permission grant.',
    components: [
      'bluesky-icon — third-party mark',
      'discord-icon — third-party mark',
      'github-icon — third-party mark',
      'x-icon — third-party mark',
      'documentation-icon — generic icon, source unrecorded',
      'social-icon — generic icon, source unrecorded',
    ],
  }),
]

export const ASSET_PROVENANCE = Object.freeze([
  ...calendarAssets,
  ...chronologyAssets,
  ...traditionAssets,
  ...fictionAssets,
  ...inlineAssets,
  ...projectAndPublicAssets,
])

export function getAssetProvenance(idOrPath) {
  return ASSET_PROVENANCE.find((entry) => entry.id === idOrPath || entry.path === idOrPath) || null
}

export function getAssetsByDesignOrigin(designOrigin) {
  return ASSET_PROVENANCE.filter((entry) => entry.designOrigin === designOrigin)
}

export function getAssetsByRightsStatus(rightsStatus) {
  return ASSET_PROVENANCE.filter((entry) => entry.rightsStatus === rightsStatus)
}

export function getAssetsByReviewClassification(reviewClassification) {
  return ASSET_PROVENANCE.filter((entry) => entry.reviewClassification === reviewClassification)
}
