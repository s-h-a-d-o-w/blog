import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import rehypeExternalLinks from 'rehype-external-links'
import remarkMermaid from 'remark-mermaidjs'
import type { RemarkMermaidOptions } from 'remark-mermaidjs'
import sitemap from '@astrojs/sitemap';
// @ts-expect-error
import { remarkKroki } from 'remark-kroki';
import type { RemarkPlugin } from "@astrojs/markdown-remark"
import { visit } from 'unist-util-visit'
import rehypeRewrite, { type RehypeRewriteOptions } from 'rehype-rewrite';
import rehypeRaw from 'rehype-raw'
import { isMatch, merge } from 'lodash-es'
import type { TopLevelSpec } from 'vega-lite';

const remarkMermaidOptions: RemarkMermaidOptions = {
  mermaidConfig: {
    // Custom font might be possible once the following is resolved:
    // https://github.com/mermaid-js/mermaid/issues/1540#issuecomment-2609688846
    // fontFamily: 'Merriweather',
    // themeCSS: `
    //   @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=block');
    //   `,

    fontFamily: '"Bitstream Charter", "Sitka Text", Cambria, serif',
    // fontFamily: 'serif',
    themeVariables: {
      xyChart: {
        backgroundColor: "#00000000",
      }
    },
    xyChart: {
      titleFontSize: 24,
      xAxis: {
        labelFontSize: 16
      },
      yAxis: {
        labelFontSize: 16
      }
    }
  }
}

type MergeDataProps = {
  data: unknown
  lang: string

  isYaml?: boolean
  meta?: Record<string, string>
  parse?: (data: string) => unknown
  stringify?: (data: unknown) => string
}
const jsonStringify = (dataToStringify: unknown) => {
  return JSON.stringify(dataToStringify, null, 2)
}

// Can be used to merge any JSON or YAML data in a matching code block with the provided data.
const remarkMergeData: RemarkPlugin<[MergeDataProps]> = ({ data, lang, isYaml, meta, parse, stringify }) => {
  const parseFunction = parse || JSON.parse
  const stringifyFunction = stringify || jsonStringify
  return (tree) => {
    visit(tree, 'code', function (node) {
      if (node.lang === lang) {
        console.log("lang matches")
        if (meta) {
          if (!node.meta) {
            return
          }
          const nodeMeta = Object.fromEntries(node.meta.split(" ").map(entry => {
            return entry.split("=")
          }) as [string, string][])
          if (!isMatch(nodeMeta, meta)) {
            // No metadata match found.
            return
          }
        }

        console.log("merging data")
        const documentData = parseFunction(node.value)
        node.value = stringifyFunction(merge(data, documentData))
      }
    })
  }
}

const rewriteKrokiSVG: RehypeRewriteOptions = {
  selector: ".kroki-inline-svg svg",
  rewrite: (node) => {
    console.log("matches")
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

const vegaGlobals: TopLevelSpec = {
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
      category: ["#d35cdb", "#5cdb60", "#dbd55c", "#db5c5c", "#5c5edb", "#dba85c", "#5cdbcc"]
    }
  },
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
}

const mergeDataProps: MergeDataProps = {
  lang: 'kroki',
  meta: {type: "vegalite"},
  data: vegaGlobals
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
  site: process.env.NODE_ENV !== 'production' ? `http://localhost:4321/` : 'https://blog.letit.run/',
  integrations: [mdx(), svelte(), sitemap()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'light-plus',
        dark: 'dracula',
      },
    },
    remarkPlugins: [
      [remarkMergeData, mergeDataProps],
      remarkGfm,
      remarkSmartypants,
      [remarkKroki, {
        server: 'http://localhost:8000',
        alias: ['plantuml'],
        output: "inline-svg"
      }],
      [remarkMermaid, remarkMermaidOptions]],
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