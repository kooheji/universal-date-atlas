import assert from 'node:assert/strict'
import { FICTION_SYSTEMS } from './fiction-registry.js'
import { SYSTEM_REGISTRY } from './system-registry.js'

function duplicateIds(systems) {
  const seen = new Set()
  const duplicates = new Set()

  for (const { id } of systems) {
    if (seen.has(id)) duplicates.add(id)
    seen.add(id)
  }

  return [...duplicates].sort()
}

assert.deepEqual(
  duplicateIds(SYSTEM_REGISTRY),
  [],
  'Every SYSTEM_REGISTRY id must be unique',
)

const implementedIds = new Set(
  SYSTEM_REGISTRY
    .filter(({ status }) => status === 'implemented')
    .map(({ id }) => id),
)
const plannedIds = SYSTEM_REGISTRY
  .filter(({ status }) => status === 'planned')
  .map(({ id }) => id)
const implementedPlannedDuplicates = plannedIds
  .filter((id) => implementedIds.has(id))
  .sort()

assert.deepEqual(
  implementedPlannedDuplicates,
  [],
  'No registry id may appear in both implemented and planned entries',
)

assert.deepEqual(
  duplicateIds(FICTION_SYSTEMS),
  [],
  'Every fiction registry id must be unique',
)

console.log(
  `Registry integrity: ${SYSTEM_REGISTRY.length} system IDs and ${FICTION_SYSTEMS.length} fiction IDs are unique.`,
)
