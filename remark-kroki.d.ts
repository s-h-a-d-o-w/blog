declare module 'remark-kroki' {
  export interface KrokiOptions {
    server?: string
    alias?: string[]
    output?: string
  }

  export const remarkKroki: (options: KrokiOptions) => void
}