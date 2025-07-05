TITLE: Use sanityFetch in Next.js generateMetadata (TS)
DESCRIPTION: Illustrates using `sanityFetch` within the `generateMetadata` function in Next.js to dynamically set page metadata based on Sanity data. It's crucial to set `stega: false` when fetching data for metadata to avoid including steganography markers in the output.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_29

LANGUAGE: TS
CODE:

```
import {sanityFetch} from '@/sanity/lib/live'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({
    query: SETTINGS_QUERY,
    // Metadata should never contain stega
    stega: false,
  })
  return {
    title: {
      template: `%s | ${data.title}`,
      default: data.title,
    },
  }
}
```

---

TITLE: Render Sanity Live and Visual Editing in Next.js Layout (TSX)
DESCRIPTION: This snippet shows how to include the `<SanityLive />` and `<VisualEditing />` components in the root `layout.tsx` file of a Next.js application. `<SanityLive />` makes `sanityFetch` calls live, while `<VisualEditing />` is conditionally rendered based on Next.js Draft Mode.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_27

LANGUAGE: TSX
CODE:

```
// src/app/layout.tsx

import {VisualEditing} from 'next-sanity'
import {SanityLive} from '@/sanity/lib/live'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  )
}
```

---

TITLE: Quick Start: Initialize Sanity Project with next-sanity
DESCRIPTION: Run this command in your Next.js project directory to quickly initialize a new Sanity project or link to an existing one, setting up basic query utilities and optionally embedding the Studio.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_0

LANGUAGE: bash
CODE:

```
npx sanity@latest init

```

---

TITLE: Page with Live Query for Draft Mode (TSX)
DESCRIPTION: Modified Next.js page component that uses `LiveQuery` from `next-sanity/preview/live-query` to enable real-time updates in draft mode. It fetches initial data with `sanityFetch` and passes it to `LiveQuery`, specifying a separate component (`PreviewDocumentsCount`) for rendering in preview mode.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/PREVIEW-app-router.md#_snippet_7

LANGUAGE: tsx
CODE:

```
import {draftMode} from 'next/headers'
import {LiveQuery} from 'next-sanity/preview/live-query'
import DocumentsCount, {query} from 'components/DocumentsCount'
import PreviewDocumentsCount from 'components/PreviewDocumentsCount'
import {sanityFetch} from 'lib/sanity.fetch'

export default async function IndexPage() {
  const data = await sanityFetch<number>({query, tags: ['post']})

  return (
    <LiveQuery
      enabled={draftMode().isEnabled}
      query={query}
      initialData={data}
      as={PreviewDocumentsCount}
    >
      <DocumentsCount data={data} />
    </LiveQuery>
  )
}
```

---

TITLE: Initializing Sanity Client and Fetch Helper (TypeScript)
DESCRIPTION: Initializes the Sanity client with project configuration and defines a `sanityFetch` helper function. This function wraps `client.fetch` to integrate Next.js caching options like time-based `revalidate` and tag-based `tags`, prioritizing tags if provided.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_10

LANGUAGE: TypeScript
CODE:

```
// ./src/sanity/lib/client.ts

import {createClient, type QueryParams} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 60, // default revalidation time in seconds
  tags = [],
}: {
  query: QueryString
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}) {
  return client.fetch(query, params, {
    cache: 'force-cache', // on next v14 it's force-cache by default, in v15 it has to be set explicitly
    next: {
      revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation
      tags, // for tag-based revalidation
    },
  })
}
```

---

TITLE: Configuring Sanity Environment Variables in Next.js
DESCRIPTION: Creates a local environment file to store Sanity project ID and dataset name, making them accessible to the Next.js application via `process.env`. These values are not considered sensitive.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_4

LANGUAGE: bash
CODE:

```
# .env.local

NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=<your-dataset-name>
```

---

TITLE: Configuring Sanity Client in TypeScript
DESCRIPTION: Demonstrates how to create and configure the Sanity client instance using `next-sanity`. It shows importing necessary environment variables and setting `projectId`, `dataset`, `apiVersion`, and `useCdn`.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_13

LANGUAGE: typescript
CODE:

```
// ./src/sanity/lib/client.ts
import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
```

---

TITLE: Configuring Sanity Client in Next.js (TypeScript)
DESCRIPTION: This snippet demonstrates how to create and configure the Sanity client instance in a Next.js application using TypeScript. It imports necessary environment variables and sets up the client with project details, API version, and CDN usage options.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_7

LANGUAGE: ts
CODE:

```
// ./src/sanity/lib/client.ts
import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})
```

---

TITLE: Fetching Sanity Data with Draft Mode (TSX)
DESCRIPTION: Defines an asynchronous function `sanityFetch` to fetch data from Sanity, supporting draft mode. It checks `draftMode().isEnabled` and requires a `SANITY_API_READ_TOKEN` for draft mode. It uses the configured Sanity client and sets fetch options based on draft mode status, including revalidation and tags.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/PREVIEW-app-router.md#_snippet_2

LANGUAGE: tsx
CODE:

```
import 'server-only'

import {draftMode} from 'next/headers'
import type {QueryOptions, QueryParams} from 'next-sanity'

import {client} from './sanity.client'

export const token = process.env.SANITY_API_READ_TOKEN

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}) {
  const isDraftMode = draftMode().isEnabled
  if (isDraftMode && !token) {
    throw new Error('The `SANITY_API_READ_TOKEN` environment variable is required.')
  }

  return client.fetch<QueryResponse>(query, params, {
    ...(isDraftMode &&
      ({
        token: token,
        perspective: 'drafts',
      } satisfies QueryOptions)),
    next: {
      revalidate: isDraftMode ? 0 : false,
      tags,
    },
  })
}
```

---

TITLE: Handle Sanity Webhook Revalidation in Next.js API Route (TypeScript)
DESCRIPTION: This code defines a Next.js API route (`POST`) that receives a request, validates it, and then calls `revalidateTag` for each provided tag, prefixed with `sanity:`. This is intended to be triggered by a Sanity webhook or a custom server listening to LCAPI events to ensure content freshness via ISR.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_38

LANGUAGE: TypeScript
CODE:

```
// src/app/api/revalidate-tag/route.ts
import {revalidateTag} from 'next/cache'

export const POST = async (request) => {
  const {tags, isValid} = await validateRequest(request)
  if (!isValid) return new Response('No no no', {status: 400})
  for (const _tag of tags) {
    const tag = `sanity:${_tag}`
    revalidateTag(tag)
    // eslint-disable-next-line no-console
    console.log(`revalidated tag: ${tag}`)
  }
}
```

---

TITLE: Installing Sanity Dependencies with npm (Bash)
DESCRIPTION: Installs the necessary packages (`next-sanity`, `server-only`, `suspend-react`) for setting up Sanity live previews and data fetching in a Next.js app router project.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/PREVIEW-app-router.md#_snippet_0

LANGUAGE: bash
CODE:

```
npm i next-sanity@latest server-only suspend-react
```

---

TITLE: Defining Sanity Client and `sanityFetch` Helper (TypeScript)
DESCRIPTION: Configures the Sanity client and implements the `sanityFetch` helper function. This function wraps `client.fetch` to integrate Next.js caching options (`revalidate` and `tags`), prioritizing tags over time-based revalidation when both are provided.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_16

LANGUAGE: TypeScript
CODE:

```
// ./src/sanity/lib/client.ts

import {createClient, type QueryParams} from 'next-sanity'

import {apiVersion, dataset, projectId} from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

export async function sanityFetch<const QueryString extends string>({
  query,
  params = {},
  revalidate = 60, // default revalidation time in seconds
  tags = [],
}: {
  query: QueryString
  params?: QueryParams
  revalidate?: number | false
  tags?: string[]
}) {
  return client.fetch(query, params, {
    cache: 'force-cache', // on next v14 it's force-cache by default, in v15 it has to be set explicitly
    next: {
      revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation
      tags, // for tag-based revalidation
    },
  })
}
```

---

TITLE: Fetching Data in Next.js App Router (TSX)
DESCRIPTION: This example shows how to fetch data from Sanity within a React Server Component using the Next.js App Router. It imports the configured Sanity client and a query, then uses `client.fetch` to retrieve data asynchronously before rendering a list.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_8

LANGUAGE: tsx
CODE:

```
// ./src/app/page.tsx

import {client} from '@/sanity/lib/client'
import {POSTS_QUERY} from '@/sanity/lib/queries'

export default async function PostIndex() {
  const posts = await client.fetch(POSTS_QUERY)

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>
          <a href={`/posts/${post?.slug.current}`}>{post?.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

---

TITLE: Creating Next.js API Route for Sanity Webhook Revalidation (TypeScript)
DESCRIPTION: Implements a Next.js API route (/api/revalidate-tag) that receives webhook payloads from Sanity, validates the signature using a shared secret, and calls revalidateTag based on the document type in the payload. Requires next-sanity/webhook and next/cache.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_18

LANGUAGE: ts
CODE:

```
// ./src/app/api/revalidate-tag/route.ts

import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Missing environment variable SANITY_REVALIDATE_SECRET', {status: 500})
    }

    const {isValidSignature, body} = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(JSON.stringify({message, isValidSignature, body}), {status: 401})
    } else if (!body?._type) {
      const message = 'Bad Request'
      return new Response(JSON.stringify({message, body}), {status: 400})
    }

    // If the `_type` is `post`, then all `client.fetch` calls with
    // `{next: {tags: ['post']}}` will be revalidated
    revalidateTag(body._type)

    return NextResponse.json({body})
  } catch (err) {
    console.error(err)
    return new Response(err.message, {status: 500})
  }
}
```

---

TITLE: Rendering Embedded Sanity Studio with Next.js App Router (TSX)
DESCRIPTION: Defines a Next.js App Router page component (page.tsx) that renders the embedded Sanity Studio using the NextStudio component. It imports the configuration from sanity.config.ts and exports default metadata and viewport settings from next-sanity/studio. Sets dynamic rendering to force-static.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_42

LANGUAGE: TSX
CODE:

```
// ./src/app/studio/[[...tool]]/page.tsx

import {NextStudio} from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export {metadata, viewport} from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

---

TITLE: Implementing Sanity Webhook Revalidation API Route in Next.js (TypeScript)
DESCRIPTION: Creates a Next.js API route (`/api/revalidate-tag`) that receives Sanity webhook payloads. It validates the request signature using a shared secret and triggers `revalidateTag` based on the document `_type` in the payload. Requires `next/cache`, `next/server`, `next-sanity/webhook`, and the `SANITY_REVALIDATE_SECRET` environment variable.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_24

LANGUAGE: typescript
CODE:

```
// ./src/app/api/revalidate-tag/route.ts

import {revalidateTag} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Missing environment variable SANITY_REVALIDATE_SECRET', {status: 500})
    }

    const {isValidSignature, body} = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(JSON.stringify({message, isValidSignature, body}), {status: 401})
    } else if (!body?._type) {
      const message = 'Bad Request'
      return new Response(JSON.stringify({message, body}), {status: 400})
    }

    // If the `_type` is `post`, then all `client.fetch` calls with
    // `{next: {tags: ['post']}}` will be revalidated
    revalidateTag(body._type)

    return NextResponse.json({body})
  } catch (err) {
    console.error(err)
    return new Response(err.message, {status: 500})
  }
}
```

---

TITLE: Handling Tag Revalidation in Next.js API Route (TypeScript)
DESCRIPTION: This Next.js API route handles POST requests to revalidate specific cache tags. It expects a payload containing tags and a validation status. If valid, it iterates through the provided tags, prefixes them with 'sanity:', and calls `revalidateTag` to purge the Next.js cache for those tags. This route is intended to be called by an external process, such as a server listening to Sanity change events.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_32

LANGUAGE: TypeScript
CODE:

```
// src/app/api/revalidate-tag/route.ts
import {revalidateTag} from 'next/cache'

export const POST = async (request) => {
  const {tags, isValid} = await validateRequest(request)
  if (!isValid) return new Response('No no no', {status: 400})
  for (const _tag of tags) {
    const tag = `sanity:${_tag}`
    revalidateTag(tag)
    // eslint-disable-next-line no-console
    console.log(`revalidated tag: ${tag}`)
  }
}
```

---

TITLE: Configuring Sanity Presentation Tool for Draft Mode (TS)
DESCRIPTION: This code shows how to configure the `presentationTool` plugin in `sanity.config.ts` to integrate with the Next.js Draft Mode API route. Setting `previewMode.enable` to the API route path (`/api/draft-mode/enable`) allows the Presentation Tool to automatically enable Draft Mode when needed.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_26

LANGUAGE: ts
CODE:

```
// sanity.config.ts
'use client'

import {defineConfig} from 'sanity'
import {presentationTool} from 'next-sanity'

export default defineConfig({
  // ...
  plugins: [
    // ...
    presentationTool({
      previewUrl: {
        // ...
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],
})
```

---

TITLE: Defining API Route to Enable Next.js Draft Mode (TS)
DESCRIPTION: This snippet creates a Next.js API route (`/api/draft-mode/enable`) using `defineEnableDraftMode` from `next-sanity/draft-mode`. This route handles enabling Draft Mode, integrating with Sanity Presentation Tool features like the perspective switcher and preview URL sharing. It requires a Sanity client configured with a token.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_25

LANGUAGE: ts
CODE:

```
// src/app/api/draft-mode/enable/route.ts

import {client} from '@/sanity/lib/client'
import {token} from '@/sanity/lib/token'
import {defineEnableDraftMode} from 'next-sanity/draft-mode'

export const {GET} = defineEnableDraftMode({
  client: client.withConfig({token}),
})
```

---

TITLE: Root Layout with Live Preview Provider (TSX)
DESCRIPTION: Modified Next.js root layout component to conditionally wrap children with a `PreviewProvider` when draft mode is enabled. It dynamically imports the `PreviewProvider` component and passes the Sanity read token to it.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/PREVIEW-app-router.md#_snippet_6

LANGUAGE: tsx
CODE:

```
import dynamic from 'next/dynamic'
import {draftMode} from 'next/headers'
import {token} from 'lib/sanity.fetch'

const PreviewProvider = dynamic(() => import('components/PreviewProvider'))

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {draftMode().isEnabled ? (
          <PreviewProvider token={token}>{children}</PreviewProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
```

---

TITLE: Fetching Data with sanityFetch in Next.js Server Component (TSX)
DESCRIPTION: This code demonstrates using `sanityFetch` within a Next.js server component (`products.tsx`) to retrieve a list of products from Sanity. It defines a GROQ query (`PRODUCTS_QUERY`) and passes parameters (`limit`) to `sanityFetch`, then renders the fetched data.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_22

LANGUAGE: tsx
CODE:

```
// src/app/products.tsx

import {defineQuery} from 'next-sanity'
import {sanityFetch} from '@/sanity/lib/live'

const PRODUCTS_QUERY = defineQuery(`*[_type == "product" && defined(slug.current)][0...$limit]`)

export default async function Page() {
  const {data: products} = await sanityFetch({
    query: PRODUCTS_QUERY,
    params: {limit: 10},
  })

  return (
    <section>
      {products.map((product) => (
        <article key={product._id}>
          <a href={`/product/${product.slug}`}>{product.title}</a>
        </article>
      ))}
    </section>
  )
}
```

---

TITLE: Creating Sanity Webhook Revalidation API Route (TypeScript)
DESCRIPTION: Implements a Next.js API route (`/api/revalidate-path`) that receives webhook payloads from Sanity. It uses `next-sanity/webhook`'s `parseBody` to validate the request signature against a shared secret. If valid, it calls `revalidatePath` for the path specified in the payload. Requires `SANITY_REVALIDATE_SECRET` environment variable.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_14

LANGUAGE: ts
CODE:

```
// ./src/app/api/revalidate-path/route.ts

import {revalidatePath} from 'next/cache'
import {type NextRequest, NextResponse} from 'next/server'
import {parseBody} from 'next-sanity/webhook'

type WebhookPayload = {path?: string}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SANITY_REVALIDATE_SECRET) {
      return new Response('Missing environment variable SANITY_REVALIDATE_SECRET', {status: 500})
    }

    const {isValidSignature, body} = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      const message = 'Invalid signature'
      return new Response(JSON.stringify({message, isValidSignature, body}), {status: 401})
    } else if (!body?.path) {
      const message = 'Bad Request'
      return new Response(JSON.stringify({message, body}), {status: 400})
    }

    revalidatePath(body.path)
    const message = `Updated route: ${body.path}`
    return NextResponse.json({body, message})
  } catch (err) {
    console.error(err)
    return new Response(err.message, {status: 500})
  }
}
```

---

TITLE: Fetch Data with sanityFetch in Next.js Server Component (TSX)
DESCRIPTION: Demonstrates how to use `sanityFetch` within a Next.js server component (`products.tsx`) to retrieve data from Sanity. It defines a GROQ query using `defineQuery` and passes it to `sanityFetch` with parameters. The fetched data is then rendered in the component.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_28

LANGUAGE: TSX
CODE:

```
// src/app/products.tsx

import {defineQuery} from 'next-sanity'
import {sanityFetch} from '@/sanity/lib/live'

const PRODUCTS_QUERY = defineQuery(`*[_type == "product" && defined(slug.current)][0...$limit]`)

export default async function Page() {
  const {data: products} = await sanityFetch({
    query: PRODUCTS_QUERY,
    params: {limit: 10},
  })

  return (
    <section>
      {products.map((product) => (
        <article key={product._id}>
          <a href={`/product/${product.slug}`}>{product.title}</a>
        </article>
      ))}
    </section>
  )
}
```

---

TITLE: Sanity Live Query Provider Component (TSX)
DESCRIPTION: A client-side React component that wraps its children with `LiveQueryProvider` from `next-sanity/preview`. It uses `suspend-react` to asynchronously import the Sanity client and requires a `token` prop for authentication with the Sanity API for live updates.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/PREVIEW-app-router.md#_snippet_9

LANGUAGE: tsx
CODE:

```
'use client'

import LiveQueryProvider from 'next-sanity/preview'
import {suspend} from 'suspend-react'

// suspend-react cache is global, so we use a unique key to avoid collisions
const UniqueKey = Symbol('lib/sanity.client')

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token?: string
}) {
  const {client} = suspend(() => import('lib/sanity.client'), [UniqueKey])
  if (!token) throw new TypeError('Missing token')
  return (
    <LiveQueryProvider client={client} token={token} logger={console}>
      {children}
    </LiveQueryProvider>
  )
}
```

---

TITLE: Define Draft Mode Enable API Route with next-sanity (TS)
DESCRIPTION: Provides the code for setting up an API route (`/api/draft-mode/enable`) in Next.js using `defineEnableDraftMode` from `next-sanity/draft-mode`. This route is essential for integrating with Sanity Presentation Tool and enabling Draft Mode via a server endpoint. It requires a Sanity client configured with a token.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_31

LANGUAGE: TS
CODE:

```
// src/app/api/draft-mode/enable/route.ts

import {client} from '@/sanity/lib/client'
import {token} from '@/sanity/lib/token'
import {defineEnableDraftMode} from 'next-sanity/draft-mode'

export const {GET} = defineEnableDraftMode({
  client: client.withConfig({token}),
})
```

---

TITLE: Fetching Data with Tag-Based Revalidation (TSX)
DESCRIPTION: Demonstrates fetching data in a Next.js App Router component using `sanityFetch`. It includes the `tags` option to associate the fetched data with specific content types ('post', 'author'). This allows for efficient tag-based revalidation using `revalidateTag()` when content of these types changes.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_16

LANGUAGE: tsx
CODE:

```
// ./src/app/pages/index.tsx

import {sanityFetch} from '@/sanity/lib/client'
import {POSTS_QUERY} from '@/sanity/lib/queries'

export default async function PostIndex() {
  const posts = await sanityFetch({
    query: POSTS_QUERY,
    tags: ['post', 'author'], // revalidate all pages with the tags 'post' and 'author'
  })

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>
          <a href={`/posts/${post?.slug.current}`}>{post?.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

---

TITLE: Fetching Data with Time-based Revalidation (TSX)
DESCRIPTION: Example Next.js page component demonstrating how to use the `sanityFetch` helper function to fetch data. It sets a specific `revalidate` time (3600 seconds) to control how often the cache for this page is updated.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_11

LANGUAGE: TSX
CODE:

```
// ./src/app/pages/index.tsx

import {sanityFetch} from '@/sanity/lib/client'
import {POSTS_QUERY} from '@/sanity/lib/queries'

export default async function PostIndex() {
  const posts = await sanityFetch({
    query: POSTS_QUERY,
    revalidate: 3600, // update cache at most once every hour
  })

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>
          <a href={`/posts/${post?.slug.current}`}>{post?.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

---

TITLE: Configuring Sanity Live Content API with defineLive in Next.js (TypeScript)
DESCRIPTION: Initializes the Sanity client and configures the Live Content API using `defineLive`. It requires a read token with Viewer rights to fetch draft content and exports `sanityFetch` and `SanityLive` for use in the application. Requires `next-sanity` and environment variables `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_READ_TOKEN`.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_26

LANGUAGE: tsx
CODE:

```
// src/sanity/lib/live.ts

import {createClient, defineLive} from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
  apiVersion: 'v2025-03-04',
  stega: {studioUrl: '/studio'},
})

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error('Missing SANITY_API_READ_TOKEN')
}

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
```

---

TITLE: Custom Sanity Live Query Provider (v5) - React TSX
DESCRIPTION: This new client component is introduced in next-sanity v5 to replace `definePreview` and `PreviewSuspense`. It creates a Sanity client using `useMemo` and wraps its children with the `LiveQueryProvider` from `next-sanity/preview`.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/MIGRATE-v4-to-v5-app-router.md#_snippet_5

LANGUAGE: tsx
CODE:

```
'use client'

import {useMemo} from 'react'
import {LiveQueryProvider} from 'next-sanity/preview'
import {getClient} from 'lib/sanity.client'

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode
  token: string
}) {
  const client = useMemo(() => getClient({token}), [token])
  return <LiveQueryProvider client={client}>{children}</LiveQueryProvider>
}
```

---

TITLE: Configuring Sanity Studio with next-sanity (TypeScript)
DESCRIPTION: Defines the core configuration for the Sanity Studio using `defineConfig`. It sets the `basePath` for the Studio route, retrieves `projectId` and `dataset` from environment variables, includes the necessary `structureTool` plugin, and initializes an empty schema.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_34

LANGUAGE: ts
CODE:

```
// ./sanity.config.ts
'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/studio', // `basePath` must match the route of your Studio
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {types: []},
})
```

---

TITLE: Configure Sanity Presentation Tool Preview Mode (TS)
DESCRIPTION: Shows how to configure the `presentationTool` plugin in `sanity.config.ts` to enable the preview mode feature. This involves setting the `previewMode.enable` option within the `previewUrl` configuration to point to the draft mode enable API route (`/api/draft-mode/enable`).
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_32

LANGUAGE: TS
CODE:

```
// sanity.config.ts
'use client'

import {defineConfig} from 'sanity'
import {presentationTool} from 'next-sanity'

export default defineConfig({
  // ...
  plugins: [
    // ...
    presentationTool({
      previewUrl: {
        // ...
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
  ],
})
```

---

TITLE: Creating Sanity Client Instance (TSX)
DESCRIPTION: Initializes and exports a Sanity client instance using `createClient` from `next-sanity`. It configures the client with project ID, dataset, API version, and disables CDN for development, setting the perspective to 'published'. Requires environment variables for project ID and dataset.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/PREVIEW-app-router.md#_snippet_1

LANGUAGE: tsx
CODE:

```
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2022-11-15',
  useCdn: false,
  perspective: 'published',
})
```

---

TITLE: Use sanityFetch in Next.js generateStaticParams (TS)
DESCRIPTION: Shows how to use `sanityFetch` within the `generateStaticParams` function in Next.js to generate static routes based on Sanity data, such as post slugs. It's recommended to use the `'published'` perspective and set `stega: false` for this function.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_30

LANGUAGE: TS
CODE:

```
import {sanityFetch} from '@/sanity/lib/live'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: POST_SLUGS_QUERY,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}
```

---

TITLE: Configuring Sanity CLI with next-sanity (TypeScript)
DESCRIPTION: Sets up the Sanity CLI configuration using `defineCliConfig`. It uses the same `projectId` and `dataset` as the Studio configuration, allowing developers to run Sanity CLI commands directly from the Next.js project terminal.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_35

LANGUAGE: ts
CODE:

```
// ./sanity.cli.ts

import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineCliConfig({api: {projectId, dataset}})
```

---

TITLE: Fetching Data with Tag-based Revalidation (TSX)
DESCRIPTION: Demonstrates fetching data in a Next.js component using `sanityFetch` from `@/sanity/lib/client`. It specifies `tags: ['post', 'author']` to associate the fetched data with these tags, enabling tag-based revalidation via `revalidateTag()` when content related to these tags changes. Requires `@/sanity/lib/client` and `@/sanity/lib/queries`.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_22

LANGUAGE: tsx
CODE:

```
// ./src/app/pages/index.tsx

import {sanityFetch} from '@/sanity/lib/client'
import {POSTS_QUERY} from '@/sanity/lib/queries'

export default async function PostIndex() {
  const posts = await sanityFetch({
    query: POSTS_QUERY,
    tags: ['post', 'author'], // revalidate all pages with the tags 'post' and 'author'
  })

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>
          <a href={`/posts/${post?.slug.current}`}>{post?.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

---

TITLE: Rendering Documents Count with Preview (v5) - Next.js App Router TSX
DESCRIPTION: This is the updated main page component for next-sanity v5. It fetches initial data and, in preview mode, wraps the preview component (`PreviewDocumentsCount`) with a new custom `PreviewProvider` instead of `PreviewSuspense`.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/MIGRATE-v4-to-v5-app-router.md#_snippet_3

LANGUAGE: tsx
CODE:

```
import {draftMode} from 'next/headers'
import {DocumentsCount, query} from 'components/DocumentsCount'
import PreviewDocumentsCount from 'components/PreviewDocumentsCount'
import PreviewProvider from 'components/PreviewProvider'
import {getClient} from 'lib/sanity.client'

export default async function IndexPage() {
  const preview = draftMode().isEnabled ? {token: process.env.SANITY_API_READ_TOKEN} : undefined

  const data = await client.fetch(query)

  if (preview) {
    return (
      <PreviewProvider token={preview.token}>
        <PreviewDocumentsCount data={data} />
      </PreviewProvider>
    )
  }sass

  return <DocumentsCount data={data} />
}
```

---

TITLE: Fetching and Displaying Data in Page (TSX)
DESCRIPTION: An asynchronous Next.js page component that fetches data using the `sanityFetch` function and the `DocumentsCount` query. It then renders the `DocumentsCount` component with the fetched data. This is the page *before* adding live preview support.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/PREVIEW-app-router.md#_snippet_5

LANGUAGE: tsx
CODE:

```
import DocumentsCount, {query} from 'components/DocumentsCount'
import {sanityFetch} from 'lib/sanity.fetch'

export default async function IndexPage() {
  const data = await sanityFetch<number>({query, tags: ['post']})

  return <DocumentsCount data={data} />
}
```

---

TITLE: Exporting Sanity Environment Variables in TypeScript
DESCRIPTION: Defines and exports the Sanity project ID, dataset, and API version from a TypeScript file, allowing them to be imported and used throughout the application. It reads values from environment variables.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_5

LANGUAGE: ts
CODE:

```
// ./src/sanity/env.ts

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!

// Values you may additionally want to configure globally
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-11'
```

---

TITLE: Fetching Data in Next.js App Router with Sanity Client
DESCRIPTION: Shows how to fetch data asynchronously within a React Server Component in the Next.js App Router using the configured Sanity client. It demonstrates calling `client.fetch` and rendering the results.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_14

LANGUAGE: tsx
CODE:

```
// ./src/app/page.tsx

import {client} from '@/sanity/lib/client'
import {POSTS_QUERY} from '@/sanity/lib/queries'

export default async function PostIndex() {
  const posts = await client.fetch(POSTS_QUERY)

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>
          <a href={`/posts/${post?.slug.current}`}>{post?.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

---

TITLE: components/PreviewDocumentsCount.tsx (v5) - Using useLiveQuery
DESCRIPTION: Demonstrates the migrated `PreviewDocumentsCount` component using the `useLiveQuery` hook from `next-sanity` v5. It takes initial data and the query, handles the loading state, and renders the `DocumentsCount` component.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/MIGRATE-v4-to-v5-pages-router.md#_snippet_4

LANGUAGE: tsx
CODE:

```
import {useLiveQuery} from 'next-sanity/preview'
import {query, DocumentsCount} from 'components/DocumentsCount'

export default function PreviewDocumentsCount({data: initialData}) {
  const [data, loading] = useLiveQuery(initialData, query)

  if (loading) {
    return <>Loading...</>
  }

  return <DocumentsCount data={data} />
}
```

---

TITLE: Defining Sanity Webhook Revalidation Payload (GROQ)
DESCRIPTION: A GROQ query used in a Sanity webhook to define the payload sent to the Next.js API route. It dynamically constructs a `path` property based on the document type and slug, using GROQ's `select()` function. This example handles 'post' types and other types with a slug.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_15

LANGUAGE: groq
CODE:

```
{
  "path": select(
    _type == "post" => "/posts/" + slug.current,
    "/" + slug.current
  )
}
```

---

TITLE: Using `sanityFetch` for Time-Based Revalidation (TSX)
DESCRIPTION: Demonstrates fetching data in a Next.js page component using the `sanityFetch` helper with a specified `revalidate` time (3600 seconds), enabling time-based cache updates for the page.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_17

LANGUAGE: TSX
CODE:

```
// ./src/app/pages/index.tsx

import {sanityFetch} from '@/sanity/lib/client'
import {POSTS_QUERY} from '@/sanity/lib/queries'

export default async function PostIndex() {
  const posts = await sanityFetch({
    query: POSTS_QUERY,
    revalidate: 3600, // update cache at most once every hour
  })

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>
          <a href={`/posts/${post?.slug.current}`}>{post?.title}</a>
        </li>
      ))}
    </ul>
  )
}
```

---

TITLE: Adding Sanity TypeGen Scripts to package.json
DESCRIPTION: Updates the `scripts` section in `package.json` to include a `typegen` script that runs both schema extraction and type generation. It also adds `predev` and `prebuild` hooks to ensure types are generated before development or build processes.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_10

LANGUAGE: json
CODE:

```
"scripts": {
  "predev": "npm run typegen",
  "dev": "next",
  "prebuild": "npm run typegen",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typegen": "sanity schema extract --path=src/sanity/extract.json && sanity typegen generate"
}
```

---

TITLE: Rendering Sanity Live Components in Next.js Layout (TSX)
DESCRIPTION: This snippet shows how to include the `<SanityLive />` and `<VisualEditing />` components in the root Next.js layout (`layout.tsx`). `<SanityLive />` is essential for making `sanityFetch` calls live, while `<VisualEditing />` is conditionally rendered based on Next.js Draft Mode being enabled.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_21

LANGUAGE: tsx
CODE:

```
// src/app/layout.tsx

import {VisualEditing} from 'next-sanity'
import {SanityLive} from '@/sanity/lib/live'

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  )
}
```

---

TITLE: Configuring Sanity Studio in Next.js (TypeScript)
DESCRIPTION: Sets up the Sanity Studio configuration file (sanity.config.ts) for embedding within a Next.js application. It defines the base path for the Studio route, project ID, dataset, and includes the structure tool plugin. Requires environment variables for project ID and dataset.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_40

LANGUAGE: TypeScript
CODE:

```
// ./sanity.config.ts
'use client'

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!

export default defineConfig({
  basePath: '/studio', // `basePath` must match the route of your Studio
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {types: []},
})
```

---

TITLE: pages/index.tsx (v5) - Migrated Setup
DESCRIPTION: Shows the migrated `pages/index.tsx` using `next-sanity` v5. It replaces `PreviewSuspense` with `PreviewProvider` and removes the lazy loading of the preview component. Data fetching in `getStaticProps` is simplified.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/MIGRATE-v4-to-v5-pages-router.md#_snippet_3

LANGUAGE: tsx
CODE:

```
import {DocumentsCount, query} from 'components/DocumentsCount'
import PreviewDocumentsCount from 'components/PreviewDocumentsCount'
import PreviewProvider from 'components/PreviewProvider'
import {getClient} from 'lib/sanity.client'

export const getStaticProps = async (context) => {
  const {token} = context.previewData ?? {}
  const preview = context.preview ? {token} : undefined
  const client = getClient(preview)

  const data = await client.fetch(query)
  return {props: {preview, data}}
}

export default function IndexPage({preview, data}) {
  if (preview) {
    return (
      <PreviewProvider token={preview.token}>
        <PreviewDocumentsCount data={data} />
      </PreviewProvider>
    )
  }

  return <DocumentsCount data={data} />
}
```

---

TITLE: Using sanityFetch in Next.js generateStaticParams (TS)
DESCRIPTION: This code demonstrates using `sanityFetch` within Next.js's `generateStaticParams` function to fetch data needed for static path generation. It specifies `perspective: 'published'` to ensure only published content is used and sets `stega: false` as recommended for these functions.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_24

LANGUAGE: ts
CODE:

```
import {sanityFetch} from '@/sanity/lib/live'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: POST_SLUGS_QUERY,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}
```

---

TITLE: Initialize Sanity Client (pages-router)
DESCRIPTION: Creates and exports a Sanity client instance configured with environment variables for project ID, dataset, API version, and perspective. Disables CDN for development/preview purposes.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/PREVIEW-pages-router.md#_snippet_1

LANGUAGE: tsx
CODE:

```
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2022-11-15',
  useCdn: false,
  perspective: 'published',
})
```

---

TITLE: Manual Install: next-sanity and Image URL (pnpm)
DESCRIPTION: Install the core next-sanity package and the @sanity/image-url helper using pnpm for manual setup. This provides the main toolkit for integrating Sanity with Next.js and handling image transformations.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_4

LANGUAGE: bash
CODE:

```
pnpm install next-sanity @sanity/image-url

```

---

TITLE: Configuring SANITY_REVALIDATE_SECRET Environment Variable
DESCRIPTION: Defines the `SANITY_REVALIDATE_SECRET` environment variable, essential for validating webhook requests from Sanity. This secret string must be shared between your Sanity project's webhook configuration and your Next.js application's environment. It should be stored securely (e.g., in `.env.local`) and not committed to version control.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_13

LANGUAGE: bash
CODE:

```
SANITY_REVALIDATE_SECRET=<some-random-string>
```

---

TITLE: Manual Install: next-sanity and Image URL (yarn)
DESCRIPTION: Install the core next-sanity package and the @sanity/image-url helper using yarn for manual setup. This provides the main toolkit for integrating Sanity with Next.js and handling image transformations.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_3

LANGUAGE: bash
CODE:

```
yarn add next-sanity @sanity/image-url

```

---

TITLE: Installing next-sanity and @sanity/image-url (Bash)
DESCRIPTION: Install the core next-sanity toolkit and the @sanity/image-url package, which is used for on-demand image transformations from Sanity's CDN. Choose the command corresponding to your preferred package manager.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_2

LANGUAGE: bash
CODE:

```
npm install next-sanity @sanity/image-url
```

LANGUAGE: bash
CODE:

```
yarn add next-sanity @sanity/image-url
```

LANGUAGE: bash
CODE:

```
pnpm install next-sanity @sanity/image-url
```

LANGUAGE: bash
CODE:

```
bun install next-sanity @sanity/image-url
```

---

TITLE: Manual Install: next-sanity and Image URL (npm)
DESCRIPTION: Install the core next-sanity package and the @sanity/image-url helper using npm for manual setup. This provides the main toolkit for integrating Sanity with Next.js and handling image transformations.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_2

LANGUAGE: bash
CODE:

```
npm install next-sanity @sanity/image-url

```

---

TITLE: Setting Revalidation Secret Environment Variable (Bash)
DESCRIPTION: Provides a command-line example for setting the `SANITY_REVALIDATE_SECRET` environment variable, which is required for securing path-based revalidation triggered by webhooks.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_18

LANGUAGE: Bash
CODE:

```
```bash

```

---

TITLE: Configuring Sanity Revalidation Secret (.env)
DESCRIPTION: Sets the environment variable required by the webhook API route to validate incoming requests from Sanity, ensuring they originate from a trusted source.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_17

LANGUAGE: env
CODE:

```
SANITY_REVALIDATE_SECRET=<some-random-string>
```

---

TITLE: Using sanityFetch in Next.js generateMetadata (TS)
DESCRIPTION: This snippet illustrates how to use `sanityFetch` within Next.js's `generateMetadata` function to dynamically set page metadata based on Sanity data. It's crucial to set `stega: false` when fetching data for metadata functions like `generateMetadata`, `generateViewport`, `generateSitemaps`, and `generateImageMetadata`.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/packages/next-sanity/README.md#_snippet_23

LANGUAGE: ts
CODE:

```
import {sanityFetch} from '@/sanity/lib/live'
import type {Metadata} from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({
    query: SETTINGS_QUERY,
    // Metadata should never contain stega
    stega: false,
  })
  return {
    title: {
      template: `%s | ${data.title}`,
      default: data.title,
    },
  }
}
```

---

TITLE: Initialize Embedded Sanity Studio in Next.js Project (Bash)
DESCRIPTION: This command uses `npx` to run the latest Sanity CLI `init` command. It guides the user through connecting or creating a Sanity project and setting up an embedded Sanity Studio route within their Next.js application.
SOURCE: https://github.com/sanity-io/next-sanity/blob/main/README.md#_snippet_39

LANGUAGE: Bash
CODE:

```
npx sanity@latest init
```
