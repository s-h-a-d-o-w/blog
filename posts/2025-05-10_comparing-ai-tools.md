---
title: Moving beyond Cursor for more efficiency? (An AI tools comparison)
publishDate: 2025-05-10
---

Like [my previous article related to this](/blog/2025-04-08_benchmarking-ai-tools), where I benchmarked codebase search speed, this isn't suitable for vibe coders. These articles were prompted by Cursor's increasing dismantling of non-agent workflows. This time around, I will cover the overall experience.

Spoiler: I still think that nothing can beat Cursor at autocomplete for the time being.

## How I work #2 (or: Why I hate agents, at least for now.)

I already wrote a bit about it in the previous article. When using the chat, I can read while it's streaming and maybe cancel if I realize that it's nonsense. But with agents, it's usually that things start popping up all over the place, making it impossible to follow along what it's doing. Sure, you can wait for a minute or so until it's done. But after that minute what I usually realize is that the agent has done more than I wanted it to. And not in a good way. I usually have to micromanage and reject at least half of what it created and then fix the rest. The end result is the same as if I had asked chat but it takes way longer.

That said, I also hated Copilot like... 2? 3? years ago. I don't remember when I first tried it. People were pushing it really hard already, companies buying licenses for everybody. But it was essentially useless. Yet, a year or so later, it started being good enough that I started using it regularly. And then I switched to Cursor, which I was also originally skeptical about, another half a year ago later.

Maybe agents will get there in time. Maybe they will become a lot faster and smart enough to not make excessive changes. Or to generate code that doesn't have to be modified significantly. I will probably check again in a year or so.

## Quality

I looked in more detail at the results of various tools from the previous test—so, beyond just basic success. The following is how I would rate the different tools. Keep in mind that the same model was used, so the result quality mostly depends on what codebase context was provided. (The different system prompts that the models use may have some impact, but it seems negligible. Because the responses are often written or structured in a similar way and it's mostly the amount and kind of information that's different.)

*Continue* (my search): ⭐⭐⭐⭐⭐  
*Copilot*: ⭐⭐⭐⭐⭐  
*Cursor* (new): ⭐⭐⭐⭐  
*Augment*: ⭐⭐⭐  
*Cursor* (old): ⭐⭐⭐  
*Continue* (built-in search): ⭐⭐⭐

## Autocomplete

While creating the graphs for the previous article, I was able to test this by copying a part of a JavaScript object into my Markdown code, wanting to convert it to JSON. I suspect that code in Markdown tends to be pretty challenging for autocomplete and if something can handle this, it can probably handle pretty much anything.

### Cursor

✅ Knew immediately what to do and did it successfully with 1 tab.  
✅ Triggers even on click.

### Continue

Using codestral, [as they suggest](https://docs.continue.dev/customize/deep-dives/autocomplete#setting-up-with-codestral-recommended).

🤷 Knew what to do after I typed `"`, but didn't execute it well. It inserted the JSON code instead of replacing and it kept the same part of the JavaScript object around—didn't suggest deleting it. I also tried it with regular code and it seems like it can only add, not replace/delete.  
❌ Only makes autocomplete requests after typing. Nothing on click or when moving the cursor. This might work well for many people and is arguably efficient but it still means that you might be less productive (fewer things being suggested that you might accept) and it's bad for accessibility (speech input).  
❌ No ideal support for codestral with OpenRouter (don't use fill-in-the-middle API). There was no difference in behavior during my test, but it might still lead to worse results overall.

### Augment
❌ Didn't suggest the conversion even after I typed `"`.

### Copilot
❌ Didn't suggest the conversion even after I typed `"`.


## Overall impressions

Something that all the extensions here have in common is that one constantly has to switch between other things and the extension in the UI. It's a shame that the right side is probably exclusive to Copilot. Would go to show that the criticism for Cursor about how they're "just ripping off VS Code" is nonsense. No, they had to fork it to make the UI work. (And that's just one reason.)

### Cursor (old) ⭐⭐⭐⭐

✅ Fantastic autocomplete! (Usually. Since it is pretty aggressive, it can sometimes result in negative impact on readability. But I'd rather have this aggressive strategy than the other way around, which I've seen in other tools.)  
✅ Great accuracy to speed "ratio". It would usually be able to tell me what I needed to know (or generate what I needed) within a very short amount of time.  
❌ Adding of context like currently open file or selection has to be done manually.  
❌ Bad usage tracking. Possibly intentionally convoluted. (Having to go to the web app instead of seeing it right in the IDE.)

This is the bar all other tools are measured against.

### Cursor (current) ⭐⭐⭐

Same as old Cursor, except:

✅ Response quality has improved a bit.  
❌ Very slow. No more adding of codebase context to the initial request.  
❌ Code blocks within chat can't be applied any more.  
❌ Chat will now often emit code for the whole file when asked for changes, which takes a long time to stream.  
❌ Ever since they migrated to agentic codebase discovery, it sometimes happens to me that the agent just keeps searching and searching (for minutes) until the maximum number of tool calls has been exhausted.  
❌ Doesn't seem to actually add the current file to the context, even when that is indicated. Claude e.g. told. me: "the current visible portion (lines 42-81) [...]".  
❌ Having to add context manually has become especially frustrating since it keeps around the previous chat history now. Which would be a nice thing in principle, if the context handling was smarter. E.g. *Augment* does all of this *so* much better.

If it wasn't for the autocomplete, this would be ⭐⭐

### Continue ⭐⭐⭐

✅ Open Source.  
✅ Bring your own API keys as the default. The benefit of this is that you can decide on the quality/UX to cost tradeoff. (At least in theory. In practice, you may be limited by what the tool offers in the first place—see cons below.)  
✅ Substantial customization possible. This ties in a bit with the previous point. Because you can, for example, use an HTTP provider to have your own server provide additional context. But because this is kind of niche (most people use agents and MCP servers), I haven't found any decent tools.  
🤷 Mediocre autocomplete.  
🤷 When using VoyageAI how they suggest, it increases accuracy but doesn't reduce latency. Was a big letdown for me.  
❌ No ability to add initial context by currently open file or selected code. But they've recently [accepted this as something that should be done](https://github.com/continuedev/continue/issues/5457)!  
❌ Convoluted signup. I had to log in using GitHub like three times.  
❌ Buggier than all other tools here. (An example: Indexing once got stuck at 41%, no more CPU usage. After a restart, it got stuck at 0%, with a maxed out thread keeping my CPU fan on high. I let it run for an hour, hoping that it's actually doing something. Nope. I don't remember how I resolved it. I believe I reinstalled and forced reindexing.)  
❌ Sometimes not transparent about behavior. For example, they will use a smaller context window than the model might be able to handle for Ollama but don't indicate that. You also have no way of knowing that the context was truncated unless you check the logs. (Although I've seen that they've recently been working on this too.)  
❌ Doesn't manage access to various providers for you, so having centralized management like through OpenRouter becomes pretty important. Yet, the integration with OpenRouter isn't great, e.g. no prompt caching when using Claude.  
❌ They offer configuring models through a web app and push that everywhere. The experience is unfortunately pretty bad. (You CAN simply edit a config file (config.yml) in VS Code directly though. I'd strongly recommend you do that if you try it out!)  
❌ Chat scroll bar isn't visible by default! This can be changed in the settings, but it not being visible by default is very odd.  
❌ 17% JavaScript. (Which might of course be similar or worse with closed source products. But anything more than ~2% JavaScript generally makes me skeptical about the code quality.)

### Augment ⭐⭐

✅ Mostly fantastic UX! Adds codebase context, the currently open file and possible selection by default. You can choose to remove them, but they are always there by default. No need to write anything, drag anything, etc.  
✅ Unlimited usage, at least for the time being. There's a downside to this that I mentioned in the cons. Which is also a reason why I prefer pay as you go.  
❌ No ability to choose a model. [They say that they use different ones dynamically](https://www.augmentcode.com/blog/1-open-source-agent-on-swe-bench-verified-by-combining-claude-3-7-and-o1), but based on the responses, I suspect that they only do that in agent mode. (For example, `o4-mini` tends to have pretty long response times and produces results that are less likely to contain code snippets and more likely to be smarter. It also tends to have a bit of a cooler, almost slightly arrogant tone. I never got a response like that from *Augment*.)   
❌ Quality of responses tends to be low. The codebase search may be fast, but this makes me think that it's not of good quality.  
❌ Inserts an empty line at the end of a file when applying changes. (I've already made them aware of this about a month ago and they told me that it would get fixed.)  
❌ Because of the flat fee and lack of model selection, there's an incentive for them to cut costs where they believe that they can. I prefer to have the option of paying more for quality. But not as a flat fee, but pay as you go.
❌ Pretty bad autocomplete.

Maybe picking a model that's appropriate for the task will work in the future (*Cursor* is also trying to do that now with "Auto") and maybe they will be able to not compromise on quality. But at the moment, it just doesn't. And so, as much as I appreciate the overall great UX, I just don't find it usable.

### Copilot ⭐⭐

✅ Great response quality. (Probably because of the huge amount of information that they send in the initial context. Just look at how many items from the codebase that they always send.)  
❌ Atrocious UX. I'm using such a strong word here because it really is by far the worst. Having to manually specify wanting to use workspace context or having to drag and drop files and very, very bad code suggestion application performance. (Unless they fixed any of this recently.)  
❌ Wasteful. I might go into that in yet another article (on AI and sustainability). On the one hand, it's great that they provide enough context to ensure good answers. On the other hand, through my own experiments I've seen that that much context isn't necessary if the search that you're using is great. And so they likely cause a lot of excessive energy consumption.

## Others

These all failed my previous test, but I'm still going to list other experiences with them.

### Roo/Cline

❌ No autocomplete.  
❌ Agent only => huge token usage.

Maybe these are great for vibe coders, but personally, I don't have a use for them.

### Cody (by Sourcegraph)

❌ Bad account/session management—regularly being logged out, moving from one web app to another, doesn't track what plan you're on well.  
❌ Buggy setup. I was stuck at signing in until I exited VS Code.

### Qodo gen

❌ Keeps reindexing the code base, both when selecting it beforehand and after actually sending the prompt.
❌ Started writing code into a new editor window, even though I only used the ask function in standard mode.  

### Tabnine

❌ Something seems off. Check the last release date on the extension marketplace vs. the last release on GitHub vs. the latest commit. No comment anywhere about what's going on with all of that.  
❌ Uses the same model for chat and autocomplete.  
❌ Requires manually copy and pasting a key during initial sign-in. It's not a big deal, but given that no other tool does it like this, it seems like they are not using best practices.  
❌ Require email verification when you've already verified using your GitHub account.

## My recommendations

Well... the quality of the LLM responses is really only good or great with the slow *Copilot* or the even slower new *Cursor*. For those who are all about quality (no matter the speed) and great autocomplete, it might be especially frustrating that *Cursor* and *Copilot* can't be combined.

I tend to use *Cursor* for navigating unknown codebases and tough problems. *Augment* for straightforward tasks.

But I'm obviously not happy with the number of tradeoffs that have to be made. And so...

## Long-term plans

Initially, I worked on my own indexer/search just to speed up the *Continue* experience. But then I was also blown away by the quality of the results!

I guess none of the tools mentioned offer this because VoyageAI's `voyage-code-3` is comparatively expensive, so they can't easily absorb the cost and they also can't easily pass it on to the user. Also, given how users seem to work with AI tools, speed and quality isn't something that companies can justify investing in.

But for my own use, I'm totally fine paying 7$ to index a code base the size of Grafana. Especially since that will be a one-time cost due to an embeddings cache/archive that I'll create. (I wonder whether large companies like Grafana, Microsoft, etc. would be up for paying to have their open source repos indexed if those embeddings are then shared publicly. A possible problem with this is that different people would have different opinions as to *how* the indexing should be done. They might not like my chunking strategy.)

Currently, my tool works well for a single fixed codebase at a time. But I'm working on making that into a product—likely a vscode extension with no/simple UI. Both so that I can actually use it across projects while having decent UX and so that I can maybe generate income (I'm currently unemployed).

But *Continue* of course comes with its own downsides. A currently unresolved question for me is—do I want to keep working with *Continue*? Or should I create my own AI tool extension? Which would have to be as minimalistic as *Augment*, since I'm just one person without funding.

Either way, I would keep using *Cursor's* autocomplete. And *Augment* would be replaced by either *Continue* with my indexer/search or my own extension.

## Your feedback

If you have a few minutes, I would really appreciate your opinions on this topic (the possible products I just described): https://forms.gle/VGURQCxNQZrcYCbS7

If you don't have a Google account, [let me know](mailto:andy@aop.software), and I will email you the survey.

Thanks in advance to everybody who decides to help! 🙏
