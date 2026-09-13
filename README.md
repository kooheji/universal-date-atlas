# Universal Chronology Atlas

**One date. Every system.**

Universal Chronology Atlas is an interactive date exploration tool that takes a single date and shows how it is represented across calendars, historical chronologies, astronomy, cultural traditions, and fictional universes.

A date is not just one Gregorian value. The same moment can be described by many different systems of measuring, organizing, interpreting, and remembering time. The Atlas brings those systems together while keeping their different purposes and levels of certainty visible.

## What it explores

### Calendars

The Atlas compares the same date across civil, religious, regional, historical, reconstructed, and traditional calendar systems. Its implemented calendar families include:

- Gregorian and Western solar
- Hijri / Islamic
- Iranian and Zoroastrian
- Hebrew
- East Asian
- Indian and South Asian
- Buddhist and Southeast Asian
- Indonesian
- Christian and liturgical
- Ancient Egyptian and North African
- Mesopotamian
- Ancient Greek and Roman
- Maya and Aztec
- Andean
- African traditional systems

The **Al Zubarah & Bahrain Hijri** result is a Bahrain-focused computational model. It determines lunar-month starts from astronomical conjunction and a published Makkah sunset criterion requiring the whole lunar disc, rather than only its centre, to be above the horizon.

> Calculated Hijri results are computational models. Official lunar observations may supersede calculated dates.

The model is not presented as an official religious calendar.

### Chronology

Dates can also be expressed through eras, continuous day counts, historical reckonings, and computing or navigation epochs. Implemented examples include:

- ISO Week Date and ISO Ordinal Date
- Julian Day and Modified Julian Day
- Rata Die and Lilian Day Number
- Unix Time and Unix Day Number
- GPS Week and GPS Day
- Ab Urbe Condita
- Byzantine Anno Mundi
- Seleucid Era and Olympiad Dating
- Amazigh Era and Holocene / Human Era
- Maya Long Count
- Alexandrian Era
- Indiction cycles
- Diocletian / Era of Martyrs
- Spanish Era

These results do not all describe time in the same way: some are continuous counts, some are era-year labels, and others are historical or proleptic reckonings.

### Sky

The Sky section uses astronomical calculations rather than astrological interpretation. The interface presents:

- Moon phase, illumination, age, phase angle, and Earth–Moon distance
- Lunar ecliptic longitude and latitude, declination, and astronomical constellation
- Solar ecliptic longitude and latitude, declination, Earth–Sun distance, and astronomical constellation
- Geocentric positions, distances, apparent magnitudes, and constellations for Mercury through Neptune
- Greenwich sidereal time and the Julian astronomical instant
- Solar longitude and seasonal progress through Earth's orbit
- Northern and Southern Hemisphere seasons
- March and September equinoxes, June and December solstices, and the nearest equinox and solstice

The astronomy engine also calculates the lunar illumination phase angle, Moon apparent magnitude, and previous or next new and full moons. The current Moon card intentionally prioritizes a smaller set of nine primary measurements.

Date-only sky calculations default to 12:00 UTC. When a time is supplied, it is treated as UTC. Coordinates are used for observer-dependent calculations such as planetary hours.

### Traditions

Traditions covers cultural, astrological, symbolic, folkloric, and historical interpretations of dates. The current implementation includes:

- Western tropical and Moon zodiac results
- Zodiac degree and planetary weekday ruler
- Sidereal and Vedic zodiac results, including rāśi
- Nakshatras and nakshatra padas
- Manāzil al-Qamar and associated historical star references
- Chinese zodiac, elements, Yin / Yang, and sexagenary cycles
- Four Pillars / BaZi, including an Hour Pillar when a time is supplied
- Tzolkʼin, Haabʼ, and Maya Calendar Round associations
- Tonalpohualli day number, day sign, and associated trecena
- Seasonal European and Wheel of the Year frameworks
- A clearly labelled modern/popular Celtic tree system
- Planetary weekday and planetary-hour traditions
- Numerological date calculations

These are cultural, symbolic, historical, or astrological frameworks. They should not be confused with the physical astronomical measurements in the Sky section. The interface labels reconstructed, approximate, and modern/popular interpretations rather than presenting them as equally historical.

### Fiction

The Atlas also explores fictional chronologies. The implemented registry currently covers:

- Star Trek
- Tolkien / Middle-earth
- The Elder Scrolls
- Warhammer 40,000
- Star Wars
- NINXA Impratoria
- Battlestar Galactica
- Warhammer Fantasy
- Warcraft
- Final Fantasy XIV
- The Witcher
- Dragon Age
- A Song of Ice and Fire / Game of Thrones
- EVE Online

Fiction results expose how each conversion was established:

- **Canonical systems** — rules or formats established by source material.
- **Source-derived systems** — calculations based on documented relationships or production rules.
- **Atlas synchronizations** — explicit project conventions used to bridge a fictional chronology to Gregorian dates.
- **Reconstructed systems** — approximate models built from incomplete source material.
- **Proleptic results** — mathematical extensions before or after the normal period in which a chronology is used.

The project intentionally shows these distinctions instead of implying that every fictional conversion has equal canonical authority.

## Date input

Primary dates can be entered in either of two modes:

- **CE** — Gregorian year, month, and day
- **AH** — Al Zubarah & Bahrain Hijri year, month, and day

Hour, minute, and location are optional. Time enables results such as the Four Pillars Hour Pillar, while time plus coordinates enables observer-dependent calculations such as the traditional planetary hour. The location field accepts coordinates and can request the browser's current location.

## Interface

The current interface includes:

- A responsive application shell for desktop and mobile use
- Dark and light themes
- English and Arabic localization
- Right-to-left layout support for Arabic
- CE and AH date selection
- Optional hour, minute, and location inputs
- Grouped result families with in-section navigation
- Custom symbolic SVG artwork
- Three.js-powered overview and Sky visuals
- Internally scrollable Atlas sections

## Accuracy and methodology

Not every system has the same evidential basis. A result may be calculated, library-derived, based on an astronomical model, historically reconstructed, source-derived, synchronized by an explicit project convention, approximate, or proleptic.

Where the available information does not support an objective conversion, the project should avoid silently inventing missing rules. Labels and explanatory text are used to distinguish standard conversions from models, reconstructions, reference alignments, and project-defined bridges.

The code also treats these as separate concerns:

- Calendar conversion
- Astronomical calculation
- Cultural interpretation
- Historical reconstruction
- Fictional chronology

That separation is deliberate: an astronomical coordinate, a religious calendar model, a folkloric association, and a fictional era conversion answer different questions and should not inherit one another's authority.

## Technology

Universal Chronology Atlas is a framework-free JavaScript application built with:

- [Vite](https://vite.dev/) for development and production builds
- [Three.js](https://threejs.org/) for animated 3D and line-art visuals
- [Astronomy Engine](https://github.com/cosinekitty/astronomy) for astronomical calculations
- [Temporal Polyfill](https://github.com/fullcalendar/temporal-polyfill) for calendar-aware date handling
- `balinese-date-js-lib` for Balinese calendar data
- `bikram-sambat` for Nepali Bikram Sambat conversion
- `date-bengali-revised` for Bengali calendar conversion

The frontend does not require React, Vue, or another component framework.

## Project structure

```text
.
├── public/                 # Shared browser assets and SVG symbols
├── src/
│   ├── assets/             # Calendar, chronology, tradition, and fiction artwork
│   ├── data/               # System and fiction registries
│   ├── engine/             # Calendar, astronomy, culture, chronology, and fiction calculations
│   ├── ui/                 # Symbol resolution and animated visual modules
│   ├── i18n.js             # English/Arabic localization
│   ├── main.js             # Rendering, inputs, navigation, and application coordination
│   ├── style.css           # Core visual system
│   ├── light-theme.css     # Light-theme overrides
│   ├── responsive.css      # Responsive layouts
│   └── rtl.css             # Arabic and RTL adjustments
├── index.html
└── package.json
```

Data registries describe systems and their metadata. Engine modules perform calculations and conversions. UI modules resolve symbolic artwork and animated visuals. `main.js` coordinates input, rendering, localization, and interaction.

## Development

```bash
git clone https://github.com/kooheji/universal-date-atlas.git
cd universal-date-atlas
npm install
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Tests

The repository currently provides two regression test commands:

```bash
npm run test:calendars
npm run test:fiction
```

## Project status

Universal Chronology Atlas is under active development. Additional systems may be added; historical source quality and reconstructed models may be refined; astronomy calculations may expand; and localization coverage may grow.

Inclusion of a system does not imply historical, religious, astronomical, or fictional-canon certainty beyond what its underlying sources support.

## Contributing

Contributions are welcome, particularly for:

- Corrections and stronger historical or source references
- Additional calendars and chronologies
- Conversion algorithms and astronomy improvements
- Accessibility and localization
- Regression tests and edge-case coverage

Contributions should distinguish documented or source-defined rules from calculated rules, reconstructed rules, and project-defined synchronizations. Strong sources should be included wherever possible.

## Credits

Created as a [kooheji.dev](https://kooheji.dev/) tool.

Universal Chronology Atlas is an independent project and is not affiliated with the owners of fictional franchises represented in the Fiction section.

Names, trademarks, logos, and other intellectual property belonging to third parties remain the property of their respective owners.
