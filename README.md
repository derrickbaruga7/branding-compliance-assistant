# Branding Compliance Assistant

A React prototype for uploading brand guidelines, inspecting extracted colors, and reviewing a design image. It provides sampled color checks and a downloadable JSON report.

## Current capabilities

| Area | Implemented behavior |
| --- | --- |
| Guidelines | Basic TXT/DOCX text extraction and image palette extraction. Review extracted information against the original document. |
| Design review | Image upload to a canvas and sampled checks for prohibited colors and color count. |
| Reports | Issues, suggestions, extracted colors, and JSON export. |
| Logo, typography, spacing | Manual review required; geometry is not measured automatically. |
| PDF and legacy DOC | Unsupported. Export to TXT or DOCX first. |
| External integrations | Experimental service modules exist but are not connected through the main application workflow. |

The app is an exploratory design aid. It does not certify a design's compliance. A clean sampled color check cannot establish that every pixel or every brand rule passes.

## Run locally

Use Node.js 22 or newer and npm 9 or newer. `.nvmrc` selects Node 24.

```bash
git clone https://github.com/derrickbaruga7/branding-compliance-assistant.git
cd branding-compliance-assistant
npm ci
npm run dev
```

Open <http://localhost:3000/branding-compliance-assistant/>. Upload one of the TXT examples under [test-files](test-files/), inspect the extracted guidelines, then upload a PNG/JPEG design and run the check.

```bash
npm test
npm run build
npm run preview
```

Tests use Node's built-in test runner. CI installs the lockfile, runs tests, builds on Node 22 and 24, and gives each matrix artifact a unique name. Main-branch deployment reuses the tested Node 24 artifact. The existing GitHub Pages workflow requires Pages to serve the published `gh-pages` branch.

## Code map

- `src/components/`: upload, guideline review, canvas, and report views.
- `src/services/brandingParser.js`: basic text and image extraction.
- `src/services/complianceChecker.js`: sampled color checks and explicit manual-review status.
- `tests/`: regression tests for color checks, repeatability, and error handling.

## Limitations and next steps

The text parser extracts only a small part of a guideline document, including up to two hex colors and matching rule lines. It does not reliably distinguish allowed and prohibited colors in arbitrary prose. Image colors are sampled. External design-tool services and the image-generation module need separate implementation and review before activation. Never place private API credentials in a browser bundle.

Older demo, deployment, and setup notes describe broader planned functionality; this README describes the current implementation. Dependency upgrades should be validated with a clean install, tests, and a production build. See the [MIT License](LICENSE).
