# Open-source readiness review

This review is a release checklist, not legal advice. No project license has been added because the repository owner must first confirm the rights listed below.

## Current status

- The public repository has no root `LICENSE` file. Until one is added, copyright law reserves reuse rights even though the source is publicly visible.
- The npm runtime and build dependencies declare permissive licenses: Astronomy Engine, Three.js, Temporal Polyfill, `date-bengali-revised`, and Vite declare MIT; `balinese-date-js-lib`, `bikram-sambat`, and Playwright declare Apache-2.0. The axe Playwright integration declares MPL-2.0 and is a development-only dependency.
- Dependency license texts and notices still need to be carried into any distribution when their licenses require it. Automated dependency/license review should be repeated whenever the lockfile changes.
- The many custom calendar, chronology, tradition, and fiction SVGs, the favicons, social image, and other brand artwork have no per-file provenance or license manifest in this repository.
- Fictional universe names, symbols, terminology, and chronology descriptions may involve third-party copyright or trademark interests. Factual references and interoperability do not automatically grant rights to reproduce artwork or protected branding.
- The astronomical and historical conversion rules should retain source citations and distinguish standards, reconstructions, project conventions, and unofficial models.

## Recommendation before licensing

1. Record the author/source and intended license for every image and SVG in an asset manifest.
2. Replace or exclude any asset whose rights cannot be confirmed, and document trademark ownership and non-affiliation where appropriate.
3. Confirm that all code contributors agree to the chosen license and that no commissioned or employer-owned code is included without permission.
4. Add dependency attribution/notices appropriate to the shipped form.
5. Have counsel review the fictional-universe references and public branding if this will be promoted commercially.

Once those checks are complete, the MIT License is a suitable simple default for original project code. Apache-2.0 is a reasonable alternative if an explicit patent grant is preferred. License original code and project-owned artwork separately if their reuse terms differ; do not represent third-party artwork, names, or marks as covered by the project license.
