import test from 'node:test'
import assert from 'node:assert/strict'
import { parseBrandingDocument } from '../src/services/brandingParser.js'

const stubReader = t => {
  class Reader {
    readAsArrayBuffer(file) {
      queueMicrotask(() => this.onload({ target: { result: new TextEncoder().encode(file.text || '').buffer } }))
    }
    readAsDataURL(file) { this.readAsArrayBuffer(file) }
  }
  const previous = globalThis.FileReader
  globalThis.FileReader = Reader
  t.after(() => { globalThis.FileReader = previous })
}

test('TXT extraction preserves actual colors without adding example brand rules', async t => {
  stubReader(t)
  const result = await parseBrandingDocument({ type: 'text/plain', text: 'Primary color #123456\nKeep logo clear' })
  assert.equal(result.colors.primary[0].hex, '#123456')
  assert.deepEqual(result.colors.prohibited, [])
  assert.equal(result.logo, undefined)
})

test('unsupported PDF and legacy DOC reject rather than return sample guidelines', async t => {
  stubReader(t)
  await assert.rejects(parseBrandingDocument({ type: 'application/pdf' }), /PDF parsing is not available/)
  await assert.rejects(parseBrandingDocument({ type: 'application/msword' }), /Legacy DOC files are not supported/)
})

test('image decode errors reject and release the object URL', async t => {
  stubReader(t)
  const previousImage = globalThis.Image
  const previousDocument = globalThis.document
  const revoked = []
  t.mock.method(URL, 'createObjectURL', () => 'blob:test-image')
  t.mock.method(URL, 'revokeObjectURL', value => revoked.push(value))
  globalThis.document = { createElement: () => ({ getContext: () => ({}) }) }
  globalThis.Image = class { set src(value) { queueMicrotask(() => this.onerror()) } }
  t.after(() => { globalThis.Image = previousImage; globalThis.document = previousDocument })
  await assert.rejects(parseBrandingDocument({ type: 'image/png' }), /Unable to decode/)
  assert.deepEqual(revoked, ['blob:test-image'])
})
