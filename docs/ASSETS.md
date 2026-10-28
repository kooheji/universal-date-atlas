# Asset provenance and licensing readiness

This report inventories the visual files committed under `App/src/assets/` and `App/public/`. It is a release-readiness record, not legal advice or a grant of rights. The untracked `Resources/` directory and `universal-date-atlas-upload.zip` are outside this audit.

The machine-readable source of truth is [`App/src/data/asset-provenance.js`](../App/src/data/asset-provenance.js). Its structural test rejects missing files, duplicate paths, invalid controlled values, and unmanifested committed visual assets. Uncertain rights are recorded rather than converted into unsupported ownership claims.

## Asset provenance policy

The Atlas treats these questions separately:

- **File authorship** asks who created or committed this SVG/PNG/ICO file. Git history and Adobe Illustrator export metadata can support that limited fact.
- **Design authorship** asks where the actual emblem, composition, logo, or motif originated. Drawing a new vector file does not make a copied design original.
- **Historical and traditional motifs** may be ancient or culturally shared, but a specific modern rendering can still have separate rights or legal restrictions.
- **AI-assisted reference workflows** must be recorded without claiming exclusive rights in generated portions. No model is inferred when it is not documented.
- **Third-party marks and franchise branding** remain associated with their owners. Descriptive use does not establish permission, fair use, or a right to sublicense the artwork.
- **Generated derivatives** inherit the provenance of their master asset and are not counted as independently designed works.

The audit observed that most numbered SVGs carry Adobe Illustrator export metadata. That establishes the export tool, not the source of the design. Historical/traditional and generic classifications describe the observed relationship; files remain reviewable where editable-source records or reference histories are absent.

### Controlled origin values

| Value | Meaning |
| --- | --- |
| `project-original` | Project-specific artwork with no third-party relationship identified. |
| `project-original-historical-motif` | A project rendering based on historical, religious, or traditional iconography. |
| `project-original-generic-symbol` | A project-created technical or generic icon rather than a distinctive external mark. |
| `ai-assisted-reference` | Artwork whose recorded or strongly indicated workflow includes generated visual reference material. |
| `traced-redrawn` | A vector/redraw that closely follows a specific existing emblem or rendering. |
| `third-party` | A file or significant design component originating outside the project. |
| `franchise-related` | Artwork tied to a fictional franchise, faction, or protected visual identity. |
| `unknown` | Available evidence does not support a more specific classification. |

### Controlled creation-method values

`manual-vector`, `manual-drawing`, `ai-reference-then-redrawn`, `ai-generated-raster`, `trace-from-reference`, `programmatic`, `generated-favicon`, `third-party-file`, and `unknown`.

### Controlled rights-status values

| Value | Meaning |
| --- | --- |
| `project-owned` | Current evidence supports project ownership; preserve editable/source records. |
| `public-domain-motif` | A reasonable basis exists for the underlying motif being public domain. This value is not assigned merely because a motif is old. |
| `traditional-symbol-review` | The motif is traditional or historical, but the source rendering and any special emblem rules still need confirmation. |
| `third-party-permissive` | A third-party asset has a documented permissive license. |
| `third-party-restricted` | Known third-party terms restrict reuse. |
| `trademark-reference` | The asset includes or closely follows a third-party name, logo, or mark. |
| `review-required` | Material provenance or permission evidence is missing. |
| `unknown` | The current record cannot determine rights status. |

Fiction assets additionally use `low-risk`, `review`, or `likely-franchise-mark`. Those labels are triage classifications, not legal conclusions.

## Inventory summary

The manifest contains **146 committed visual assets**.

| Classification | Count |
| --- | ---: |
| Exact `project-original` | 1 |
| Project-original historical/traditional motif | 91 |
| Project-original generic symbol | 22 |
| AI-assisted reference | 1 |
| Traced/redrawn | 3 |
| Franchise-related | 26 |
| Third-party | 1 |
| Unknown origin | 1 |
| Rights status `review-required` | 13 |
| Likely franchise mark | 17 |
| Generated favicon derivatives | 6 |

These origin categories are mutually exclusive in the manifest. Review queues can overlap origin categories; for example, a franchise-related asset can also carry `trademark-reference`.

## Asset catalogue

### Project branding and public/site assets

| Asset | Subject | Classification |
| --- | --- | --- |
| `App/public/favicon.svg` | Favicon master | Project-original generic globe/orbit motif; project-owned. |
| `App/public/favicon-16x16.png` | 16×16 favicon | Generated derivative of `favicon.svg`. |
| `App/public/favicon-32x32.png` | 32×32 favicon | Generated derivative of `favicon.svg`. |
| `App/public/favicon.ico` | ICO bundle | Generated derivative of `favicon.svg`. |
| `App/public/apple-touch-icon.png` | Apple touch icon | Generated derivative of `favicon.svg`. |
| `App/public/android-chrome-192x192.png` | Android icon | Generated derivative of `favicon.svg`. |
| `App/public/android-chrome-512x512.png` | Android icon | Generated derivative of `favicon.svg`. |
| `App/public/og-image.png` | Social preview | AI-assisted/generative workflow strongly indicated; model and source history unrecorded; review required. |
| `App/public/icons.svg` | Shared icon sprite | Mixed file containing Bluesky, Discord, GitHub, and X marks plus generic icons; third-party mark review required. |

The `icons.svg` manifest record lists each internal symbol because a file-level `third-party` classification alone would hide the mixed contents.

### Code-defined and referenced visuals

`App/src/ui/symbols.js` is the mapping source for all numbered calendar, chronology, tradition, and fiction SVGs. It also contains two inline code-defined SVG drawings (`MENORAH` and `ROMAN_EAGLE`) plus Unicode/text glyphs. Those inline drawings are not counted as separate visual files in the 146-file manifest; their historical/traditional motifs should receive the same source-record review as the corresponding standalone symbols.

The reference audit found:

- `App/index.html` references the favicon family and `og-image.png`.
- `App/public/site.webmanifest` references the two Android icon derivatives.
- `App/src/main.js` currently uses the GitHub symbol from `public/icons.svg`; the remaining sprite symbols are still committed and therefore inventoried.
- No committed CSS file contains an additional raster/SVG asset reference outside this inventory.

### Calendar symbols

`App/src/assets/calendar-symbols/calendars-01.svg` through `calendars-47.svg` map in order to the calendar list in `App/src/ui/symbols.js`. All 47 are individually recorded in the manifest.

- 43 are project vector renderings of historical, religious, or cultural motifs and retain `traditional-symbol-review`.
- `calendars-03.svg` is a generic International Fixed Calendar icon.
- `calendars-13.svg`, `calendars-14.svg`, and `calendars-15.svg` closely follow the Imperial chrysanthemum, ROC White Sun, and Ashoka Chakra respectively. They are classified `traced-redrawn` and `review-required` rather than presumed project-owned.

### Chronology symbols

`App/src/assets/chronology-symbols/chronology-01.svg` through `chronology-22.svg` are individually inventoried.

- 11 represent generic technical/day-count concepts.
- 10 use historical motifs for Roman, Byzantine, Seleucid, Olympiad, Amazigh, Maya, Alexandrian, Indiction, Martyrs, or Spanish-era subjects.
- `chronology-22.svg` is committed but not selected by the current mapping in `App/src/ui/symbols.js`; its subject and creation history remain `unknown`.

### Tradition symbols

`App/src/assets/tradition-symbols/tradition-01.svg` through `tradition-41.svg` correspond to the ordered tradition list in `App/src/ui/symbols.js`.

- 38 render cultural, astronomical, astrological, numerological, or traditional motifs and retain `traditional-symbol-review`.
- The final three are generic project icons for Digital Root, Date Number, and Life-Path-Style Calculation.

This inventory does not imply scientific validation of any interpretation represented by a symbol.

### Fiction symbols

The 26 numbered fiction SVGs are all `franchise-related`; this does not mean all are official logos. `ninxa.svg` is separately classified as project-original NINXA project-canon artwork.

| Files | Review classification | Meaning |
| --- | --- | --- |
| `fiction-01`, `02`, `05`, `06`, `09`–`14`, `16`, `19`–`24` | `likely-franchise-mark` | Appears to reproduce or closely redraw recognizable franchise/faction branding. |
| `fiction-03`, `04`, `07`, `08`, `15`, `17`, `18`, `25`, `26` | `review` | Franchise-related, but the evidence does not establish whether it is official branding, inspired artwork, or an original chronology-specific design. |
| `ninxa.svg` | `low-risk` | Project-canon artwork; preserve ownership/source records. |

## Review queue

### Likely franchise marks

The following assets should be replaced, excluded from an artwork license, or reviewed for permission before open-source artwork distribution:

| Asset | Subject |
| --- | --- |
| `src/assets/fiction-symbols/fiction-01.svg` | Star Trek — TNG-era Stardate |
| `src/assets/fiction-symbols/fiction-02.svg` | Star Trek — Kelvin Timeline Stardate |
| `src/assets/fiction-symbols/fiction-05.svg` | Tolkien — Stewards’ Reckoning |
| `src/assets/fiction-symbols/fiction-06.svg` | Tolkien — New Reckoning |
| `src/assets/fiction-symbols/fiction-09.svg` | The Elder Scrolls — Tamrielic Era |
| `src/assets/fiction-symbols/fiction-10.svg` | Warhammer 40,000 — Imperial Dating System |
| `src/assets/fiction-symbols/fiction-11.svg` | Star Wars — BBY / ABY |
| `src/assets/fiction-symbols/fiction-12.svg` | Star Wars — Galactic Standard Calendar |
| `src/assets/fiction-symbols/fiction-13.svg` | Battlestar Galactica — Caprican Calendar |
| `src/assets/fiction-symbols/fiction-14.svg` | Warhammer Fantasy — Imperial Calendar |
| `src/assets/fiction-symbols/fiction-16.svg` | Warhammer Fantasy — Gospodar Calendar |
| `src/assets/fiction-symbols/fiction-19.svg` | Warcraft — King’s Calendar |
| `src/assets/fiction-symbols/fiction-20.svg` | Final Fantasy XIV — Eorzean Calendar |
| `src/assets/fiction-symbols/fiction-21.svg` | The Witcher — Elven Calendar |
| `src/assets/fiction-symbols/fiction-22.svg` | Dragon Age — Chantry Calendar |
| `src/assets/fiction-symbols/fiction-23.svg` | Dragon Age — Tevinter Imperial Calendar |
| `src/assets/fiction-symbols/fiction-24.svg` | Dragon Age — Elven Reckoning |

### Rights status `review-required`

- `src/assets/calendar-symbols/calendars-13.svg`
- `src/assets/calendar-symbols/calendars-14.svg`
- `src/assets/calendar-symbols/calendars-15.svg`
- `src/assets/fiction-symbols/fiction-03.svg`
- `src/assets/fiction-symbols/fiction-04.svg`
- `src/assets/fiction-symbols/fiction-07.svg`
- `src/assets/fiction-symbols/fiction-08.svg`
- `src/assets/fiction-symbols/fiction-15.svg`
- `src/assets/fiction-symbols/fiction-17.svg`
- `src/assets/fiction-symbols/fiction-18.svg`
- `src/assets/fiction-symbols/fiction-25.svg`
- `src/assets/fiction-symbols/fiction-26.svg`
- `public/og-image.png`

Additionally, `src/assets/chronology-symbols/chronology-22.svg` has `unknown` origin and rights status, and `public/icons.svg` requires third-party mark/source review.

## Generated derivative relationships

`public/favicon.svg` is the master design for:

- `public/favicon-16x16.png`
- `public/favicon-32x32.png`
- `public/favicon.ico`
- `public/apple-touch-icon.png`
- `public/android-chrome-192x192.png`
- `public/android-chrome-512x512.png`

The derivative relationship is tested so a generated file is not presented as independently authored artwork.

## Open-source readiness conclusion

The inventory is structurally complete, but it does not support placing every visual asset under a future permissive code license. The clearest current path is to license original source code separately from artwork, keep third-party names and marks outside that grant, and replace or expressly exclude likely franchise marks before a broad open-source release. Traditional-symbol renderings, emblem redraws, the social preview, the mixed social-icon sprite, and the unmapped chronology asset still need source-record or rights review.
