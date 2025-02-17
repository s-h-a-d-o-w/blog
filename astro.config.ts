import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import svelte from '@astrojs/svelte'
import { defineConfig } from 'astro/config'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeRaw from 'rehype-raw'
import rehypeRewrite, { type RehypeRewriteOptions } from 'rehype-rewrite'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import merge from 'lodash-es/merge'
import { remarkKroki } from 'remark-kroki'
import { remarkMergeData, type MergeDataOptions } from 'remark-merge-data'

// Remove opaque background
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

// Commented out props should usually be provided by the individual charts.
const vegaBase = {
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  // width: ...,
  // height: ...,
  // title: "...",
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
}

const vegaSimple = merge({}, vegaBase,{
  data: {
    values: [
      // {y: "measurementName", x: value},
    ]
  },
  layer: [{
    mark: {
      type: "bar",
      orient: "horizontal",
      height: { band: 0.75 }
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
  }, {
    mark: { type: "text", align: "left", dx: 3 },
    encoding: {
      y: { field: "y", type: "nominal" },
      x: { field: "x", type: "quantitative" },
      text: { field: "x", type: "quantitative" }
    }
  }]
})

const mergeDataProps: MergeDataOptions = {
  lang: 'kroki',
  meta: { type: "vegalite" },
  data: vegaSimple
}

const vegaStackedProps: MergeDataOptions = {
  lang: 'kroki',
  meta: { type: "vegalite", kind: "stacked" },
  data: vegaBase
}

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      host: true,
      watch: {
        usePolling: true,
      },
    },
    // See https://www.fparedes.com/blog/solve-js-api-deprecation-in-dart-sass-in-astro/
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    }
  },
  site: process.env.NODE_ENV !== 'production' ? `http://localhost:4321/` : 'https://aop.software/',
  integrations: [mdx(), svelte(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'light-plus',
        dark: 'dracula',
      },
    },
    remarkPlugins: [
      [remarkMergeData, [mergeDataProps, vegaStackedProps]],
      remarkGfm,
      remarkSmartypants,
      [remarkKroki, {
        server: 'http://localhost:8000',
        alias: ['plantuml'],
        output: "inline-svg"
      }],
    ],
    rehypePlugins: [
      rehypeRaw,
      [rehypeRewrite, rewriteKrokiSVG],
      [
        rehypeExternalLinks,
        {
          target: '_blank',
        },
      ],
    ],
  },
})