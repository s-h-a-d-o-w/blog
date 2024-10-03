// @ts-check
import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import mdx from '@astrojs/mdx'
import remarkGfm from 'remark-gfm'
import remarkSmartypants from 'remark-smartypants'
import rehypeExternalLinks from 'rehype-external-links'

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      host: true,
      watch: {
        usePolling: true,
      },
    },
  },
  site: process.env.NODE_ENV !=='production'? `http://localhost:4321/` : 'https://blog.letit.run/',
  integrations: [mdx(), svelte()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'light-plus',
        dark: 'dracula',
      },
    },
    remarkPlugins: [remarkGfm, remarkSmartypants],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
        },
      ],
    ],
  },
})
