import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  ASSET_CATEGORIES,
  ASSET_CREATION_METHODS,
  ASSET_ORIGINS,
  ASSET_PROVENANCE,
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

const manifestPaths = ASSET_PROVENANCE.map(({ path }) => path).sort()
const allowedCategories = new Set(ASSET_CATEGORIES)
const allowedOrigins = new Set(ASSET_ORIGINS)
const allowedCreationMethods = new Set(ASSET_CREATION_METHODS)
const allowedRightsStatuses = new Set(ASSET_RIGHTS_STATUSES)
const allowedTrademarkRisks = new Set(ASSET_TRADEMARK_RISKS)
const allowedReviewClassifications = new Set(ASSET_REVIEW_CLASSIFICATIONS)
const seenPaths = new Set()

assert.deepEqual(
  manifestPaths,
  committedAssets,
  'Every committed visual asset in App/src/assets and App/public must have exactly one manifest entry',
)

for (const item of ASSET_PROVENANCE) {
  assert.ok(item.path, 'Every asset must have a path')
  assert.ok(!seenPaths.has(item.path), `Duplicate asset path: ${item.path}`)
  seenPaths.add(item.path)

  assert.ok(existsSync(resolve(appRoot, item.path)), `Manifest path does not exist: ${item.path}`)
  assert.ok(item.subject, `Missing subject: ${item.path}`)
  assert.ok(item.origin, `Missing origin: ${item.path}`)
  assert.ok(item.creationMethod, `Missing creation method: ${item.path}`)
  assert.ok(item.rightsStatus, `Missing rights status: ${item.path}`)
  assert.ok(item.lastReviewed, `Missing review date: ${item.path}`)

  assert.ok(allowedCategories.has(item.category), `Unsupported category for ${item.path}: ${item.category}`)
  assert.ok(allowedOrigins.has(item.origin), `Unsupported origin for ${item.path}: ${item.origin}`)
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

  if (item.origin === 'franchise-related') {
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

assert.equal(seenPaths.size, ASSET_PROVENANCE.length, 'Every asset path must be unique')
assert.equal(ASSET_PROVENANCE.length, committedAssets.length, 'Manifest and committed asset counts must match')
assert.ok(getAssetsByReviewClassification('likely-franchise-mark').length > 0)

const reviewRequired = ASSET_PROVENANCE.filter(({ rightsStatus }) => rightsStatus === 'review-required')
const unknown = ASSET_PROVENANCE.filter(({ origin, rightsStatus }) =>
  origin === 'unknown' || rightsStatus === 'unknown')

console.log(
  `Asset provenance: ${ASSET_PROVENANCE.length} committed visual assets validated; `
  + `${reviewRequired.length} require rights review; ${unknown.length} retain unknown provenance.`,
)
