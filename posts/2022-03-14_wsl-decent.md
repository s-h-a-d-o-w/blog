---
title: WSL is decent now for web development!
publishDate: 2022-03-14
---

At least with vscode. There might be other tools available but that’s the particular IDE that I’ve evaluated.

## The extension that makes it possible

Given the currently 12,560,753 downloads for [Remote-WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) (What’s going on there anyway? I’ve only ever met one engineer who uses Windows and WSL professionally. And don’t people who develop native software usually use Visual Studio? Maybe a ton of people who simply installed recommended extensions? 😅), maybe this isn’t news to many. Yet I only randomly learned about it through [this article that has a whopping 5 likes](https://dev.to/paddymorgan84/wsl-2-and-vs-code-3jnf) (I recommend checking this out for more on WSL-related topics — although some of it is a bit outdated by now).

Why is that extension absolutely key? Well, while a ton of articles have been talking about how fast WSL 2 is for years, not as many mentioned that if you use it with the Windows file system (i.e. just using `bash` and staying on `/mnt/C/…` instead of going to `~`), it absolutely cripples the performance. Which is why that is not included in my benchmarks below. Trying to work like that is a non-starter.

But since I’m not a fan of just statements that “it’s fast” or benchmarks that aren’t tied to a real world use case, let’s get to…

## Benchmarks

OSes used:

- Windows 10
- Ubuntu 20.04.2 for WSL
- Linux Mint 20.2

Project used: Closed source, sorry (the [vidIQ browser extension](https://chrome.google.com/webstore/detail/vidiq-vision-for-youtube/pachckjkecffpdphbpmfolblodfkgbhl?hl=en))

Typescript server restart time was measured by hand, using vscode’s “Restart TS server” command, waiting for errors to reappear.

![WSL benchmarks](/assets/2022-03-14_wsl-decent/benchmarks.webp)

Aside from these benchmarks, I also observed CPU usage while moving the cursor in vscode and it’s pretty much the same.

When first starting vscode with a WSL project, you’ll see “Vmmem” with pretty high CPU usage. That calms down (to 0.1–0.5% on my machine) after a minute or two.

## Musings on related tools

While exploring the viability of WSL, I stumbled across Windows Terminal. Another hugely popular project but hey — maybe you also live under a rock, like me, apparently. 🙈😆 Anyway, great for managing Windows and Linux shells! (I just realized that Paddy [mentioned this one too…](https://dev.to/paddymorgan84/wsl-2-and-terminals-28d7))

Also, I’ve always found the methods of getting to an admin command prompt annoying. [Gsudo](https://github.com/gerardog/gsudo) makes it as straightforward as it is on Linux.
