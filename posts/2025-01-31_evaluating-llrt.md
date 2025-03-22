---
title: Benchmarking LLRT with Non-Standard Use Cases (and an Attempt to Put Node on a Diet)
publishDate: 2025-01-31
lastUpdated: 2025-02-01
---

### Versions used: Node v22.11.0, LLRT v0.4.0-beta

**Note: As of writing, the LLRT creators say that LLRT is to be used for evaluation purposes only!**

I recently stumbled across [AWS Labs' LLRT](https://github.com/awslabs/llrt), a lightweight JS engine intended for cloud use, because Node has just grown too much for my liking, and neither bun nor deno are lighter alternatives. LLRT is much smaller, and while there is an impressive benchmark for the latency of a simple database operation available at the top of their README, there is only a vague remark regarding other use cases under [Limitations](https://github.com/awslabs/llrt?tab=readme-ov-file#limitations). Articles I've come across only suspect that it wouldn't do well with computation-intensive tasks.

So I got curious. What *is* the performance like for use cases other than what it was made for? 😄

## Performance Benchmark

I tried to run the bun benchmarks, but they tend to rely on either native addons or features that LLRT doesn't support. So I created some very basic scenarios. (See code further below.)

Maybe these aren't the best, but nobody else has benchmarked LLRT with a variety of workloads yet, and I think at least the file system crawling is a decent representation of I/O read speed. If you come up with something better, please link to your article in the comments!

But now let's get to this first stab at it. I compared LLRT 0.4.0-beta to Node v22.11.0 on Windows 11 and WSL2 with Ubuntu.

```kroki type=vegalite
{
  "width": 220,
  "height": 100,
  "title": "Intense Calculation",
  "data": {
    "values": [
      {"y": "Windows (Node.js)", "x": 8},
      {"y": "WSL (Node.js)", "x": 25},
      {"y": "Windows (LLRT)", "x": 980},
      {"y": "WSL (LLRT)", "x": 608}
    ]
  },
  "encoding": {
    "x": {"title": "Runtime (ms)"}
  }
}
```

```kroki type=vegalite
{
  "width": 220,
  "height": 100,
  "title": "Memory Allocation",
  "data": {
    "values": [
      {"y": "Windows (Node.js)", "x": 208},
      {"y": "WSL (Node.js)", "x": 183},
      {"y": "Windows (LLRT)", "x": 2202},
      {"y": "WSL (LLRT)", "x": 2601}
    ]
  },
  "encoding": {
    "x": {"title": "Runtime (ms)"}
  }
}
```

```kroki type=vegalite
{
  "width": 220,
  "height": 100,
  "title": "Crypto",
  "data": {
    "values": [
      {"y": "Windows (Node.js)", "x": 237},
      {"y": "WSL (Node.js)", "x": 191},
      {"y": "Windows (LLRT)", "x": 148},
      {"y": "WSL (LLRT)", "x": 105}
    ]
  },
  "encoding": {
    "x": {"title": "Runtime (ms)"}
  }
}
```

```kroki type=vegalite
{
  "width": 220,
  "height": 100,
  "title": "File System Crawl",
  "data": {
    "values": [
      {"y": "Windows (Node.js)", "x": 10},
      {"y": "WSL (Node.js)", "x": 77},
      {"y": "Windows (LLRT)", "x": 19},
      {"y": "WSL (LLRT)", "x": 169}
    ]
  },
  "encoding": {
    "x": {"title": "Runtime (s)"}
  }
}
```

## Memory Usage

People are sometimes concerned about memory usage given how huge Node is, even though those two things aren't necessarily related, since not everything that is shipped might actually be loaded into memory, and some code might be shared across instances. Still, I was curious how LLRT does here.

```kroki type=vegalite kind=stacked
{
  "width": 220,
  "height": 100,
  "data": {
    "values": [
      {"y": "Windows (Node.js)", "type": "Private", "x": 10.2},
      {"y": "Windows (Node.js)", "type": "Shared", "x": 86.0},
      {"y": "WSL (Node.js)", "type": "Private", "x": 43.1},
      {"y": "WSL (Node.js)", "type": "Shared", "x": 34.9},
      {"y": "Windows (LLRT)", "type": "Private", "x": 1.9},
      {"y": "Windows (LLRT)", "type": "Shared", "x": 15.5},
      {"y": "WSL (LLRT)", "type": "Private", "x": 4.9},
      {"y": "WSL (LLRT)", "type": "Shared", "x": 3.9}
    ]
  },
  "encoding": {
    "x": {"title": "RAM usage (MB)"}
  }
}
```

Not sure what's going on with the higher private memory usage on Linux. Or maybe Windows is overly optimistic about how much is shared?

## Benchmark Code

```ts
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path'
import { performance } from 'perf_hooks';

async function getDirectorySize(dirPath) {
  let totalSize = 0;
  const items = await fs.readdir(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(item.parentPath, item.name);
    if (item.isDirectory()) {
      totalSize += await getDirectorySize(fullPath);
    } else if(!item.isSymbolicLink()) {
      const stats = await fs.stat(fullPath);
      totalSize += stats.size;
    }
  }

  return totalSize;
}

async function runBenchmark() {
  // CPU-intensive operation
  const start = performance.now();
  for (let i = 0; i < 10000000; i++) {
    Math.sqrt(i);
  }
  const end = performance.now();
  const duration = end - start;
  console.log(`Intense Calculation: ${duration.toFixed(2)} ms`);

  // Memory-intensive operation
  const start1 = performance.now();
  const bigArray = new Array(10000000).fill('test');
  bigArray.sort();
  const end1 = performance.now();
  const duration1 = end1 - start1;
  console.log(`Memory Allocation: ${duration1.toFixed(2)} ms`);

  // Crypto operation
  const start2 = performance.now();
  for (let i = 0; i < 100000; i++) {
    crypto.createHash('sha256').update('test').digest('hex');
  }
  const end2 = performance.now();
  const duration2 = end2 - start2;
  console.log(`Crypto: ${duration2.toFixed(2)} ms`);

  // I/O operation
  const start3 = performance.now();
  const totalSize = await getDirectorySize('Z:\\youtube');
  const end3 = performance.now();
  const duration3 = end3 - start3;
  console.log(`File System Crawl: ${duration3.toFixed(2)} ms, Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
}

runBenchmark().catch(console.error);
```

## Can We Make Node Smaller?

No.

Not as end users and not in a way worth mentioning anyway. I stumbled across [this issue](https://github.com/nodejs/node/issues/43811) and thought, "Awesome, I'll investigate that!" But based on my experiments and what I could see among the build flags, it looks like the internationalization stuff pointed out there is the only significant chunk, and it's not that significant compared to the rest these days.

Here are my results based on building [`main`](https://github.com/nodejs/node/commit/da5f7aca6ac1fac2b7840dc11c0ef8e740cfc414):
- Production build: 83 MB
- Full build: 115 MB
- Without intl and removing some V8 features similar to the issue: 72 MB
- (Previous point) and enabling "V8 lite": 63 MB

So, not really worth it. One would probably need to know a lot about Node to understand why it's as huge as it is and whether it could be built differently with little effort.

## Verdict

Low-level language snobs at least always used to scoff at how large JS-based apps are (haven't spoken to any in years), both on the drive and in memory. And that's fair enough in a way. But while analyzing this, I randomly saw 9 Node processes already running. Probably sharing most of their various runtime and library code. At least on Windows, if we can believe its shared memory numbers.

Anyway, I think there's another thing to consider, especially if you care about sustainability: **Power efficiency**.

Alright, low-level languages win at that as well. But if that's just not feasible and you *have* to choose between JS runtimes to use—during heavy computations, both Node and LLRT max out the thread. Yet LLRT is much, much slower.

Then again, does that matter if it actually doesn't compute much? Most of the little tools I've created in my spare time run in the background and are mostly idle. And so one can maybe make the case that it's fine to optimize for drive and memory usage there. (But then there's also the fact that LLRT doesn't support a lot of features that are commonly needed for desktop apps—native addons, worker threads, etc.)

So it seems like the LLRT use case solely being computationally inexpensive cloud operations probably won't change. Because a 100x computation performance increase seems unlikely and I suspect that there's no to very little business value to features that would make it a replacement in a desktop app setting.