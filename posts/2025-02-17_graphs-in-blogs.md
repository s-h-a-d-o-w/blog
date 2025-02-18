---
title: Create beautiful (and somewhat responsive and accessible) graphs with just JSON/YAML for your markdown blog
publishDate: 2025-02-17
---

If your setup already uses or at least supports remark and rehype, this is how you'll be able to create a bar chart like in my article ...:

````json
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
````

It does require a bit of config though. Let's start at the end. Because maybe you're wondering "Is that really everything?" Yeah not quite.

## Shared graph config

Unless your graphs are all one-offs, you'll also need to declare some shared properties for how your graphs should look like. Which may look something like this (depending on your IDE, the hex values provide a preview): 

```ts
const vegaSimpleChart = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  config: {
    font: "Merriweather",
    title: {
      fontSize: 16,
      fontWeight: "bold",
      offset: 16
    },
    axis: {
      labelPadding: 8,
      labelFontSize: 12,
      titleFontSize: 12,
      titlePadding: 8
    },
    text: {
      fontSize: 12
    },
    range: {
      category: [
        "hsl(298 67% 61% / 1)", // #d35cdb
        "hsl(123 67% 61% / 1)", // #5cdb60
        "hsl(57 85% 61% / 1)",  // #e6db4d
        "hsl(0 85% 61% / 1)",   // #e64d4d
        "hsl(239 67% 61% / 1)", // #5c5edb
        "hsl(35 67% 61% / 1)",  // #dba85c
        "hsl(174 67% 61% / 1)"  // #5cdbcc
      ]
    }
  },
  mark: {
    type: "bar", orient: "horizontal", height: { band: 0.75 }
  },
  encoding: {
    y: {
      field: "y",
      type: "nominal",
      title: "",
      // See: https://github.com/vega/vega-lite/issues/9514#issuecomment-2613242331
      axis: { zindex: 1 }
    },
    x: {
      field: "x",
      type: "quantitative",
      title: "" // overwrite for a label at the bottom!
    },
    color: {
      field: "y",
      type: "nominal",
      legend: null
    }
  }
}
```

I would recommend not using relative units such as `rem`, since with graphs, there's usually not a lot of tolerance for scaling text after the fact.

If this isn't too much for you, the rest isn't as big of a deal in my opinion.

## Wiring up the remark/rehype plugins

Just install `remark-merge-data remark-kroki` and add them to your remark/rehype setup (if you've e.g. set up your blog using astro, it'll probably already be in your astro config) like so:

```ts
remarkPlugins: [
  [remarkMergeData, [vegaSimpleChart]],
  [remarkKroki, {
    server: 'http://localhost:8000',
    output: "inline-svg"
  }],
],
```

## Actually rendering the graphs

The rendering is done by the kroki server that you just run during dev or building.

Keep in mind that whatever font you use has to exist on the server and client! One option is to add custom fonts like I'm showing in a `Dockerfile` below or maybe picking a [modern font stack](https://github.com/system-fonts/modern-font-stacks) where the overall text width is similar across different platforms.

```docker
FROM yuzutech/kroki:latest

USER root
RUN apt-get update && apt-get install -y fontconfig wget

RUN mkdir -p /usr/share/fonts/truetype/merriweather
RUN cd /usr/share/fonts/truetype/merriweather && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-400-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-700-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-900-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-400-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-700-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-900-normal.ttf
RUN chmod 644 /usr/share/fonts/truetype/merriweather/*.ttf && \
    fc-cache -f && \
    rm -rf /var/cache/*

USER kroki
```

`docker-compose.yml`:

```yaml
services:
  kroki:
    build: .
    ports:
      - "8000:8000"
    restart: unless-stopped
```

An example using astro: `docker compose -f docker-compose.yml up -d && astro build && docker compose -f docker-compose.yml down`

And that's it on a base level.

## Responsiveness

While there isn't much leeway in terms of scaling, I found that I was able to get away with the following. It's key to have kroki render at the larger font size that used for mobile and then scale the font down on larger devices, since text might "grow" to overlap each other or parts of the graph otherwise.

```css
.kroki-inline-svg {
  @media (min-width: 480px) {
    .role-axis text,
    .role-mark text {
      font-size: 10px;
    }

    .role-title text {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    width: 100vw;
    margin: 0;
    left: -2em;
    position: relative;
    padding: 0 0.5em;
  }
}
```

## Accessibility

The following experiences are based on my vegalite bar charts but the concepts probably apply to charts in general.

**⚠️ If the order is important when reading your graph, watch out whether things are rendered in the order that you declared them! For example, vegalite sorts them before rendering. But one can override the order by declaring a custom sort order in the axis encoding.**

As I had to realize, accessible graphs are difficult. It's not like you can just highlight or hover the graph and expect the screen reader to simply read the text elements (which also depends on how a certain graphing engine renders things). Out of the box, the behavior for the graphs in the aforementioned article is as follows:

### Windows 11, NVDA with mouse input

✅ Bars are read correctly.  
❌ Titles can't be read. (Can be fixed by removing the `role` and `pointer-events` attributes. But then the reading with touch input is worse.)

### Windows 11, NVDA with touch input

✅ Bars are read correctly.  
🤷 Titles are read but usually only if you tap one of the bars first.

### Android TalkBack

🤷 Everything is read but from the bottom up (at least if you don't just drag your finger around the screen but instead swipe right/left to trigger "read next/previous"). So in this case: x-axis description, bars, bar values (the values rendered next to the bars), graph title.

## Some further tips 

### Transparent background

You can remove the background layer using `rehype-raw` and `rehype-rewrite`:

```ts
const rewriteKrokiSVG: RehypeRewriteOptions = {
  selector: ".kroki-inline-svg svg",
  rewrite: (node) => {
    if (node.type === "element") {
      delete node.properties.height;
      delete node.properties.width;

      node.children.forEach((child, index) => {
        if (child.type === "element" && child.tagName === "rect") {
          node.children.splice(index, 1)
        }
      })
    }
  }
}

// ...

    rehypePlugins: [
      rehypeRaw,
      [rehypeRewrite, rewriteKrokiSVG],
    ],
```

### Prototyping

Unless you want to replicate my exact same setup (which is actually slightly more elaborate than what I've described here since I also used a stacked bar chart - you can see all of it [here](https://github.com/s-h-a-d-o-w/blog/blob/master/astro.config.ts)), at least for vegalite, I'd strongly recommend a combination of AI, [their excellent examples](https://vega.github.io/vega-lite/examples/) and [their editor](https://vega.github.io/editor/). Because vega is a bit obscure and the editor lets you easily validate whether AI hallucinates.

## References

- ["Remark (and Rehype) all the things"](https://jordemort.dev/blog/remark-all-the-things/) by [@jordemort](https://github.com/jordemort) - This article got me started off on my journey, explains the `rehype-rewrite` workflow and discusses some other topics.
