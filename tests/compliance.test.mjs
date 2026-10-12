import test from 'node:test'
import assert from 'node:assert/strict'
import { checkCompliance } from '../src/services/complianceChecker.js'

const canvas = pixel => ({ width: 1, height: 1, getContext: () => ({ getImageData: () => ({ data: new Uint8ClampedArray(pixel) }) }) })
const guidelines = { colors: { primary: [], secondary: [], prohibited: [{ hex: '#f00' }] } }

test('reports prohibited colors as errors, including shorthand hex rules', async () => {
  const result = await checkCompliance(canvas([255, 0, 0, 255]), guidelines)
  assert.equal(result.overall, 'error')
  assert.deepEqual(result.details.colors.prohibitedColors, ['#ff0000'])
})
test('transparent pixels do not trigger prohibited-color findings', async () => {
  const result = await checkCompliance(canvas([255, 0, 0, 0]), guidelines)
  assert.deepEqual(result.details.colors.foundColors, [])
  assert.equal(result.overall, 'warning')
})
test('white is checked when it is prohibited', async () => {
  const result = await checkCompliance(canvas([255, 255, 255, 255]), { colors: { prohibited: [{ hex: '#fff' }] } })
  assert.equal(result.overall, 'error')
})
test('repeated checks are deterministic and never invent geometry', async () => {
  const first = await checkCompliance(canvas([0, 0, 255, 255]), guidelines)
  const second = await checkCompliance(canvas([0, 0, 255, 255]), guidelines)
  assert.deepEqual(first, second)
  assert.equal(first.details.logo.logoSize, null)
  assert.equal(first.details.spacing.status, 'not-assessed')
  assert.equal(first.overall, 'warning')
})
test('canvas failures reject so callers can recover', async () => {
  await assert.rejects(checkCompliance({ getContext() { throw new Error('Canvas unavailable') } }, guidelines), /Canvas unavailable/)
})
