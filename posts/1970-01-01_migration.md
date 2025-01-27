---
title: Migrating from medium
publishDate: 1970-01-01
---

I probably won't copy all of my articles but I'm not a fan of the fact that I can't choose not to paywall things anymore.

```kroki type=vegalite alt=abc
{
  "width": 220,
  "height": 100,
  "title": "Runtime Performance Comparison",
  "data": {
    "values": [
      {"y": "LLRT WSL", "x": 608},
      {"y": "LLRT Windows", "x": 980},
      {"y": "Node WSL", "x": 25},
      {"y": "Node Windows", "x": 8}
    ]
  },
  "layer": [{
    "encoding": {
      "x": {
        "title": "Runtime (ms)"
      }
    }
  }]
}
```
