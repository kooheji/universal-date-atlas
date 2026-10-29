import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  ASSET_CATEGORIES,
  ASSET_CREATION_METHODS,
  ASSET_DESIGN_ORIGINS,
  ASSET_PROVENANCE,
  ASSET_PROVENANCE_BASES,
  ASSET_REFERENCE_INFLUENCES,
  ASSET_REVIEW_CLASSIFICATIONS,
  ASSET_RIGHTS_STATUSES,
  ASSET_TRADEMARK_RISKS,
  getAssetsByReviewClassification,
} from './asset-provenance.js'

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const repositoryRoot = resolve(appRoot, '..')
const visualExtension = /\.(?:avif|gif|ico|jpe?g|png|svg|webp)$/i

const committedAssets = execFileSync(
  'git',
  ['ls-files', '--', 'App/src/assets', 'App/public'],
  { cwd: repositoryRoot, encoding: 'utf8' },
)
  .split('\n')
  .filter((path) => visualExtension.test(path))
  .map((path) => path.replace(/^App\//, ''))
  .sort()

const fileAssets = ASSET_PROVENANCE.filter(({ assetKind }) => assetKind === 'file')
const manifestPaths = fileAssets.map(({ path }) => path).sort()
const allowedCategories = new Set(ASSET_CATEGORIES)
const allowedDesignOrigins = new Set(ASSET_DESIGN_ORIGINS)
const allowedCreationMethods = new Set(ASSET_CREATION_METHODS)
const allowedReferenceInfluences = new Set(ASSET_REFERENCE_INFLUENCES)
const allowedProvenanceBases = new Set(ASSET_PROVENANCE_BASES)
const allowedRightsStatuses = new Set(ASSET_RIGHTS_STATUSES)
const allowedTrademarkRisks = new Set(ASSET_TRADEMARK_RISKS)
const allowedReviewClassifications = new Set(ASSET_REVIEW_CLASSIFICATIONS)
const seenIds = new Set()

assert.deepEqual(
  manifestPaths,
  committedAssets,
  'Every committed visual asset in App/src/assets and App/public must have exactly one manifest entry',
)

for (const item of ASSET_PROVENANCE) {
  assert.ok(item.id, 'Every asset must have an id')
  assert.ok(item.path, 'Every asset must have a path')
  assert.ok(!seenIds.has(item.id), `Duplicate asset id: ${item.id}`)
  seenIds.add(item.id)

  assert.ok(existsSync(resolve(appRoot, item.path)), `Manifest path does not exist: ${item.path}`)
  assert.ok(item.subject, `Missing subject: ${item.path}`)
  assert.ok(item.designOrigin, `Missing design origin: ${item.id}`)
  assert.ok(item.creationMethod, `Missing creation method: ${item.path}`)
  assert.ok(item.referenceInfluence.length > 0, `Missing reference influence: ${item.id}`)
  assert.ok(item.provenanceBasis.length > 0, `Missing provenance basis: ${item.id}`)
  assert.ok(item.rightsStatus, `Missing rights status: ${item.path}`)
  assert.ok(item.lastReviewed, `Missing review date: ${item.path}`)

  assert.ok(allowedCategories.has(item.category), `Unsupported category for ${item.path}: ${item.category}`)
  assert.ok(
    allowedDesignOrigins.has(item.designOrigin),
    `Unsupported design origin for ${item.id}: ${item.designOrigin}`,
  )
  assert.ok(
    allowedCreationMethods.has(item.creationMethod),
    `Unsupported creation method for ${item.path}: ${item.creationMethod}`,
  )
  assert.ok(
    allowedRightsStatuses.has(item.rightsStatus),
    `Unsupported rights status for ${item.path}: ${item.rightsStatus}`,
  )
  assert.ok(
    allowedTrademarkRisks.has(item.trademarkRisk),
    `Unsupported trademark risk for ${item.path}: ${item.trademarkRisk}`,
  )
  assert.ok(
    allowedReviewClassifications.has(item.reviewClassification),
    `Unsupported review classification for ${item.path}: ${item.reviewClassification}`,
  )

  for (const influence of item.referenceInfluence) {
    assert.ok(
      allowedReferenceInfluences.has(influence),
      `Unsupported reference influence for ${item.id}: ${influence}`,
    )
  }

  for (const basis of item.provenanceBasis) {
    assert.ok(
      allowedProvenanceBases.has(basis),
      `Unsupported provenance basis for ${item.id}: ${basis}`,
    )
  }

  if (item.designOrigin === 'franchise-related') {
    assert.ok(
      ['review', 'likely-franchise-mark'].includes(item.reviewClassification),
      `Franchise asset lacks a review/risk classification: ${item.path}`,
    )
  }

  if (item.derivedFrom) {
    assert.ok(
      ASSET_PROVENANCE.some(({ path }) => path === item.derivedFrom),
      `Derivative source is absent from the manifest: ${item.path} -> ${item.derivedFrom}`,
    )
  }
}

assert.equal(seenIds.size, ASSET_PROVENANCE.length, 'Every asset id must be unique')
assert.equal(fileAssets.length, committedAssets.length, 'File manifest and committed asset counts must match')
assert.ok(getAssetsByReviewClassification('likely-franchise-mark').length > 0)

const numberedSvg = ASSET_PROVENANCE.filter(({ path }) =>
  /^src\/assets\/(?:calendar|chronology|tradition|fiction)-symbols\/(?:calendars|chronology|tradition|fiction)-\d{2}\.svg$/.test(path))
assert.equal(numberedSvg.length, 136)
assert.ok(numberedSvg.every(({ creationMethod }) => creationMethod === 'manual-vector'))
assert.ok(numberedSvg.every(({ referenceInfluence }) =>
  referenceInfluence.includes('ai-generated-reference')))
assert.ok(numberedSvg.every(({ provenanceBasis }) => provenanceBasis.includes('owner-reported')))

for (const path of [
  'src/assets/calendar-symbols/calendars-13.svg',
  'src/assets/calendar-symbols/calendars-14.svg',
  'src/assets/calendar-symbols/calendars-15.svg',
]) {
  const emblem = ASSET_PROVENANCE.find((item) => item.path === path)
  assert.equal(emblem?.designOrigin, 'national-civil-emblem')
  assert.equal(emblem?.creationMethod, 'manual-vector')
  assert.ok(emblem?.referenceInfluence.includes('national-emblem-reference'))
}

for (const id of ['src/ui/symbols.js#MENORAH', 'src/ui/symbols.js#ROMAN_EAGLE']) {
  const inline = ASSET_PROVENANCE.find((item) => item.id === id)
  assert.equal(inline?.assetKind, 'inline')
  assert.equal(inline?.creationMethod, 'manual-vector')
}

const reviewRequired = ASSET_PROVENANCE.filter(({ rightsStatus }) => rightsStatus === 'review-required')
const unknown = ASSET_PROVENANCE.filter(({ designOrigin, rightsStatus }) =>
  designOrigin === 'unknown' || rightsStatus === 'unknown')

console.log(
  `Asset provenance: ${fileAssets.length} committed visual files and `
  + `${ASSET_PROVENANCE.length - fileAssets.length} inline artworks validated; `
  + `${reviewRequired.length} require rights review; ${unknown.length} retain unknown provenance.`,
)
