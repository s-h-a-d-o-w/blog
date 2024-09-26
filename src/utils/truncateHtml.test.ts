import { expect, test } from 'vitest'
import { truncateHtml } from './truncateHtml'

test('adds 1 + 2 to equal 3', () => {
  expect(truncateHtml(`<div>Hello <strong>world</strong>! <img src="image.jpg"><div>Another <em>example</em>`)).toBe('')
  expect(truncateHtml(`<div>Hello <strong>world<img src="image.jpg"></strong>! </div><div>Another <em>example</em>`)).toMatchInlineSnapshot(`"<div>Hello <strong>world<img src="image.jpg"></strong>! </div>"`)

})