const entry = ({
  id,
  universe,
  name,
  family,
  continuity = '',
  status = 'implemented',
  systemAuthority,
  earthBridge,
  conversionType,
  confidence = 'medium',
  sourceAuditRequired = false,
  symbol,
  description,
}) => ({
  id,
  universe,
  name,
  category: 'fiction',
  family,
  continuity,
  status,
  systemAuthority,
  earthBridge,
  conversionType,
  confidence,
  sourceAuditRequired,
  inputSupported: false,
  outputSupported: status === 'implemented',
  symbol,
  description,
})

export const FICTION_GROUP_ORDER = [
  'Star Trek',
  'Tolkien / Middle-earth',
  'The Elder Scrolls',
  'Warhammer 40,000',
  'Star Wars',
  'NINXA Impratoria',
  'Battlestar Galactica',
  'Warhammer Fantasy',
  'Warcraft',
  'Final Fantasy XIV',
  'The Witcher',
  'Dragon Age',
  'A Song of Ice and Fire / Game of Thrones',
  'EVE Online',
]

export const FICTION_SYSTEMS = [
  entry({ id: 'star-trek-tng', universe: 'Star Trek', name: 'TNG-era Stardate', family: 'Stardate', continuity: 'Prime Timeline', systemAuthority: 'source-derived', earthBridge: 'formula', conversionType: 'proleptic', confidence: 'high', symbol: '✦', description: 'Production-era stardate formula extended mathematically beyond its usual fictional period.' }),
  entry({ id: 'star-trek-kelvin', universe: 'Star Trek', name: 'Kelvin Timeline Stardate', family: 'Stardate', continuity: 'Kelvin Timeline', systemAuthority: 'source-defined-format', earthBridge: 'gregorian-ordinal', conversionType: 'proleptic', confidence: 'high', symbol: '⌖', description: 'Gregorian year followed by the ordinal day of the year.' }),

  entry({ id: 'tolkien-shire', universe: 'Tolkien / Middle-earth', name: 'Shire Reckoning', family: 'Hobbit Calendar', systemAuthority: 'tolkien-rules', earthBridge: 'modern-sync', conversionType: 'seasonal-analogue', confidence: 'medium', symbol: '○', description: 'Shire month and day using Tolkien’s structure with a modern seasonal synchronization.' }),
  entry({ id: 'tolkien-kings', universe: 'Tolkien / Middle-earth', name: 'Kings’ Reckoning', family: 'Númenórean', systemAuthority: 'tolkien-rules', earthBridge: 'modern-sync', conversionType: 'seasonal-analogue', confidence: 'medium', symbol: '△', description: 'Númenórean month and day without fabricating a Middle-earth year.' }),
  entry({ id: 'tolkien-stewards', universe: 'Tolkien / Middle-earth', name: 'Stewards’ Reckoning', family: 'Gondorian', systemAuthority: 'tolkien-rules', earthBridge: 'modern-sync', conversionType: 'seasonal-analogue', confidence: 'medium', symbol: '◇', description: 'Revised Gondorian month and day under a modern seasonal synchronization.' }),
  entry({ id: 'tolkien-new', universe: 'Tolkien / Middle-earth', name: 'New Reckoning', family: 'Reunited Kingdom', systemAuthority: 'tolkien-rules', earthBridge: 'modern-sync', conversionType: 'seasonal-analogue', confidence: 'medium', symbol: '✧', description: 'New Reckoning month and day, intentionally omitting an invented age-year.' }),
  entry({ id: 'tolkien-rivendell', universe: 'Tolkien / Middle-earth', name: 'Reckoning of Rivendell', family: 'Eldarin Calendar', systemAuthority: 'tolkien-rules', earthBridge: 'modern-sync', conversionType: 'seasonal-analogue', confidence: 'medium', symbol: '✦', description: 'Eldarin season and day synchronized to the modern seasonal year.' }),

  entry({ id: 'elder-scrolls-calendar', universe: 'The Elder Scrolls', name: 'Tamrielic Calendar', family: 'Tamrielic', systemAuthority: 'canonical-structure', earthBridge: 'modern-sync', conversionType: 'direct-month-day', confidence: 'high', symbol: '◇', description: 'Tamrielic weekday and month names synchronized directly to the selected date.' }),
  entry({ id: 'elder-scrolls-era', universe: 'The Elder Scrolls', name: 'Tamrielic Era', family: 'Fourth Era', systemAuthority: 'atlas-convention', earthBridge: 'atlas-sync', conversionType: 'proleptic', confidence: 'high', symbol: 'Ⅳ', description: 'Fourth Era year using the approved one-year-per-year Atlas synchronization.' }),

  entry({ id: 'warhammer-40k-imperial', universe: 'Warhammer 40,000', name: 'Imperial Dating System', family: 'Terra Standard', systemAuthority: 'source-based', earthBridge: 'terra-standard', conversionType: 'formula', confidence: 'high', symbol: '✣', description: 'Terra-standard check, year fraction, year and millennium notation.' }),

  entry({ id: 'star-wars-bby-aby', universe: 'Star Wars', name: 'BBY / ABY', family: 'Galactic Era', systemAuthority: 'canonical-era', earthBridge: 'atlas-sync', conversionType: 'proleptic', confidence: 'high', symbol: '✦', description: 'Battle of Yavin era using the approved 1977 CE Atlas synchronization.' }),
  entry({ id: 'star-wars-standard-day', universe: 'Star Wars', name: 'Galactic Standard Calendar', family: 'Galactic Standard', systemAuthority: 'canonical-structure', earthBridge: 'atlas-sync', conversionType: 'ordinal-day', confidence: 'high', symbol: '◎', description: 'Atlas-synchronized ABY/BBY year and standard ordinal day without invented month names.' }),

  entry({ id: 'ninxa-ahdm', universe: 'NINXA Impratoria', name: 'AHDM Chronology', family: 'NINXA Canon', systemAuthority: 'canonical', earthBridge: 'bahrain-hijri', conversionType: 'proleptic-no-zero', confidence: 'high', symbol: '⌬', description: 'Project-canon chronology derived from the Atlas Bahrain Hijri date, with no year zero.' }),
  entry({ id: 'bsg-caprican', universe: 'Battlestar Galactica', name: 'Caprican Calendar', family: 'Re-imagined Series', systemAuthority: 'canonical-structure', earthBridge: 'atlas-sync', conversionType: 'direct-month-day', confidence: 'high', symbol: '⋔', description: 'Caprican YR year with direct modern month/day synchronization.' }),

  entry({ id: 'whf-imperial', universe: 'Warhammer Fantasy', name: 'Imperial Calendar', family: 'Imperial', systemAuthority: 'atlas-convention', earthBridge: 'atlas-sync', conversionType: 'year-offset', confidence: 'medium', symbol: '✣', description: 'Imperial Calendar year under the approved Atlas synchronization.' }),
  entry({ id: 'whf-bretonnian', universe: 'Warhammer Fantasy', name: 'Bretonnian Calendar', family: 'Bretonnian', systemAuthority: 'atlas-convention', earthBridge: 'atlas-sync', conversionType: 'year-offset', confidence: 'medium', symbol: '⚔', description: 'Bretonnian year under the approved Atlas synchronization.' }),
  entry({ id: 'whf-gospodar', universe: 'Warhammer Fantasy', name: 'Gospodar Calendar', family: 'Kislevite', systemAuthority: 'atlas-convention', earthBridge: 'atlas-sync', conversionType: 'year-offset', confidence: 'medium', symbol: '❄', description: 'Gospodar year under the approved Atlas synchronization.' }),
  entry({ id: 'whf-dwarf', universe: 'Warhammer Fantasy', name: 'Dwarf Calendar', family: 'Dwarf', systemAuthority: 'atlas-convention', earthBridge: 'atlas-sync', conversionType: 'year-offset', confidence: 'medium', symbol: '◇', description: 'Dwarf year under the approved Atlas synchronization.' }),

  entry({ id: 'warcraft-adp', universe: 'Warcraft', name: 'Dark Portal Reckoning', family: 'ADP / BDP', systemAuthority: 'canonical-chronology', earthBridge: 'atlas-sync', conversionType: 'proleptic', confidence: 'high', symbol: '◈', description: 'Dark Portal era using the approved 2004 CE to 25 ADP synchronization.' }),
  entry({ id: 'warcraft-kings', universe: 'Warcraft', name: 'King’s Calendar', family: 'King’s Calendar', systemAuthority: 'source-defined', earthBridge: 'atlas-sync', conversionType: 'year-offset', confidence: 'high', symbol: '♜', description: 'King’s Calendar year derived from its relation to the Dark Portal era.' }),
  entry({ id: 'ffxiv-eorzean', universe: 'Final Fantasy XIV', name: 'Eorzean Calendar', family: 'Eorzean', systemAuthority: 'canonical-structure', earthBridge: 'modern-sync', conversionType: 'direct-month-day', confidence: 'high', symbol: '☼', description: 'Sun and Astral/Umbral Moon synchronized to modern month/day without a fictional year.' }),
  entry({ id: 'witcher-elven', universe: 'The Witcher', name: 'Elven Calendar', family: 'Elven Seasonal', systemAuthority: 'canonical-structure', earthBridge: 'reconstructed-sync', conversionType: 'seasonal-analogue', confidence: 'medium', symbol: '☽', description: 'Reconstructed modern seasonal synchronization showing festival-day and savaed position.' }),

  entry({ id: 'dragon-age-chantry', universe: 'Dragon Age', name: 'Chantry Calendar', family: 'Chantry', systemAuthority: 'canonical-structure', earthBridge: 'atlas-sync', conversionType: 'direct-month-day', confidence: 'high', symbol: '◇', description: 'Named Chantry month and Dragon Age year using the approved Atlas bridge.' }),
  entry({ id: 'dragon-age-tevinter', universe: 'Dragon Age', name: 'Tevinter Imperial Calendar', family: 'Tevinter', systemAuthority: 'canonical-structure', earthBridge: 'atlas-sync', conversionType: 'direct-month-day', confidence: 'high', symbol: '△', description: 'Named Tevinter month and TE year using the approved Atlas bridge.' }),
  entry({ id: 'dragon-age-elven', universe: 'Dragon Age', name: 'Elven Reckoning', family: 'Elven', systemAuthority: 'canonical-structure', earthBridge: 'atlas-sync', conversionType: 'year-offset', confidence: 'high', symbol: '✦', description: 'Elven FA year without fabricating an Elven month or day.' }),
  entry({ id: 'asoiaf-westerosi', universe: 'A Song of Ice and Fire / Game of Thrones', name: 'Westerosi Calendar', family: 'After Conquest', systemAuthority: 'canonical-structure', earthBridge: 'atlas-sync', conversionType: 'direct-month-day', confidence: 'high', symbol: '♛', description: 'Moon-style month wording and AC year using the approved Atlas bridge.' }),
  entry({ id: 'eve-yc', universe: 'EVE Online', name: 'YC Calendar', family: 'YC', systemAuthority: 'source-defined', earthBridge: 'earth-epoch', conversionType: 'proleptic', confidence: 'high', symbol: '⊙', description: 'YC year from the explicit YC0 Earth-year connection, allowing negative values.' }),
]

export const FICTION_GROUPS = FICTION_GROUP_ORDER.map((universe) => ({
  universe,
  systems: FICTION_SYSTEMS.filter((system) => system.universe === universe),
}))
