---
title: Unit testing frontend code that consumes an HTTP stream
publishDate: 2023-08-22
---

A while back, I had to create a test like that for a React hook (but the example below applies for anything that consumes a stream with native fetch). But all I was able to find were articles on testing Node.js streams (i.e. backend perspective instead of frontend) and the following packages that didn’t work for me: [`fetch-mock`](https://www.npmjs.com/package/fetch-mock), [`node-mocks-http`](https://www.npmjs.com/package/node-mocks-http).

Oh, and ChatGPT suggested two different approaches (I think one of them involved `fetch-mock`) and when I told it that they don’t work for different reasons, it just kept apologizing for the confusion and looped infinitely between the two. 😆

But then, I randomly stumbled across…

The solution
web-streams-polyfill! From node 18 onwards, there’s an experimental native implementation. And so I will use that in the example below. But contrary to what the docs say, it’s not available globally.

This provides the `ReadableStream` with which you can create a factory function that returns streams that you will eventually use for mocking. The chunks in the following example mirror what the OpenAI API returns (At least my backend colleagues at the time told me that it would always send an empty first chunk. And that’s what I received…).

Sidenote: I think it’s important to intentionally fragment some chunk, since that can happen in a real world scenario. Simulate “Slow 3G” in Chrome dev tools and you will probably see it.

```typescript
import { ReadableStream } from 'node:stream/web'

function createStream({ id, text, version }: ChatMessageResponse) {
  const chunks = text.split(' ').map(
    (textChunk, index, fullArray) =>
      'data:' +
      JSON.stringify({
        text: index === fullArray.length - 1 ? textChunk : textChunk + ' ',
        version,
        id,
      })
  )

  return new ReadableStream({
    start(controller) {
      controller.enqueue(
        Buffer.from(
          'data:' +
            JSON.stringify({
              text: '',
              version,
              id,
            }) +
            chunks[0]
        )
      )

      for (let i = 1; i < chunks.length; i++) {
        if (i === chunks.length - 1) {
          // Fragment the last chunk, to test correct merging of partial responses
          const partialChunks = [
            chunks[i].substring(0, Math.floor(chunks[i].length * 0.5)),
            chunks[i].substring(Math.floor(chunks[i].length * 0.5)),
          ]
          setTimeout(() => controller.enqueue(Buffer.from(partialChunks[0])), i)
          setTimeout(() => controller.enqueue(Buffer.from(partialChunks[1])), i + 1)
        } else {
          setTimeout(() => controller.enqueue(Buffer.from(chunks[i])), i)
        }
      }

      setTimeout(() => controller.close(), chunks.length + 1)
    },
  })
}
```

And then you simply use it e.g. like this. If you know a better way of dealing with the type collision for `TextDecoder`, please let me know. 😅

```typescript
  let fetchBackup: typeof fetch

  beforeAll(() => {
    // See https://stackoverflow.com/a/68468204/5040168
    // @ts-expect-error There is a clash between node and browser types.
    global.TextDecoder = util.TextDecoder
  })

  beforeEach(() => {
    fetchBackup = global.fetch
  })

  afterEach(() => {
    global.fetch = fetchBackup
  })

  it('streams correctly', async () => {
    // @ts-expect-error We only mock a partial Response
    global.fetch = async () => ({
      ok: true,
      body: createStream({
        text: 'bot response',
        version: 'test:version',
        id: 'test:id',
      }),
    })

    // Actual test code...
```