# Asset provenance and licensing readiness

This report inventories the visual files committed under `App/src/assets/` and `App/public/`. It is a release-readiness record, not legal advice or a grant of rights. The untracked `Resources/` directory and `universal-date-atlas-upload.zip` are outside this audit.

The machine-readable source of truth is [`App/src/data/asset-provenance.js`](../App/src/data/asset-provenance.js). Its structural test rejects missing files, duplicate paths, invalid controlled values, and unmanifested committed visual assets. Uncertain rights are recorded rather than converted into unsupported ownership claims.

## Asset provenance policy

The Atlas treats these questions separately:

- **File authorship** asks who created or committed this SVG/PNG/ICO file. Git history and Adobe Illustrator export metadata can support that limited fact.
- **Design origin** asks where the actual emblem, composition, logo, or motif originated. Drawing a new vector file does not make an underlying national emblem or franchise mark project-original.
- **Creation method** records how the final file was made. The owner reports that the numbered SVGs were generally drawn manually in Adobe Illustrator.
- **Reference influence** records material consulted during ideation. AI-generated visual reference or inspiration is not the same as AI-generated final artwork, and it is not evidence that the vector was traced.
- **Provenance basis** states why a claim is present: owner report, repository evidence, source-file evidence, third-party documentation, or an explicit unknown.
- **Historical and traditional motifs** may be ancient or culturally shared, but a specific modern rendering can still have separate rights or legal restrictions.
- **Third-party marks and franchise branding** remain associated with their owners. Descriptive use does not establish permission, fair use, or a right to sublicense the artwork.
- **Generated derivatives** inherit the provenance of their master asset and are not counted as independently designed works.

The owner reports that AI-generated renders were used as visual references, inspiration, and ideation material while the numbered Calendar, Chronology, Tradition, and Fiction SVGs were created manually in Adobe Illustrator. The SVG source files also contain Illustrator export metadata. Accordingly, those records use `creationMethod: manual-vector` and separately include `ai-generated-reference`; they are not classified as AI-generated artwork or as traces merely because generated references were consulted.

### Controlled design-origin values

| Value | Meaning |
| --- | --- |
| `project-original` | Project-specific design with no third-party design relationship identified. |
| `historical-traditional-motif` | A design based on historical, religious, or traditional iconography. |
| `generic-symbol` | Technical or generic iconography rather than a distinctive external mark. |
| `national-civil-emblem` | A design relationship to a national, imperial, governmental, or civil emblem. |
| `franchise-related` | Artwork tied to a fictional franchise, faction, or protected visual identity. |
| `third-party` | A file or significant design component originating outside the project. |
| `unknown` | Available evidence does not support a more specific classification. |

### Controlled creation-method values

`manual-vector`, `manual-drawing`, `trace-from-reference`, `programmatic`, `generated-favicon`, `ai-generated-raster`, `third-party-file`, and `unknown`.

`ai-generated-raster` remains available for the social-preview image; it is not applied to the SVG artwork.

### Controlled reference-influence values

An asset can have multiple influences: `ai-generated-reference`, `historical-reference`, `cultural-reference`, `religious-reference`, `national-emblem-reference`, `franchise-reference`, `technical-reference`, and `none-recorded`.

### Controlled provenance-basis values

An asset can have more than one basis: `owner-reported`, `repository-evidence`, `source-file-evidence`, `third-party-documentation`, and `unknown`.

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

The manifest contains **148 artwork records**: 146 committed visual files and two inline SVG drawings in `src/ui/symbols.js`.

### Design origins

| Design origin | Count |
| --- | ---: |
| Historical/traditional motif | 93 |
| Generic symbol | 15 |
| National/civil emblem | 3 |
| Franchise-related | 26 |
| Project-original | 8 |
| Third-party | 1 |
| Unknown | 2 |

### Creation methods

| Creation method | Count |
| --- | ---: |
| Manual vector | 139 |
| Generated favicon | 6 |
| Programmatic | 1 |
| AI-generated raster | 1 |
| Third-party file | 1 |

### Reference influences

Reference-influence counts overlap because a record may have more than one influence.

| Reference influence | Records |
| --- | ---: |
| Developed with AI-generated visual references | 136 |
| Cultural reference | 83 |
| Historical reference | 55 |
| Franchise reference | 26 |
| Technical reference | 15 |
| National-emblem reference | 3 |
| Religious reference | 1 |
| None recorded | 10 |

### Provenance basis

| Basis | Records |
| --- | ---: |
| Owner-reported | 137 |
| Source-file evidence | 140 |
| Repository evidence | 8 |

### Rights and risk

| Classification | Count |
| --- | ---: |
| `traditional-symbol-review` | 93 |
| `project-owned` | 23 |
| `trademark-reference` | 18 |
| `review-required` | 13 |
| Unknown rights status | 1 |
| `likely-franchise-mark` | 17 |
| Risk classification `review` | 55 |
| Risk classification `low-risk` | 76 |

Design-origin and creation-method categories are mutually exclusive. Reference influences and provenance bases can overlap. Consulting an AI-generated reference affects neither the `manual-vector` creation method nor the owner's authorship of the final SVG.

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

`App/src/ui/symbols.js` is the mapping source for all numbered calendar, chronology, tradition, and fiction SVGs. It also contains two inline code-defined SVG drawings (`MENORAH` and `ROMAN_EAGLE`) plus Unicode/text glyphs. The two drawings now have distinct machine-readable records (`src/ui/symbols.js#MENORAH` and `src/ui/symbols.js#ROMAN_EAGLE`). They count as artwork records but not as additional visual files, and both retain historical/traditional review status.

The reference audit found:

- `App/index.html` references the favicon family and `og-image.png`.
- `App/public/site.webmanifest` references the two Android icon derivatives.
- `App/src/main.js` currently uses the GitHub symbol from `public/icons.svg`; the remaining sprite symbols are still committed and therefore inventoried.
- No committed CSS file contains an additional raster/SVG asset reference outside this inventory.

### Calendar symbols

`App/src/assets/calendar-symbols/calendars-01.svg` through `calendars-47.svg` map in order to the calendar list in `App/src/ui/symbols.js`. All 47 are individually recorded in the manifest.

- 43 are manually created vector renderings related to historical, religious, or cultural motifs and retain `traditional-symbol-review`.
- `calendars-03.svg` is a generic International Fixed Calendar icon.
- `calendars-13.svg`, `calendars-14.svg`, and `calendars-15.svg` relate to the Imperial chrysanthemum, ROC White Sun, and Ashoka Chakra respectively. Their final SVGs are owner-reported `manual-vector` work, while their design origin is `national-civil-emblem`, their influences include `national-emblem-reference`, and their rights status remains `review-required`.

### Chronology symbols

`App/src/assets/chronology-symbols/chronology-01.svg` through `chronology-22.svg` are individually inventoried.

- 11 represent generic technical/day-count concepts.
- 10 use historical motifs for Roman, Byzantine, Seleucid, Olympiad, Amazigh, Maya, Alexandrian, Indiction, Martyrs, or Spanish-era subjects.
- `chronology-22.svg` is committed but not selected by the current mapping in `App/src/ui/symbols.js`. Its manual-vector creation is owner-reported, while its intended subject/design origin remains `unknown`.

### Tradition symbols

`App/src/assets/tradition-symbols/tradition-01.svg` through `tradition-41.svg` correspond to the ordered tradition list in `App/src/ui/symbols.js`.

- 38 render cultural, astronomical, astrological, numerological, or traditional motifs and retain `traditional-symbol-review`.
- The final three are generic project icons for Digital Root, Date Number, and Life-Path-Style Calculation.

This inventory does not imply scientific validation of any interpretation represented by a symbol.

### Fiction symbols

The 26 numbered fiction SVGs are all owner-reported manual vectors developed with AI-generated visual references and franchise references. Their design origin remains `franchise-related`; this does not mean all are official logos. Manual SVG authorship does not remove possible copyright or trademark concerns. `ninxa.svg` is separately classified as project-original NINXA project-canon artwork.

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

Additionally, `src/assets/chronology-symbols/chronology-22.svg` has `unknown` design origin and rights status, and `public/icons.svg` requires third-party mark/source review.

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
