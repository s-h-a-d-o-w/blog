---
title: Comparing Cursor's current codebase search performance to its older self and other AI tools
publishDate: 2025-04-08
---

This article isn't relevant for vibe coders. It's not about agents but about getting fast chat responses to difficult questions.

For a bit of context—about a month ago, *Cursor* "broke" their codebase context functionality. Completely changed how they search the codebase. Fortunately, they also experienced major technical difficulties around the time and I backed up the installer for version 0.45.15. Which is how I can still use that.

I'll just start with the numbers and then do a bit of analysis afterwards. The codebase I used is [serenade](https://github.com/serenadeai/serenade). ~60K lines of code across multiple languages.

## Question 1: "Where does the client send the command to insert text the VSCode extension?"

(Yes, there's a word missing in the question. But I didn't want to rerun everything and LLMs were able to deal with it anyway. 😄)

```kroki type=vegalite kind=stacked
{
  "width": 220,
  "height": 140,
  "data": {
    "values": [
      {"y": "Augment (0.404.1)", "type": "Search", "x": 2.5},
      {"y": "Augment (0.404.1)", "type": "Response", "x": 6.9},
      {"y": "Continue (1.1.24, my search)", "type": "Search", "x": 4.4},
      {"y": "Continue (1.1.24, my search)", "type": "Response", "x": 6.5},
      {"y": "Cursor (0.45.15)", "type": "Search", "x": 6.9},
      {"y": "Cursor (0.45.15)", "type": "Response", "x": 5.3},
      {"y": "Continue (1.1.24)", "type": "Search", "x": 11.3},
      {"y": "Continue (1.1.24)", "type": "Response", "x": 8.1},
      {"y": "Copilot (1.301.0)", "type": "Search", "x": 12.2},
      {"y": "Copilot (1.301.0)", "type": "Response", "x": 9.5},
      {"y": "Cursor (0.48.7)", "type": "Search", "x": 30.0},
      {"y": "Cursor (0.48.7)", "type": "Response", "x": 23.2}
    ]
  },
  "encoding": {
    "x": {"title": "Runtime in seconds"},
    "order": {"field": "type", "sort": "descending"},
    "color": {
      "sort": "descending"
    }
  }
}
```

Screen recordings: [Cursor (0.45.15)](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/insertion/cursor_old.mp4), [Augment](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/insertion/augment.mp4), [Continue](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/insertion/continue.mp4), [Continue - my search](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/insertion/continue_my-search.mp4), [Copilot](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/insertion/copilot.mp4), [Cursor (0.48.7)](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/insertion/cursor_new.mp4)

## Question 2: "How do we get the information of what the language of the currently open editor in VS Code is?"

```kroki type=vegalite kind=stacked
{
  "width": 220,
  "height": 140,
  "data": {
    "values": [
      {"y": "Continue (1.1.24, my search)", "type": "Search", "x": 3.5},
      {"y": "Continue (1.1.24, my search)", "type": "Response", "x": 7.9},
      {"y": "Augment (0.404.1)", "type": "Search", "x": 2.5},
      {"y": "Augment (0.404.1)", "type": "Response", "x": 13.5},
      {"y": "Continue (1.1.24)", "type": "Search", "x": 11.7},
      {"y": "Continue (1.1.24)", "type": "Response", "x": 6.4},
      {"y": "Cursor (0.45.15)", "type": "Search", "x": 7.0},
      {"y": "Cursor (0.45.15)", "type": "Response", "x": 13.6},
      {"y": "Copilot (1.301.0)", "type": "Search", "x": 13.8},
      {"y": "Copilot (1.301.0)", "type": "Response", "x": 22.1},
      {"y": "Cursor (0.48.7)", "type": "Search", "x": 13.8},
      {"y": "Cursor (0.48.7)", "type": "Response", "x": 31.3}
    ]
  },
  "encoding": {
    "x": {"title": "Runtime in seconds"},
    "order": {"field": "type", "sort": "descending"},
    "color": {
      "sort": "descending"
    }
  }
}
```

Screen recordings: [Cursor (0.45.15)](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/language_info/cursor_old.mp4), [Augment](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/language_info/augment.mp4), [Continue](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/language_info/continue.mp4), [Continue - my search](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/language_info/continue_my-search.mp4), [Copilot](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/language_info/copilot.mp4), [Cursor (0.48.7)](https://public-183576.s3.eu-central-1.amazonaws.com/blog/2025-04-08_benchmarking-ai-tools/language_info/cursor_new.mp4)

## Failures

The following tools weren't able to answer question 2:

- *Cody* (1.84.0)
- *Roo* (3.11.12) (and so presumably, *Cline* wouldn't be either)
- *Tabnine* (3.259.0)

I didn't bother with question 1 because it's easier and any tool that wants to qualify as an alternative obviously has to work with all cases that the best tools can solve.

## Methodology

*Claude 3.5* was used, as that's available across all tools. (Although *Augment* may have used 3.7, which I've generally found very similar to 3.5. Sometimes better, sometimes worse.)

### Success criteria

- Question 1: Has to find `COMMAND_TYPE_INSERT`. (Ideally with a reference to `command-handler.ts`.)
- Question 2: Has to find `filenameToLanguage`.

Those are just minimum requirements though. Information with which one can start to figure out things. Only *Copilot* and *Continue* with my search server were able to provide the comprehensive answer I was actually looking for for question 2. Same with question 1, except that recent *Cursor* was able to do that one as well.

### Measurement

The search time actually includes latency until the response stream starts. This is because that is something that can be observed for all tools. Only some show when code-based context generation ends and the final request to the LLM is sent.

### Sample size

I only measured each tool once because I don't see an easy way of automating this. While I recognize that a sample size of 1 isn't great when latencies can vary, I have used all of these tools for a while and the differences described here seem representative to me. And you can, of course, easily try it for yourself, most have free tiers or trials.

## How I work

Here is a bit more context, since it might help understand why I am incredibly focused on this. It might also inspire you to think differently about how you use AI.

- I generate a ton of code by chat or autocomplete, which I will then *often* edit—bugfix or improve (readability, best practices, performance, etc.) Which still tends to be a lot faster than writing everything myself. But only if the responses/suggestions come in fast.
- About half of my AI usage requires codebase context, not just the current file. Asking questions about or editing either multiple files or things in unknown locations. Manually dragging and dropping files or even typing their names is too slow.
- If a plausible looking response doesn't start to stream within a few seconds, it's too slow. If it looks worthless, I might just interrupt and re-phrase my prompt or do things myself altogether. (I make exceptions for complex problems that require something like `o3-mini`.)
- Having to type or click on something extra to just generally trigger codebase context inclusion is too slow.
- Agents are too slow. A single LLM response often already takes quite a while, never mind multiple. I can't wait for that long, only to find out that the response might be bad.

Yes, these expectations were basically set by old *Cursor*. Because *Copilot*, which I used before, obviously isn't as fast and requires writing `@workspace` every. single. time.

## Analysis

It may seem like the incredibly bad *Cursor* performance for question 1 might just be an outlier. But I saw performance like that regularly and it's the reason why I bothered re-installing *Cursor* regularly for about a month. (Since it updates itself whenever you exit it.)

*Augment* is stunningly fast but unfortunately doesn't allow for choosing a model. Which is a very questionable design choice in my opinion and something I will probably elaborate on in the upcoming article.

What's the "my search" when it comes to *Continue*? I implemented my own code base indexer and search server to work with it. Maybe I'll talk more about that in the future as well. I also might do a survey asking you what you think about it.

Based on what I've also seen across other tools, I suspect that the main business that has emerged are vibe coders and massive token usage, driven by agents. I'm guessing that that's where *Cursor* is trying to make the real money now. Get you to consume the free number of premium requests, so that you have to pay as you go. At least I suspect that each one of those searches is tool usage and thus a premium request. If this theory is correct, it could also be problematic for the future of how other AI tools work. Although, maybe agent usage will eventually become fast and cheap enough that it stops being a problem. But for now, at least in my opinion, it is.

## Coming up soon

As alluded to above, I will likely post a comparison of AI tools soon as I'm trying to figure out a way forward, after having had a great two months with *Cursor* from January to March. If you have suggestions (other than not using AI or terminal-based tools 😄), please let me know!
