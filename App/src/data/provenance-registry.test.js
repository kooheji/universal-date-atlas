import assert from 'node:assert/strict'
import {
  getProvenance,
  getProvenanceAuditReport,
  getSources,
  getSystemsByEvidenceLevel,
  getSystemsMissingProvenance,
  getSystemsMissingSources,
  PROVENANCE_AUTHORITY_VALUES,
  PROVENANCE_EVIDENCE_VALUES,
  PROVENANCE_METHOD_VALUES,
  PROVENANCE_REGISTRY,
  PROVENANCE_SOURCE_TYPES,
} from './provenance-registry.js'
import { getImplementedSystems, SYSTEM_REGISTRY } from './system-registry.js'

const allowedIds = new Set(SYSTEM_REGISTRY.map(({ id }) => id))
const allowedAuthorities = new Set(PROVENANCE_AUTHORITY_VALUES)
const allowedMethods = new Set(PROVENANCE_METHOD_VALUES)
const allowedEvidenceLevels = new Set(PROVENANCE_EVIDENCE_VALUES)
const allowedSourceTypes = new Set(PROVENANCE_SOURCE_TYPES)
const seenIds = new Set()

function values(value) {
  return Array.isArray(value) ? value : [value]
}

function validateControlledValues(value, allowed, label, id) {
  assert.ok(values(value).length > 0, `${id} must declare at least one ${label}`)
  for (const item of values(value)) {
    assert.equal(typeof item, 'string', `${id} ${label} values must be strings`)
    assert.ok(allowed.has(item), `${id} has unsupported ${label}: ${item}`)
  }
}

for (const item of PROVENANCE_REGISTRY) {
  assert.ok(allowedIds.has(item.id), `${item.id} must be a valid SYSTEM_REGISTRY id`)
  assert.equal(seenIds.has(item.id), false, `Duplicate provenance id: ${item.id}`)
  seenIds.add(item.id)

  validateControlledValues(item.authority, allowedAuthorities, 'authority', item.id)
  validateControlledValues(item.method, allowedMethods, 'method', item.id)
  assert.ok(allowedEvidenceLevels.has(item.evidenceLevel), `${item.id} has invalid evidence level`)

  assert.ok(Array.isArray(item.sources), `${item.id} sources must be an array`)
  for (const source of item.sources) {
    assert.equal(typeof source.title, 'string', `${item.id} source title must be a string`)
    assert.ok(source.title.trim(), `${item.id} source title must not be empty`)
    assert.equal(typeof source.author, 'string', `${item.id} source author must be a string`)
    assert.ok(source.author.trim(), `${item.id} source author must not be empty`)
    assert.ok(allowedSourceTypes.has(source.type), `${item.id} has invalid source type: ${source.type}`)
    assert.match(source.url, /^https?:\/\//, `${item.id} source URL must use HTTP or HTTPS`)
  }

  assert.ok(Array.isArray(item.assumptions), `${item.id} assumptions must be an array`)
  assert.match(item.lastReviewed, /^\d{4}-\d{2}-\d{2}$/, `${item.id} lastReviewed must use YYYY-MM-DD`)

  if (item.fictionalSystem) {
    validateControlledValues(item.fictionalSystem.authority, allowedAuthorities, 'fictional-system authority', item.id)
  }
  if (item.earthBridge) {
    validateControlledValues(item.earthBridge.authority, allowedAuthorities, 'Earth-bridge authority', item.id)
    validateControlledValues(item.earthBridge.method, allowedMethods, 'Earth-bridge method', item.id)
  }
}

assert.equal(getProvenance('gregory')?.evidenceLevel, 'high')
assert.ok(getSources('julian-day').length > 0)
assert.ok(getSystemsByEvidenceLevel('under-review').length > 0)

const implementedIds = new Set(getImplementedSystems().map(({ id }) => id))
const missingProvenance = getSystemsMissingProvenance()
const missingSources = getSystemsMissingSources()

assert.ok(missingProvenance.length > 0, 'The phased audit must identify implemented systems still missing provenance')
assert.ok(missingProvenance.every(({ id }) => implementedIds.has(id)), 'Missing-provenance results must be implemented systems')
assert.ok(missingSources.every(({ id }) => implementedIds.has(id)), 'Missing-source results must be implemented systems')
assert.ok(missingSources.some(({ id }) => id === 'star-wars-bby-aby'), 'Unsourced fiction must remain visible in the audit')

const report = getProvenanceAuditReport()
assert.equal(report.totalImplementedSystems, implementedIds.size)
assert.equal(report.provenanceSize, PROVENANCE_REGISTRY.length)
assert.equal(report.systemsRequiringResearch, report.researchRequiredIds.length)

console.log(
  `Provenance registry: ${PROVENANCE_REGISTRY.length} entries validated; ` +
  `${report.systemsWithDocumentedSources} implemented systems have sources; ` +
  `${report.systemsRequiringResearch} implemented systems require research.`,
)
