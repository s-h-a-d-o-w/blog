import { expect, test } from 'vitest'
import { truncateHtml } from './truncateHtml'

test(truncateHtml.name, () => {
  expect(truncateHtml(`<p><div>Hello <strong>world</strong>! <img src="image.jpg"><div>Another <em>example</em>`)).toMatchInlineSnapshot(`"<p></p>"`)

  expect(truncateHtml(`<p><div>Hello <strong>world<img src="image.jpg"></strong>! </div><div>Another <em>example</em>`)).toMatchInlineSnapshot(`"<p><div>Hello <strong>world<img src="image.jpg"></strong>! </div></p>"`)
  
  expect(truncateHtml(`<p>A while back, I had to create a test like that for a React hook (but the example below applies for anything that consumes a stream with native fetch). But all I was able to find were articles on testing Node.js streams (i.e. backend perspective instead of frontend) and the following packages that didn’t work for me: <a href="https://www.npmjs.com/package/fetch-mock" rel="nofollow" target="_blan`)).toMatchInlineSnapshot(`"<p>A while back, I had to create a test like that for a React hook (but the example below applies for anything that consumes a stream with native fetch). But all I was able to find were articles on testing Node.js streams (i.e. backend perspective instead of frontend) and the following packages that didn’t work for me: ...</p>"`)
})