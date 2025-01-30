---
title: LLRT - evaluating non-standard use cases (and a bit about attempting to put node on a diet)
publishDate: 2025-01-31
---

**Note: As of writing, the LLRT maintainers themselves say that LLRT is to be used for evaluation purposes only!**

I recently stumbled across [AWS Labs' LLRT](https://github.com/awslabs/llrt), a lightweight JS engine intended for cloud use, because Node.js has just grown too much for my liking and bun/deno aren't any lighter. LLRT is much smaller and while there is an impressive benchmark for the latency for a simple database operation available at the top of their README, there is only a vague remark regarding other use cases under [Limitations](https://github.com/awslabs/llrt?tab=readme-ov-file#limitations). Articles I've stumbled across only suspect that it wouldn't do well with computation intensive tasks.

So I got curious. How bad exactly is the performance with use cases other than what it was made for? 😄

## Performance benchmark

I tried to run the bun benchmarks but they tend to rely on either native addons or features that LLRT doesn't support. So I created some very basic scenarios. (See code further below.)

Maybe these aren't the best but nobody else has benchmarked LLRT with a variety of workloads yet and I think at least the file system crawling is a decent representation of I/O read speed. If you come up with something better, please link to your article in the comments!

But now let's get to this first stab at it. I compared LLRT 0.4.0-beta to Node v22.11.0 on Windows 11 and WSL2 with Ubuntu.

```kroki type=vegalite
```

## Memory usage

People are often concerned about memory usage when seeing how huge Node is, even though those two things aren't necessarily related, since not everything that is shipped might actually be loaded into memory (and some code might be shared across instances). Still, I was curious how LLRT does here.

```kroki type=vegalite
```

## Benchmark code

... code

## Can we make Node smaller?

No.

Not as end users and not in a way worth mentioning anyway. I stumbled across [this issue](https://github.com/nodejs/node/issues/43811) and thought "Awesome, I'll investigate that!" But based on my experiments and what I could see among the build flags, it looks like the internationalization stuff pointed out there is the only significant chunk and it's not that significant compared to the rest these days.

Here are my results based on building [`main`](https://github.com/nodejs/node/commit/da5f7aca6ac1fac2b7840dc11c0ef8e740cfc414):
- Production build: 83 MB
- Full build: 115 MB
- Without intl and removing some v8 features similar to the issue: 72 MB
- (Previous point) and enabling "v8 lite": 63 MB

So, not really worth it. One would probably need to know a lot about Node to understand why it's as huge as it is and whether it could be built differently with little effort.

## Verdict

Low level language snobs at least always used to scoff at how large JS-based apps are (haven't spoken to any in years), both on the drive and in memory. And that's fair enough in a way. But while analyzing this, I randomly saw 9 Node processes already running. Probably sharing most of their various runtime and library code. At least on Windows. Not sure what's going on with the higher private memory usage on Linux. Or maybe Windows is overly optimistic about how much is shared?

Anyway, I think there's another thing to consider, especially if you care about sustainability: Power efficiency.

Alright, low level languages win at that as well. But if that's just not feasible and you HAVE to choose between JS runtimes to use—during heavy computations, both Node and LLRT max out the thread. Yet LLRT is much, much slower.

Then again—does that matter if it actually doesn't compute much? Most of the little tools I've created in my spare time run in the background and are mostly idle. And so one can maybe make the case that it's fine to optimize for drive and memory usage there. (But then there's also the fact that LLRT doesn't support a lot of features that are commonly needed for desktop apps—native addons, worker threads, etc.)

So it seems like the LLRT use case solely being computationally inexpensive cloud operations probably won't change. Because there's probably no to very little business value to features that would make it a replacement in a desktop app setting and I would be surprised if a 100x speed increase would be possible anyway.


WSL:
andy@work:/mnt/c/Users/andy/Downloads/llrt-windows-x64-no-sdk$ ./llrt perf.mjs
CPU: 608.11 ms
Memory: 2600.94 ms
Crypto: 104.81 ms
I/O: 168537.62 ms, Total size: 28735.17 MB
andy@work:/mnt/c/Users/andy/Downloads/llrt-windows-x64-no-sdk$ node perf.mjs
CPU: 24.89 ms
Memory: 182.72 ms
Crypto: 191.28 ms
I/O: 76626.21 ms, Total size: 28735.17 MB

native Windows:
C:\Users\andy\Downloads\llrt-windows-x64-no-sdk>llrt perf.mjs
CPU: 980.23 ms
Memory: 2201.93 ms
Crypto: 147.63 ms
I/O: 18508.21 ms, Total size: 214991.97 MB
C:\Users\andy\Downloads\llrt-windows-x64-no-sdk>node perf.mjs
CPU: 7.88 ms
Memory: 208.01 ms
Crypto: 236.62 ms
I/O: 10256.59 ms, Total size: 214991.97 MB


# Memory
Win (Task manager Private/Shared)
Node 10.2 M / 86 M
LLRT 1.9 M / 15.5 M

WSL2 (top RES/SHR)
Node 43.1m / 34.9m
LLRT 4.9m / 3.9m
