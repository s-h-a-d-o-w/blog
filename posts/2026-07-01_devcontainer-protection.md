---
title: Use devcontainers to protect your personal data from coding agents
publishDate: 2026-07-01
lastUpdated: 2026-07-07
---

Did you know that this phrase in [Cursor's agent security policy](https://cursor.com/docs/agent/security#first-party-tool-calls) doesn't refer to the workspace that's being used but **the whole file system**?

> Reading files and searching code don't require approval.

I discovered this when, while asking a question, the LLM unnecessarily read my `.bashrc`.

## What's the problem anyway? 

In case you're not protective of your personal data or are just using a company machine strictly for business anyway, here's one reason you may not have considered: SSH keys. An attacker might be able to pose as you wherever you use those keys.

Also, I recently caught an agent running any terminal commands that it wanted to even though it was supposed to prompt for anything that's not on the "allowlist".

## How to

vscode-based IDEs usually offer GUI ways of creating the necessary config file (which I believe is what templates are used for) but I would recommend just creating `.devcontainer/devcontainer.json` manually, since it's very straightforward.

Simplest is copy/pasting variations of it in all of your projects. Like e.g.:
```json
{
  "image": "mcr.microsoft.com/devcontainers/javascript-node:24"
}
```

Then just open/reopen that workspace in the IDE and it'll ask whether you want to reopen it in the container. Actually, **the very first time**, it'll ask you to install the dev container extension that makes everything possible.

Once you've opened a project in a devcontainer, it'll show up in the recents with *[Dev Container]*. The devcontainer also isn't rebuilt every time. After the initial building, it opens in just a few seconds.

## More than just a base image

A slightly more elaborate example where *pulumi*, *kubectl* and *direnv* are installed too and an init script for customizing the shell is run:
```json
{
  "image": "mcr.microsoft.com/devcontainers/javascript-node:24",

  "postCreateCommand": "curl -o- https://raw.githubusercontent.com/s-h-a-d-o-w/my-os-basics/refs/heads/main/init.sh | bash -s -- no-nvm no-user-host-in-prompt",

  "features": {
    "ghcr.io/devcontainers-extra/features/direnv:1": {},
    "ghcr.io/devcontainers/features/kubectl-helm-minikube:1": {},
    "ghcr.io/devcontainers-extra/features/pulumi:1": {}
  }
}
```

Lists of available base images are [here](https://github.com/devcontainers/images/tree/main/src) and features [here](https://containers.dev/features).

## Sharing config

You can just put most declarations into a file in a feature repo (like [mine here](https://github.com/s-h-a-d-o-w/devcontainers-features) or [the official starter](https://github.com/devcontainers/feature-starter)) and then use it as your own feature:
```json
{
  "image": "mcr.microsoft.com/devcontainers/javascript-node:24",

  "features": {
    "ghcr.io/s-h-a-d-o-w/devcontainers-features/js-k8s": {}
  }
}
```

Simply bump the version in the feature json file as you make changes and then trigger the manual github workflow that publishes the necessary container to ghcr.

## Basic IDE usage tips

- If you like right clicking files and doing *Open Containing Folder*, get my extension *Devcontainer Open Containing Folder*: [VS Marketplace](https://marketplace.visualstudio.com/items?itemName=s-h-a-d-o-w.devcontainer-open-containing-folder), [Open VSX](https://open-vsx.org/extension/s-h-a-d-o-w/devcontainer-open-containing-folder)
- If you miss the *Reopen* popup that I mentioned above, there's also a *Reopen in Container* available from the command palette. And in vanilla vscode, you can click the *Connect* button on the very bottom left and pick *Reopen in Container* there.
- Whenever you change something in your devcontainer config, you have to click the *Connect* button and do *Rebuild container*.
- While there are those hooks for running commands at different stages, I recommend checking whether features can't do those things first. Like e.g. the [*apt* feature](https://github.com/devcontainers-extra/features/tree/main/src/apt-packages) if you have to install a few libraries to compile something on Linux.
- Running e.g. playwright headed can be as simple as this, if you use Linux with X11. (You can find info for macOS and Windows [here](https://www.oddbird.net/2022/11/30/headed-playwright-in-docker/). But AI may already know how to do X11 forwarding on your OS.)
```json
  "containerEnv": {
    "DISPLAY": "${localEnv:DISPLAY}"
  },
  "mounts": ["source=/tmp/.X11-unix,target=/tmp/.X11-unix,type=bind"],
```
