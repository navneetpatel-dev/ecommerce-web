import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  fitModeToObjectClass,
  resolveImageFitMode,
} from '../imageGalleryFit'

describe('imageGalleryFit', () => {
  it('prefers contain when aspects differ enough to crop noticeably', () => {
    assert.equal(resolveImageFitMode(800, 1600, 800, 600, 0.22), 'contain')
    assert.equal(resolveImageFitMode(1600, 800, 600, 800, 0.22), 'contain')
  })

  it('prefers cover when aspects are close', () => {
    assert.equal(resolveImageFitMode(1200, 900, 800, 600, 0.22), 'cover')
    assert.equal(resolveImageFitMode(1000, 1000, 800, 800, 0.22), 'cover')
  })

  it('defaults to contain for invalid dimensions', () => {
    assert.equal(resolveImageFitMode(0, 900, 800, 600, 0.22), 'contain')
    assert.equal(resolveImageFitMode(800, 900, 0, 600, 0.22), 'contain')
  })

  it('maps fit modes to object-fit classes', () => {
    assert.equal(fitModeToObjectClass('cover'), 'object-cover')
    assert.equal(fitModeToObjectClass('contain'), 'object-contain')
  })
})
