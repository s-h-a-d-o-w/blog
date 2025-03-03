import { OGImageRoute } from 'astro-og-canvas';
import type { MarkdownInstance } from 'astro';
import type { FrontMatter } from '../../types';

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages: import.meta.glob('/posts/*.md', { eager: true }),
  getImageOptions: (_, { frontmatter: { title } }: MarkdownInstance<FrontMatter>) => {
    return {
      title: '@aop.software',
      description: title,
      bgGradient: [[32, 33, 34]],
      border: {
        color: [211, 92, 219],
        width: 10,
        side: 'inline-start'
      },
      font: {
        title: {
          families: ['Merriweather'],
          lineHeight: 4,
          size: 30
        },
        description: {
          families: ['Fira Sans'],
          lineHeight: 1.3,
          size: 60
        }
      },
      fonts: ['public/assets/fonts/FiraSans.woff2', 'public/assets/fonts/Merriweather.woff2']
    }
  },
});