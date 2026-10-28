# Methodology and sources

Universal Chronology Atlas places deterministic standards, civil calendars, astronomical models, historical reconstructions, cultural interpretations, and fictional conventions in one interface. Their presence beside one another does not give them equal authority.

This document explains how the Atlas records provenance and identifies the source-review work that remains. It describes the implementation as reviewed on **2026-10-28**; it is not a claim that every calendar or tradition has one universally accepted interpretation.

The machine-readable catalogue is maintained in `App/src/data/provenance-registry.js`. Conversion formulas remain in the engine modules and are not duplicated in the provenance data.

## Provenance model

Each recorded system can provide:

- `authority`: what kind of evidence or convention defines the system;
- `method`: how the Atlas produces the displayed result;
- `evidenceLevel`: how complete the recorded support is;
- `sources`: publications, standards, official documents, or software actually relevant to the implementation;
- `assumptions`: choices the implementation makes where the source does not uniquely determine an output;
- `notes`: a concise description of scope or an unresolved gap;
- `lastReviewed`: the most recent provenance review date.

Authority and method are deliberately separate. A historically attested calendar can be implemented through a modern reconstruction. A fictional chronology can be canonical while its Gregorian bridge is an Atlas convention. An astronomical longitude can come from a tested ephemeris library while a zodiac interpretation of that longitude remains astrological.

### Authority classifications

| Classification | Meaning |
| --- | --- |
| `standard` | Defined by an international, technical, or widely adopted computational standard. |
| `computational-convention` | A defined computational day-count or technical convention that is documented and reproducible but is not itself an international or civil standard. |
| `official-civil` | Used or defined by a civil authority. This does not imply religious authority. |
| `religious-traditional` | Belongs to a religious calendrical or interpretive tradition. |
| `astronomical` | Describes physical astronomical quantities or an explicit astronomical model. |
| `historical-source` | Structure or rules are supported by historical or scholarly sources. |
| `historical-reconstruction` | The Atlas selects a computational reconstruction where historical practice was variable or incomplete. |
| `cultural-traditional` | A cultural cycle or association not presented as empirical science. |
| `astrological-traditional` | A symbolic astrological interpretation of astronomical or calendrical inputs. |
| `modern-popular` | A modern or popular convention, including later systems presented as ancient in popular culture. |
| `fiction-canonical` | The fictional chronology or terminology is established by its source material. |
| `source-derived-fiction` | The result follows a documented source relationship or production rule. |
| `atlas-convention` | The Atlas supplies a stated bridge, epoch, or alignment. |
| `project-canon` | Canon defined by a project represented in the Atlas, rather than by an external franchise. |

### Method classifications

| Classification | Meaning |
| --- | --- |
| `library` | A named dependency performs the core conversion or calculation. |
| `algorithm` | The Atlas implements a deterministic calculation directly. |
| `astronomical-model` | The result depends on calculated celestial positions or events. |
| `correlation` | A stated epoch or correlation connects two systems. |
| `historical-reconstruction` | The implementation models incomplete or variable historical practice. |
| `direct-conversion` | A defined conversion maps one supported system to another. |
| `reference-alignment` | A named cycle or seasonal list is aligned to a modern reference date. |
| `atlas-sync` | A project-defined synchronization supplies a bridge not established by the underlying source. |
| `proleptic-extension` | Rules are extended outside their ordinary historical or fictional period. |
| `approximation` | The result is an intentionally simplified or approximate representation. |

### Evidence levels

| Level | Meaning |
| --- | --- |
| `high` | The recorded source directly supports the central rule or dependency used by the implementation. |
| `medium` | The method is established, but a primary civil, historical, or implementation source is still desirable. |
| `low` | Some support exists, but important assumptions or the selected convention remain weakly documented. |
| `under-review` | The implementation is inventoried, but a key citation or authority check is still missing. |

`evidenceLevel` measures how well the recorded provenance supports the Atlas implementation and its stated method. It does **not** mean that a cultural belief, astrological interpretation, historical reconstruction, or fictional synchronization has been scientifically proven or made historically certain.

An entry can contain sources and still be `under-review`. For example, Astronomy Engine can provide `high` implementation evidence for a calculated astronomical value, while a cultural interpretation using that value can remain `under-review`. Likewise, Astronomy Engine supports calculated lunar positions in a reconstruction, but it does not by itself establish that the reconstruction matches ancient administrative practice.

## Source policy

Source objects use a controlled `type` value:

| Source type | Intended use |
| --- | --- |
| `standard` | Published international or technical standard. |
| `specification` | Formal technical specification or interface definition. |
| `government` | Government, civil authority, or official public body. |
| `institutional` | Museum, observatory, research institution, or similarly accountable organization. |
| `academic` | Scholarly book, paper, critical edition, or academic research resource. |
| `software` | The maintained software library or implementation used by the Atlas. |
| `primary-historical` | Primary historical text, inscription, table, or archival record. |
| `official-franchise` | Official fictional source material or material published by the rights holder. |
| `licensed-reference` | Licensed reference work documenting fictional or other protected source material. |
| `specialist` | Reputable specialist reference used when stronger primary or institutional material is unavailable. |
| `community` | Community-maintained reference used only when stronger material is unavailable and the limitation is explicit. |

The project prefers sources in this order:

1. official standards and technical specifications;
2. government or civil-calendar documentation;
3. primary historical materials;
4. academic publications and critical reference works;
5. official franchise or licensed fictional reference material;
6. reputable specialist references;
7. community references only when stronger material is unavailable and the limitation is explicit.

Missing citations are recorded as missing. A plausible-looking bibliography is not a substitute for a source that supports the implemented rule.

## Reconstruction and approximation policy

- A reconstruction must be labelled as a reconstruction and list its implementation assumptions.
- A reference alignment must identify its modern anchor or epoch.
- If historical month declarations, intercalations, or local decisions varied, a deterministic modern model must not be described as the unique historical calendar.
- Approximate cultural associations must not be presented as physical astronomy.
- Numerology is a symbolic modern practice, not empirical science.
- Official lunar observations or religious decisions can supersede calculated Hijri models.

## Atlas synchronization policy

An Atlas synchronization is an explicit project convention used when two systems do not provide an objective bridge. It must be separately identifiable from the authority of the system being displayed. Synchronizations should be stable, documented, tested, and never described as historical fact or fictional canon.

## Fiction policy

The fiction registry remains the source of truth for `systemAuthority`, `earthBridge`, `conversionType`, and `confidence`. The central provenance registry derives its fiction entries from those fields rather than copying a second catalogue.

For every fiction result, two questions remain separate:

1. Is the chronology or format canonical, source-derived, reconstructed, or project-defined?
2. Is its Earth/Gregorian bridge source-defined, reconstructed, or an Atlas synchronization?

For example, the BBY/ABY era can be classified as a canonical fictional era while the Atlas choice to synchronize its zero point to a Gregorian year remains an Atlas convention. The synchronization is not presented as franchise canon.

## Source catalogue

### Calendars

#### Temporal and internationalization conversions

Gregorian, Umm al-Qura, Islamic Civil, Persian, Hebrew, Chinese, Japanese, Minguo/ROC, Indian National, Coptic, and Ethiopic results are converted through the Temporal polyfill, with `Intl.DateTimeFormat` as a compatibility fallback.

Core implementation references:

- [Temporal specification](https://tc39.es/proposal-temporal/) — date objects, calendar association, conversion, and calendar-aware fields.
- [Temporal Polyfill](https://github.com/fullcalendar/temporal-polyfill) — the package used by the Atlas.
- [Unicode Technical Standard #35, Part 4: Dates](https://unicode.org/reports/tr35/tr35-dates.html) — calendar identifiers, eras, cyclic names, and locale date data.
- [Calendrical Calculations: book, papers, and code](https://reingold.co/calendars.shtml) — algorithmic reference covering many implemented calendar families.
- [ISO 8601 date and time format](https://www.iso.org/iso-8601-date-and-time-format.html) — Gregorian information-interchange basis.
- [Rashtriya Panchanga explanation](https://packolkata.imd.gov.in/panchang/en/explanation) — Government of India National Calendar context.
- [Reiwa Cabinet Order](https://laws.e-gov.go.jp/law/431CO0000000143) — official source for the current Japanese era.

The external runtime data remains an implementation dependency. A browser or dependency update can affect localized names and, for some calendars, supported ranges. The Atlas does not treat a runtime-produced Umm al-Qura result as an official crescent observation.

#### Al Zubarah & Bahrain Hijri

The implementation is a Bahrain-focused computational model, not the official announcement of a religious authority.

The code currently does the following:

- uses Makkah coordinates **21.4225° N, 39.8262° E**, with a modelled elevation of **300 m**;
- takes a tabular Hijri month start as a search seed, then uses Astronomy Engine to find lunar conjunction;
- considers the sunset on the conjunction date and the following date;
- rejects a sunset if conjunction has not yet occurred;
- calculates the Moon's topocentric altitude at Makkah sunset with normal atmospheric refraction;
- requires the Moon centre to be more than **0.26°** above the horizon, representing the code's whole-disc-above-horizon threshold;
- returns the following civil date as day 1;
- supports AH input years **1–9999** and CE-to-AH conversion for CE years **1–10323**.

Recorded sources:

- [The Islamic Calendar: A Guidance Booklet](https://www.islam.gov.bh/wp-content/uploads/2020/06/Hijjri-Booklet-1441.pdf), Kingdom of Bahrain — official calendar context.
- [Astronomy Engine](https://github.com/cosinekitty/astronomy) — conjunction, sunset, equatorial position, and horizon calculations.

The primary publication establishing the exact `0.26°` Makkah criterion has not yet been recorded. That gap is explicit, so this entry remains `under-review`. The formula was not changed during the provenance phase.

#### Direct external-library conversions

| System | Dependency | Current evidence |
| --- | --- | --- |
| Bengali revised calendar | [`date-bengali-revised`](https://github.com/commenthol/date-bengali-revised) | Medium; exact government revision source still needed. |
| Nepali Bikram Sambat | [`bikram-sambat`](https://github.com/medic/bikram-sambat) | Medium; primary civil tables still needed. |
| Balinese Pawukon | [`balinese-date-js-lib`](https://github.com/peradnya/balinese-date-js-lib) | Medium; library supplies sapta wara, panca wara, and wuku. |

#### Historical reconstructions

| System | Atlas method | Review status |
| --- | --- | --- |
| Ancient Egyptian civil | Fixed 365-day count from Julian-day epoch `1448637.5`. | Exact epoch/naming citation required. |
| Babylonian | First calculated new moon after the March equinox; simplified month sequence. | Historical intercalation and declaration sources required. |
| Attic/Athenian | First calculated new moon after the June solstice. | Historical local declarations and intercalations are not reproduced; academic source required. |
| Roman Republican | Proleptic Julian date with Roman month names and an AUC offset. | Explicit reconstruction; not an exact Republican conversion. |
| Inca seasonal reference | Direct Gregorian-month alignment to a twelve-name seasonal list. | Explicit approximation; academic source and regional-variation review required. |

These entries intentionally use `historical-reconstruction`, `reference-alignment`, or `approximation` rather than civil-calendar authority.

### Chronology

| System | Basis | Principal source |
| --- | --- | --- |
| Julian Calendar | Proleptic Julian conversion. | [U.S. Naval Observatory Julian Date notes](https://aa.usno.navy.mil/data/JulianDate) and [Calendrical Calculations](https://reingold.co/calendars.shtml). |
| ISO Week Date | Monday-based ISO week-numbering year/week/day. | [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html). |
| ISO Ordinal Date | Gregorian year plus ordinal day. | [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html). |
| Julian Date | Continuous astronomical day count. | [U.S. Naval Observatory](https://aa.usno.navy.mil/data/JulianDate). |
| Modified Julian Date | `JD − 2400000.5`. | [U.S. Naval Observatory](https://aa.usno.navy.mil/data/JulianDate). |
| Rata Die | Computational day-count convention; RD 1 = 1 January 1 Gregorian. | [Calendrical Calculations](https://reingold.co/calendars.shtml). |
| Lilian Day | Computational day-count convention; day 1 = 15 October 1582 Gregorian. | [IBM CEE date API notes](https://www.ibm.com/support/pages/ile-cl-usage-cee-apis-ceedays-ceedate-ceedywk). |
| Unix Time | Seconds since the POSIX epoch at 00:00 UTC. | [The Open Group: The Epoch](https://pubs.opengroup.org/onlinepubs/9799919799/basedefs/V1_chap04.html#tag_04_19). |
| Unix Day Number | Atlas display derived by dividing the midnight Unix timestamp by 86,400. | Same epoch source; day-number display is an Atlas convention. |
| GPS Week / GPS Day | Continuous full week count from 6 January 1980; Sunday is day 0. | [IS-GPS-200N](https://archive.gps.gov/technical/icwg/IS-GPS-200N.pdf). |
| Maya Long Count | GMT correlation `584283` and mixed-radix Maya units. | [Smithsonian Living Maya Time](https://maya.nmai.si.edu/calendar/calendar-system) and [Calendrical Calculations](https://reingold.co/calendars.shtml). |

Other implemented eras and reform calendars—International Fixed, Discordian, French Republican, Holocene/Human Era, AUC, Byzantine Anno Mundi, Seleucid, Olympiad, Amazigh, Alexandrian, Indiction, Era of Martyrs, and Spanish Era—remain in the research queue until their exact implemented conventions have direct citations.

### Sky

All currently registered Sky systems use [Astronomy Engine](https://github.com/cosinekitty/astronomy). The library documents models based on VSOP87 and NOVAS and verification against established ephemeris sources.

The registered coverage includes:

- lunar phase, illumination, age, phase angle, illumination angle, apparent magnitude, distance, ecliptic longitude/latitude, declination, constellation, and adjacent new/full moons;
- solar ecliptic longitude/latitude, declination, distance, and constellation;
- geocentric positions, distances, apparent magnitudes, and constellations for Mercury through Neptune;
- Greenwich sidereal time and the Julian astronomical instant;
- solar longitude, orbital-season progress, hemisphere seasons, equinoxes, solstices, and nearest seasonal events.

Date-only calculations use **12:00 UTC**. Optional time is UTC. The Atlas derives labels such as phase names and hemisphere season names from calculated angles and event times; those labels are display algorithms layered on the library results.

### Traditions

Traditions require particular care because an astronomical input does not make its cultural interpretation empirical science.

#### Recorded in the provenance registry

- **Western tropical zodiac** — twelve equal 30° tropical signs; astrological, citation still required.
- **Moon zodiac** — Astronomy Engine lunar longitude divided into twelve equal tropical signs; astronomical input, astrological interpretation.
- **Planetary weekday ruler** — fixed weekday-to-classical-planet lookup; historical source still required.
- **Chinese zodiac, element, Yin/Yang, and sexagenary year** — runtime Chinese cyclical year plus Atlas lookup tables; methodology recorded, primary cultural source still required.
- **Maya Tzolkʼin, Haabʼ, and Calendar Round** — supported by [Smithsonian Living Maya Time](https://maya.nmai.si.edu/calendar/calendar-system), using the same GMT-correlated day count as the calendar outputs.

#### Implemented cultural results still awaiting first-class provenance IDs

The audit also found working results in `cultural-engine.js` that the master system registry still describes incompletely or as planned. They are documented here rather than silently promoted to sourced status:

- **Sidereal/Vedic signs** use a linear Lahiri-style ayanāṃśa approximation: `23.85675°` at year 2000 plus `0.013968°` per year.
- **Nakshatras and padas** divide sidereal lunar longitude into 27 equal mansions, each divided into four padas.
- **Manāzil al-Qamar** divides tropical lunar longitude into 28 equal sectors and associates each with a historical mansion name and star reference.
- **Chinese sexagenary month/day and Four Pillars** use a runtime Chinese year name, a solar-longitude month rule, a fixed Julian-day correlation, and two-hour branch periods.
- **Tonalpohualli** uses a stated Caso–Nicholson anchor: 23 August 1521 Gregorian = 1 Coatl. A direct academic citation for the selected correlation is still required.
- **Wheel of the Year** uses fixed civil-date boundaries, not calculated equinox/solstice instants, and is therefore a modern popular approximation.
- **Celtic Tree Calendar / Tree Zodiac** uses fixed modern date ranges and remains explicitly `modern-popular`; it is not presented as an ancient Celtic calendar.
- **Planetary hours** divide the calculated daytime or nighttime interval into twelve parts and cycle through the Chaldean order.
- **Numerology** sums Gregorian date digits, including the popular master numbers 11, 22, and 33. It is a symbolic modern practice and is not astronomy or empirical science.

These results remain research priorities. Their formulas were not changed during this phase.

### Fiction

The approved fiction catalogue currently contains **27 systems** across Star Trek, Tolkien/Middle-earth, The Elder Scrolls, Warhammer 40,000, Star Wars, NINXA Impratoria, Battlestar Galactica, Warhammer Fantasy, Warcraft, Final Fantasy XIV, The Witcher, Dragon Age, A Song of Ice and Fire/Game of Thrones, and EVE Online.

The provenance layer derives classification from the existing fiction registry:

- `systemAuthority` becomes the fictional-system authority;
- `earthBridge` becomes a separately recorded bridge authority and method;
- `conversionType` determines direct, proleptic, approximate, or synchronized methodology;
- `confidence` remains in the fiction registry and is not replaced.

No franchise bibliography has been invented. All fiction entries currently have empty central `sources` arrays and `under-review` evidence until official publication or licensed-reference citations are recorded. NINXA is marked as project canon; an Atlas synchronization used by another universe is never presented as canonical to that franchise.

## Current audit report

The automated report currently records:

| Measure | Count |
| --- | ---: |
| Implemented systems | 144 |
| Implemented systems with at least one documented source | 79 |
| Implemented systems with methodology metadata but no source | 32 |
| Implemented systems requiring research | 73 |
| Explicit historical reconstructions | 5 |
| Atlas-synchronized systems | 23 |
| Systems backed by external libraries | 57 |

The counts come from registry metadata, not marketing estimates. A system can appear in more than one row—for example, an under-review reconstruction can still use Astronomy Engine and therefore have a software source.

Thirty-three implemented catalogue entries still lack a provenance entry. The principal groups are:

- Dangi, Buddhist Era, and Ethiopic Amete Alem runtime calendars;
- Zoroastrian, Tamil, Malayalam, Vikram Samvat, Jain, Nanakshahi, Thai lunar, Burmese, Khmer, Javanese, Armenian, Baháʼí, Berber, Assyrian, Aztec, and Igbo implementations;
- reform calendars and historical eras not included in the first high-value pass.

This backlog is intentional. Missing provenance is preferable to fabricated certainty.
