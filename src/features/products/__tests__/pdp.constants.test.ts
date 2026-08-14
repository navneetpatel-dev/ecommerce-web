import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  PDP_OFFERS_FETCH_LIMIT,
  PDP_OFFERS_PREVIEW_COUNT,
} from '../constants/pdpOffers'
import {
  IMAGE_GALLERY_LIGHTBOX_HEIGHT_CLASS,
  IMAGE_GALLERY_STAGE_HEIGHT_CLASS,
  IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS,
  IMAGE_GALLERY_ZOOM_SCALE,
} from '../../../shared/constants/imageGallery'

describe('PDP offers constants', () => {
  it('keeps the collapsed preview shorter than the fetch window', () => {
    assert.ok(PDP_OFFERS_PREVIEW_COUNT > 0)
    assert.ok(PDP_OFFERS_FETCH_LIMIT > PDP_OFFERS_PREVIEW_COUNT)
  })
})

describe('PDP gallery constants', () => {
  it('uses a mild zoom scale so the full asset stays sharp', () => {
    assert.ok(IMAGE_GALLERY_ZOOM_SCALE > 1)
    assert.ok(IMAGE_GALLERY_ZOOM_SCALE <= 2)
  })

  it('applies responsive stage heights and lg-only thumb rail height', () => {
    assert.match(IMAGE_GALLERY_STAGE_HEIGHT_CLASS, /\bh-\[/)
    assert.match(IMAGE_GALLERY_STAGE_HEIGHT_CLASS, /\blg:h-\[/)
    assert.match(IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS, /^lg:h-\[/)
    assert.doesNotMatch(IMAGE_GALLERY_THUMB_COLUMN_HEIGHT_CLASS, /(^|\s)h-\[/)
    assert.match(IMAGE_GALLERY_LIGHTBOX_HEIGHT_CLASS, /dvh/)
  })
})
