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
import rehypeAutolinkHeadings, { type Options as AutolinkOptions } from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'

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

const vegaSimpleChart: MergeDataOptions = {
  lang: 'kroki',
  meta: { type: "vegalite" },
  data: merge({}, vegaBase, {
    data: {
      values: [
        // {y: "measurementName", x: value},
      ]
    },
    layer: [{
      mark: {
        type: "bar", orient: "horizontal", height: { band: 0.75 }
      },
      encoding: {
        y: {
          field: "y",
          type: "nominal",
          title: "",
          sort: null,
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
      mark: {
        type: "text", align: "left", dx: 3
      },
      encoding: {
        y: { field: "y", type: "nominal", sort: null },
        x: { field: "x", type: "quantitative" },
        text: { field: "x", type: "quantitative" }
      }
    }]
  })
}

const vegaStackedChart: MergeDataOptions = {
  lang: 'kroki',
  meta: { type: "vegalite", kind: "stacked" },
  data: merge({}, vegaBase, {
    data: {
      values: [
        // {y: "measurementName", type: "type", x: value},
      ]
    },
    mark: {
      type: "bar", orient: "horizontal", height: { band: 0.75 }
    },
    encoding: {
      y: { field: "y", title: "", axis: { zindex: 1 }, sort: null },
      x: {
        field: "x",
        type: "quantitative",
        title: "" // overwrite for a label at the bottom!
      },
      color: {
        field: "type",
        legend: {
          orient: "bottom",
          title: ""
        }
      }
    }
  })
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
      [remarkMergeData, [vegaSimpleChart, vegaStackedChart]],
      remarkGfm,
      remarkSmartypants,
      [remarkKroki, {
        server: 'http://localhost:8000',
        output: "inline-svg"
      }],
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: "append",
        properties: {
          className: ["anchor-link"],
          "aria-hidden": "true",
          "tabindex": "-1"
        },
        content: {
          type: "element",
          tagName: "svg",
          properties: {
            className: ["anchor-icon"],
            viewBox: "0 0 16 16",
            width: 24,
            height: 24
          },
          children: [{
            type: "element",
            tagName: "path",
            properties: {
              fill: "currentColor",
              d: "M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"
            },
            children: []
          }]
        }
      } satisfies AutolinkOptions],
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