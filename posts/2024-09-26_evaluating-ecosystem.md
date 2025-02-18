---
title: Evaluating React framework/styling options—it's not looking great currently
publishDate: 2024-09-26
lastUpdated: 2024-10-05
---

I would like to preface this by saying that I'm sure all the people who have worked very hard on the following projects only mean well. That said, people 5-10 years ago also worked very hard and meant well, yet they gave us things like React, TypeScript, the early Next.js, styled-components, emotion, jest, playwright, testing library, etc.—all of which were generally robust.

Given that there are many React haters, I should note that while I have looked at solid, svelte, astro and previously Vue and wouldn't necessarily mind using some of them, I still love React. This article is mostly about the things used with React. React at its core is just as wonderful as it has ever been, particularly since the move to hooks.

Anyway, I recently spent some time researching how I would set up a new app that should survive the coming years. If you haven't seen much of React server components ("RSC" below) yet, I recommend at least skimming [this video](https://youtu.be/VIwWgV3Lc6s?si=gwrOF4Cc28ZBXBMJ).

I'll start off with a list of tools and their pros and cons. (Usage numbers like "…K/week" are npmjs downloads.)

## Frameworks

### Next.js with app router
✅ Currently only way to do RSC.  
✅ A certain base level of reliability (and large community) that's not necessarily a given with other options.  
✅ Generally (not just the app router), many of the Next.js design decisions are obviously reasonable to great.  
❌ Currently ["bleeding edge" according to the React team](https://react.dev/reference/rsc/server-components). (I think this is especially a problem because vercel has made it the default.)  
❌ [Falling in satisfaction](https://2023.stateofjs.com/en-US/libraries/meta-frameworks/) roughly since the introduction of the app router. Based on bits I saw here and there, this doesn't seem to be dissatisfaction with RSC itself but problems specifically with the app router.  
❌ Hello world: 87 kB.  
❌ [Styling docs](https://nextjs.org/docs/app/building-your-application/styling/css-in-js) are either out of date or Josh W. Comeau is wrong [in his article here](https://www.joshwcomeau.com/react/css-in-rsc/). If they're out of date, given that vercel allows for community contributions, it would mean that it's not just the vercel team that doesn't care about hundreds of thousands of devs (estimate based on download stats of the most popular libraries) who have enjoyed using CSS in JS but also the maintainers of the libraries in question, some of which I've evaluated below. Which seems pretty dire to me.  

### Vite (obviously not a framework but the most popular choice for bundling your own solution)
✅ [Exceptional satisfaction](https://2023.stateofjs.com/en-US/libraries/build_tools/#build_tools_ratios).  
✅ Lean. Use just what you need.  
🤷 Streaming really only works for ["lazy-loading component code with lazy"](https://react.dev/reference/react/Suspense), resulting in faster page load. Streaming while data is still being fetched requires ["Suspense-enabled frameworks like Relay and Next.js [or Remix]"](https://react.dev/reference/react/Suspense) or [RSC](https://react.dev/reference/react/use). (Although it sounds like [it's possible via tanstack query](https://tanstack.com/query/latest/docs/framework/react/guides/ssr#a-quick-note-on-suspense).)  
❌ Router options aren't great (see below).  
❌ CSS and JS links in the head are in the wrong order (JS before CSS). Nobody has reported this and no easy customization is possible. Easiest workaround is probably to run a custom script after bundling. Next.js does it correctly. One could maybe argue that this doesn't matter, since browsers these days fetch assets from head in parallel anyway. Sure. Yet, this seems very basic to me and it makes me wonder what other things I might stumble across if I started using vite regularly.  

### Astro
✅ [Highest framework satisfaction](https://2023.stateofjs.com/en-US/libraries/meta-frameworks/).  
✅ Simple setup that doesn't get in your way much, similar to Next.js but obviously not React-specific.  
✅ Probably makes management of microfrontends easy.  
🤷 300K/week.  
🤷 I've marked this as neutral because I accept that it is the workflow suggested by the prettier team: https://patheticgeek.dev/blog/astro-prettier-eslint-vscode But ever since the eslint and prettier vscode extensions fought one another years ago, I started using `eslint-plugin-prettier` and never looked back. One extension less, simpler IDE config, single source of truth. We had problems with this at one company I worked for recently too. Some people would commit things formatted differently because of bad IDE/extension configuration. I introduced `eslint-plugin-prettier`, people uninstalled the prettier extension and removed excess vscode settings—problem solved. Maybe it's a bit slower (I've never noticed any lag during saving) but the simplicity and reliability is totally worth it.  
🤷 To take full advantage, one should probably learn their pretty extensive proprietary API and construct Astro components rather than React (or Svelte, Vue, etc.) components. But those components are mostly just usable for content-driven sites, not highly interactive apps.  
❌ Islands architecture seems less appealing to me than RSC, since—unless I'm mistaken—you can't compose islands as flexibly as you can server and client components. At the same time, it is flexible in the sense that different teams might use different tech for islands or potentially different versions. Astro promotes that as a selling point but it can of course also mean problematic fragmentation.  
❌ Only tried it a bit but hot reload didn't seem reliable to me. Styles of astro components would not update pretty regularly.  
❌ Because it's framework-independent, one has to learn how to configure e.g. SSR with it rather than it working out of the box when using e.g. Next.js.

### Remix
❌ 10% of the downloads of Next.js but a [similar rate of dissatisfaction](https://2023.stateofjs.com/en-US/libraries/meta-frameworks/).  
❌ A core contributor (also for `react-router`) has an in my opinion [horrible take on `const`](https://www.youtube.com/watch?v=dqmtzHB2zTM). (I agree with Theo's commentary.)  

## Routers (assuming a custom vite-based setup)

### @tanstack/react-router
✅ Usage quickly increases, currently 140K/week.  
✅ Looking at the API, I got the impression that Tanner prefers transparency over magic — which I *love*. And skimming a video of his, I actually randomly stumbled across him [saying just that](https://www.youtube.com/live/sNe2EKegNNI?t=995s). (In fact, this is one of the reasons I love React. Sure, it does a lot under the hood. But still, its API is largely about people writing their own logic instead of relying on framework magic.)  
🤷 Will become [part of another full stack solution](https://tanstack.com/start/latest).  
🤷 There is a RSC example and presumably, with the release of *tanstack start*, the support will be made officially available. (Tanner [has been preparing for RSC and React 19](https://github.com/TanStack/router/pull/1824).)  
❌ They're fine with [having broken examples in the docs](https://github.com/TanStack/router/issues/2126#issuecomment-2290187156). (I would argue that if something doesn't work on the website but does work when cloning, one should just link to the repo instead of keeping an example that doesn't work on the site live.)  
❌ [Another broken example](https://github.com/TanStack/router/issues/1700#issuecomment-2288531802). This is a big bummer for me because I think either SSR with streaming or RSC should be the minimum for a new project. Generally, I think these broken examples don't bode well for long-term reliability, even once *tanstack start* gets released and these problems maybe get resolved.  

### react-router
✅ Loaders make it possible to fetch data before SSR per route.  
🤷 Downloads have stagnated since January 2023. (10M/week)  
❌ Taken over by Remix and the two are coupled in a way that I find questionable. It's one thing that they advertise in the docs. But to import things from the Remix project instead of keeping the two separate at least on a code level seems bad to me. What if Remix goes under?  
❌ Pipelines on `main` fail pretty regularly.  
❌ Docs code isn't written using TS. (Seems minor but personally, I'm considering vanilla JS legacy and thus a red flag.)  

## CSS

### Panda CSS (I used this the most recently, so I found a number of problems)

✅ Should support RSC architecturally. But the Next.js docs say that it doesn't. (One can of course just try a simple example. But that wouldn't answer whether RSC support is reliable for large projects with complex styling and config.)  
✅ TS perks (type-checked tokens, easy to detect unused code, IDE can find references/definition).  
✅ Optimizes via atomization.  
✅ Looks well-maintained — hundreds of closed issues and PRs, almost nothing open.  
✅ Make an effort to conform to specs. (Example)  
🤷 Standard way is styling via `className={css({...})}`.  
🤷 Supports shared style objects (spreading them into the main style declaration that you create with css/styled) but only if they're in the same module and not nested. Which is still great for e.g. `@starting-style`! (Especially in comparison to native CSS, where your only option is copying those code blocks.)  
❌ Due to the optimization (via atomization) of styles, toggling them on/off in dev tools can be a problem, since one declaration might affect a lot of things. The optimization can't be turned off. And even if it could be, you probably wouldn't want to because atomization can change precedence, leading to unexpectedly broken styles if one was to only optimize the production build.  
❌ Overriding styles doesn't tend to work well. Depending on how you do it, it may result in unexpected override behavior or may not work at all. Again due to the optimization. When atomized styles are shared, one can easily run into a mismatch of the order of class declarations and what different components would need. In a way that can't be resolved. Which leads to having to create lots of variants and having to have the boiler plate that comes with passing through the necessary props.  
❌ Doesn't support design tokens declared in JS. They have to either be declared in the panda config, mapped to some name (for which autocomplete is available but no type-checking and one has to use full text search for token usage) — or CSS variables of course.  
❌ `styled` API is an afterthought, hidden away in the docs. (And they still really seem to want you to [clutter your JSX with style definitions](https://panda-css.com/docs/concepts/style-props#jsx-element).)  
❌ Too opinionated. Which wouldn't be a problem if they offered clear paths for different tastes with their setup tool. Or described them in the Getting started section of the docs.  
❌ Includes a ton of tokens by default, resulting in a minimum of ~15 kB CSS. (Haven't seen anything in the docs on how to only remove those.)  
❌ Went overboard with the tons of optional concepts it supports. Feels like many different tools in one.  
❌ Some [seriously hacky workflows](https://panda-css.com/docs/concepts/hooks#remove-unused-variables-from-final-css).  
❌ Puts generated code into project. I'm skeptical that code other than things caused by custom config can't live in `node_modules`.  
❌ Can't reference other components in selectors. For the highly interactive apps that I tend to work on, that's not a problem. But I can see how it could be one if complex content is provided via a CMS and styles have to adapt dynamically.  

### vanilla extract
✅ Like others here — should theoretically support RSC. Next.js team says it doesn't.  
✅ TS perks (type-checked tokens, easy to detect unused code, IDE can find references/definition)  
✅ Supports importing design tokens declared in JS code from "wherever".  
🤷 Sprinkles could be used for string-literal tokens.  
❌ Seems like creators may have tuned out a while back.  
❌ SSR with vite didn't work for me.  
❌ Sprinkles create lots of redundant code. They should probably generate "class A, class B, class C" whenever rules would be the same.  
❌ Satisfaction has [dropped from 87% to 72%](https://2023.stateofcss.com/en-US/css-in-js/). (But still 2nd highest.)  
❌ API requires `className` boiler plate. (Not THAT big of a deal but I simply prefer `styled` APIs.)  

### Pigment CSS
✅ Like others here — should theoretically support RSC. Next.js team says it doesn't.  
❌ Quite a bit of boilerplate for variants.  
❌ Pipelines on master have been failing for a long time.  
❌ Use JS in core modules ([example](https://github.com/mui/pigment-css/blob/master/packages/pigment-css-react/src/styled.js)), even though this project is only half a year old.  
❌ Use mocha.  
❌ Maybe there's a good reason for using a high number of dependency overrides and 3 different monorepo tools (pnpm workspaces, nx, lerna). But it strikes me as chaotic.  

### emotion/styled-components
❌ Despite what [the Next.js docs](https://nextjs.org/docs/app/building-your-application/styling/css-in-js) say, [it looks like this will actually never support RSC](https://github.com/emotion-js/emotion/issues/2928).  

### CSS modules
✅ [Very high usage and satisfaction](https://2023.stateofcss.com/en-US/css-in-js/).  
✅ RSC support.  
🤷‍♀️ No optimization, hence also a number of duplicate rules in the basic Next.js example. But given the problems I've had with Panda's optimization, maybe that's not a bad thing.  
❌ Obviously — contrary to CSS-in-JS, easy to come across precedence problems when sharing styles across components.  
❌ Usage of classes or variables generally can't be traced by the IDE, has to be done using full text search. Can be a problem with large projects due to name collisions and variables being declared across a number of files.  

### material-ui

🤷 Has been very popular and around for a long time. On the one hand, that can indicate a certain amount of reliability. On the other hand, pipelines on `master` seem to fail ~50% of the time. And it looks like they haven't invested much into keeping their tech reasonably recent.

[![material-ui downloads](/assets/2024-09-26_evaluating-ecosystem/materialui-downloads.png)](https://npmtrends.com/@material-ui/core-vs-@mui/material-vs-material-ui)

❌ Code is  44% JS, 55.8% TS.  
❌ The same tech decisions as Pigment CSS (mocha, nx/pnpm/lerna, high amount of dependency overrides) - both are made by mui after all. Although it seems like with Pigment CSS, there was an opportunity for a fresh start.  

### Open Props
✅ [Very high satisfaction](https://2023.stateofcss.com/en-US/css-frameworks/).  
✅ Seems to adhere to a lot of great practices - maybe no surprise given that it was created by [Adam Argyle, who has been a UX Engineer for Google for years](https://www.linkedin.com/in/adamargyle/).  
✅ Offers a guide for how to optimize via PostCSS to only ship the props that are actually used.  
🤷 Contrary to other things in this list, this just provides design tokens. I only checked it out due to its popularity. I suppose if you want to knock out something alright looking quickly, this can be great.  

### Tailwind/Windi/Unocss
✅ [High usage and satisfaction on average](https://2023.stateofcss.com/en-US/css-frameworks/).  
✅ RSC support.  
✅ Great design tokens that are likely responsible for the success. (Although—many other libraries had/have those. One can also combine something like Open Props with a more general styling solution. Also, whipping up a set of custom tokens actually isn't that difficult.)  
❌ Huge chains of classes result in awful readability.  
❌ Memorizing non-standard abbreviations for CSS rules seems like a very bad idea.  

## Others worth mentioning

### Bun

⚡ Holy crap, it's *fast*!  
❌ Buggy/unstable in all ways that I've tried it—as a package manager, a runtime and a test runner.  
❌ Maybe there are different best practices for highly complex native code (I've only ever worked on pretty simple things) but if I saw [a TS module like this](https://github.com/oven-sh/bun/blob/main/src/bun.zig) in a project that I work on, I'd sound the alarm. (In case you don't know what I mean: Individual modules generally shouldn't contain more than a few hundred lines of code, since the code becomes difficult to read/manage otherwise. At time of writing, this has 3787 lines.)  

## Closing thoughts

A few years ago, things were pretty straight-forward to me — Next.js, some CSS in JS library and you're good to go. Of course - back then, most companies weren't using Next.js. 😄

Although, I also recently discovered a note to myself in an old Next.js project that says 'Try not to use Next.js ever again!!" Reasons given were problems with dynamic routes, no ability to output verbose build logs and zeit (now vercel) seemingly designing things to nudge people into adopting opinionated workflows that can be monetized more easily. My suggestion was to "try using something less opinionated and leaner", kind of like why I chose React over Angular many years ago. Which is why I really wanted vite and tanstack router to pan out. But it just didn't. At least not to my standard that at least SSR with streaming has to work.

It also looks to me like the React and Next.js team jumped the gun on releasing server components. They're collecting user feedback for sure. But at the expense of user satisfaction. You can say "it's experimental" all you want — when Next.js makes it the default, most people will expect smooth sailing.

Why am I even so focused on RSC if I mostly work on highly interactive apps? Well, first of all, like I've mentioned, I would've been satisfied with just SSR. The same question would still apply of course. And it's because I'm still interested in SEO and great page load performance. OK, so you'll probably have different apps for e.g. the marketing site and the actual product. But as long as it's not unreasonable, I also try to go with consistency and things that perform well by default. Having a few lines of code somewhere that make most of a highly interactive app run on the client only doesn't seem like a big burden. But it comes with the perk that the shell will load faster, things can be moved out to that shell as needed (the line between highly interactive and not isn't always that clear) and projects will have similar architecture.

As for CSS — a real conundrum. In one recent project, I used CSS modules and in another Panda. For a long time, I by far preferred working with Panda but the more I used it, the more the problems piled up (see above). I wish I could be more confident about the future of vanilla extract because I really like type checking and being able to trace design token usage. So right now, although there a few solutions that I absolutely don't want to use, there's also nothing recent that supports RSC and I *really* want to use.

But that's just me. I'm sure there are many who work on content-driven apps (or maybe huge projects with multiple different frontends) all the time who rightly love Astro. And maybe many who just ignore all the server-side optimizations and just ship their purely client-side app e.g. bundled with vite — fair enough. Many are obviously in love with Tailwind. And then there are those who don't mind possibly digging through hundreds of full text search results on a large code base, trying to figure out whether some design tokens are even still used. From these points of views, everything is of course just fine.

And at least when it comes to the JS/web ecosystem more broadly, e.g. playwright still seems decent and reliable. Vitest also seems like a great drop-in replacement for jest. I also love how pnpm has improved so much over the years that it has become more popular than yarn (which I enjoyed using for years before finally switching to pnpm probably about a year ago) has ever been. So… there's still great stuff. Fingers crossed that the whole framework (using the term loosely)/styling situation will improve again too.
