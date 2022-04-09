import { NuxtModule } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface NuxtConfig {
    ["daim"]?: typeof import("daim-ui").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
  }
  interface PublicRuntimeConfig {
     app: {
        baseURL: string,

        buildAssetsDir: string,

        cdnURL: string,
    },
  }
  interface PrivateRuntimeConfig {
  
  }
}