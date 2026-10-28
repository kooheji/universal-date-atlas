# Open-source readiness review

This review is a release checklist, not legal advice. No project license has been added because the repository owner must first confirm the rights listed below.

## Current status

- The public repository has no root `LICENSE` file. Until one is added, copyright law reserves reuse rights even though the source is publicly visible.
- The asset manifest inventories all 146 committed SVG/PNG/ICO files under `App/src/assets/` and `App/public/`. Seventeen are marked `likely-franchise-mark`, 13 have `review-required` rights status, and one retains unknown origin/rights. See [`docs/ASSETS.md`](../docs/ASSETS.md).
- The favicon family is recorded as one project master plus six generated derivatives. The social preview has an AI-assisted/generative workflow strongly indicated but no model, prompt, or source-reference history recorded. The shared icon sprite includes third-party social marks.
- Fictional universe names, symbols, terminology, and chronology descriptions may involve third-party copyright or trademark interests. Factual references and interoperability do not automatically grant rights to reproduce artwork or protected branding.
- The astronomical and historical conversion rules should retain source citations and distinguish standards, reconstructions, project conventions, and unofficial models.

## Direct dependency license review

Versions below are the installed lockfile versions. Declared ranges remain in `package.json`. License identifiers were checked against `package-lock.json`, the installed package metadata/license files, and the linked upstream repositories on 2026-10-28.

| Package | Declared / installed | Scope | License | Redistribution consideration | Evidence |
| --- | --- | --- | --- | --- | --- |
| `astronomy-engine` | `^2.1.19` / `2.1.19` | Runtime | MIT | Retain the copyright and MIT permission notice when distributing substantial portions. The npm package omits a standalone license file, so a future notice process should source the upstream text deliberately. | [Upstream license](https://github.com/cosinekitty/astronomy/blob/master/LICENSE) |
| `balinese-date-js-lib` | `^0.4.3` / `0.4.3` | Runtime | Apache-2.0 | Include Apache-2.0 and preserve required attribution/notices when redistributing the package or derivatives. No package `NOTICE` file was observed. | [Upstream license](https://github.com/peradnya/balinese-date-js-lib/blob/master/LICENSE.md) |
| `bikram-sambat` | `^1.8.1` / `1.8.1` | Runtime | Apache-2.0 | Include Apache-2.0 and preserve required attribution/notices when redistributing the package or derivatives. The installed tarball lacks a standalone license/NOTICE file; use the upstream license text. | [Upstream license](https://github.com/medic/bikram-sambat/blob/master/LICENSE) |
| `date-bengali-revised` | `^2.0.2` / `2.0.2` | Runtime | MIT | Retain the copyright and MIT permission notice when distributing substantial portions. | [Upstream license](https://github.com/commenthol/date-bengali-revised/blob/master/LICENSE) |
| `temporal-polyfill` | `^1.0.4` / `1.0.4` | Runtime | MIT | Retain the copyright and MIT permission notice when distributing substantial portions. | [Upstream package license](https://github.com/fullcalendar/temporal-polyfill/blob/main/polyfill/LICENSE) |
| `three` | `^0.186.0` / `0.186.0` | Runtime | MIT | Retain the copyright and MIT permission notice when distributing substantial portions. | [Upstream license](https://github.com/mrdoob/three.js/blob/dev/LICENSE) |
| `@axe-core/playwright` | `^4.11.0` / `4.11.0` | Development only | MPL-2.0 | Not part of the production bundle in the current build. If redistributed or modified, retain MPL notices and satisfy source-form obligations for covered files; MPL does not automatically relicense separate project files. | [Upstream license](https://github.com/dequelabs/axe-core-npm/blob/develop/LICENSE) |
| `@playwright/test` | `^1.56.1` / `1.56.1` | Development only | Apache-2.0 | Not part of the production bundle. If redistributed, include Apache-2.0 and the package `NOTICE`, including its Puppeteer-derived-code notice. | [Upstream license](https://github.com/microsoft/playwright/blob/main/LICENSE), [NOTICE](https://github.com/microsoft/playwright/blob/main/NOTICE) |
| `vite` | `^8.3.5` / `8.3.5` | Development only | MIT | Not part of the production bundle as a tool. Its published package carries bundled-dependency license material that should accompany redistribution of the tool/package. | [Upstream license](https://github.com/vitejs/vite/blob/main/LICENSE) |

The lockfile contains 57 installed packages: 10 runtime package records and 47 development package records. Every record currently declares a license identifier. The identifiers are MIT, Apache-2.0, MPL-2.0, BSD-3-Clause, and ISC. This metadata check is not a substitute for retaining the license texts/notices that apply to the actual distribution form, and it should be repeated whenever the lockfile changes.

No reviewed direct dependency appears to prevent a future permissive license for the Atlas's original code. Dependency licenses govern their own files and redistribution obligations; they do not resolve the artwork and third-party-mark issues.

## Recommendation before licensing

1. Replace, exclude, or obtain rights review for the 17 likely franchise marks and resolve the 13 `review-required` assets plus the unmapped/unknown chronology symbol.
2. Preserve editable source files and creation/reference histories for artwork claimed as project-owned, especially NINXA branding, traditional-symbol redraws, and the favicon master.
3. Confirm that all code contributors agree to the chosen code license and that no commissioned or employer-owned code is included without permission.
4. Generate an accurate third-party notices bundle for the actual distribution form, including MIT notices, Apache-2.0 texts/notices, Vite's bundled-license material where applicable, and MPL-covered files if they are redistributed.
5. Have counsel review fictional-universe references, modern national/civil emblems, social marks, and public branding if the project will be promoted commercially.

## Provisional licensing structure — no license granted yet

- **Code:** once contributor ownership is confirmed, MIT appears suitable for original Atlas source code. Apache-2.0 remains an alternative if an explicit patent grant is preferred.
- **Artwork/assets:** use separate terms for confirmed project-owned artwork. Do not automatically include all files under `App/src/assets/` or `App/public/` in the code license.
- **Third-party names, marks, and references:** expressly exclude third-party franchise marks, social marks, and protected emblems from any project license grant; replace or separately review the flagged artwork.
- **Current repository state:** remain source-visible but unlicensed until the rights review is complete. No `LICENSE`, `COPYING`, `COPYRIGHT`, package `license` field, or final `NOTICE` should be added prematurely.
