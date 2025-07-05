TITLE: Next.js Server Actions Feature Concepts and Usage
DESCRIPTION: This section outlines fundamental concepts and usage patterns for Next.js Server Actions, covering their conventions, integration with both Server and Client Components, argument binding, invocation methods, progressive enhancement, and size limitations.
SOURCE: https://nextjs.org/docs/13/app/api-reference/functions/server-actions

LANGUAGE: APIDOC
CODE:

```
Server Actions Concepts:
  - Convention
  - With Server Components
  - With Client Components
  - Import
  - Props
  - Binding Arguments
  - Invocation
  - Progressive Enhancement
  - Size Limitation
  - Additional Resources
  - Next Steps
```

---

TITLE: Apply React Taint APIs to Prevent Sensitive Data Exposure
DESCRIPTION: This example demonstrates how to use `experimental_taintObjectReference` and `experimental_taintUniqueValue` within a server-side utility function. It marks an entire user object and a specific sensitive value (address) as tainted, preventing their accidental transmission to the client.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns

LANGUAGE: TypeScript
CODE:

```
import { queryDataFromDB } from './api'
import {
  experimental_taintObjectReference,
  experimental_taintUniqueValue,
} from 'react'

export async function getUserData() {
  const data = await queryDataFromDB()
  experimental_taintObjectReference(
    'Do not pass the whole user object to the client',
    data
  )
  experimental_taintUniqueValue(
    "Do not pass the user's address to the client",
    data,
    data.address
  )
  return data
}
```

---

TITLE: Configure Next.js development scripts in package.json
DESCRIPTION: Add essential scripts to your `package.json` file to manage your Next.js application. These scripts enable development (`dev`), production build (`build`), production server start (`start`), and linting (`lint`).
SOURCE: https://nextjs.org/docs/app/getting-started/installation

LANGUAGE: JSON
CODE:

```
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

TITLE: Mark a module as server-only to prevent client-side import errors
DESCRIPTION: Demonstrates importing the `server-only` package into a server-side module. This prevents accidental imports of the module into Client Components, triggering a build-time error and safeguarding sensitive server-only logic or environment variables.
SOURCE: https://nextjs.org/docs/app/getting-started/server-and-client-components

LANGUAGE: JavaScript
CODE:

```
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

---

TITLE: Configure Next.js Security Headers
DESCRIPTION: This configuration snippet for `next.config.js` demonstrates how to set various security headers for a Next.js application. It includes global headers like `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy` to enhance general security, and specific headers for the service worker (`/sw.js`) to ensure correct interpretation, prevent caching, and enforce a strict Content Security Policy.
SOURCE: https://nextjs.org/docs/app/guides/progressive-web-apps

LANGUAGE: javascript
CODE:

```
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          }
        ]
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          }
        ]
      }
    ]
  }
}
```

---

TITLE: Create a basic Next.js page component
DESCRIPTION: This snippet demonstrates how to create a simple page component in Next.js by exporting a React component from `app/page.tsx` (or `page.js`). This component will render 'Hello, Next.js!' when the root route is accessed.
SOURCE: https://nextjs.org/docs/13/app/building-your-application/routing/defining-routes

LANGUAGE: TypeScript
CODE:

```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

LANGUAGE: JavaScript
CODE:

```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

---

TITLE: Next.js Server Actions for Web Push Notifications
DESCRIPTION: Defines server actions in TypeScript for a Next.js application to manage web push subscriptions and send notifications. It includes functions for subscribing, unsubscribing, and sending push messages, noting that production environments should persist subscriptions in a database.
SOURCE: https://nextjs.org/docs/app/guides/progressive-web-apps

LANGUAGE: TypeScript
CODE:

```
'use server'

import webpush from 'web-push'

webpush.setVapidDetails(
  '<mailto:your-email@example.com>',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

let subscription: PushSubscription | null = null

export async function subscribeUser(sub: PushSubscription) {
  subscription = sub
  // In a production environment, you would want to store the subscription in a database
  // For example: await db.subscriptions.create({ data: sub })
  return { success: true }
}

export async function unsubscribeUser() {
  subscription = null
  // In a production environment, you would want to remove the subscription from the database
  // For example: await db.subscriptions.delete({ where: { ... } })
  return { success: true }
}

export async function sendNotification(message: string) {
  if (!subscription) {
    throw new Error('No subscription available')
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: 'Test Notification',
        body: message,
        icon: '/icon.png',
      })
    )
    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: 'Failed to send notification' }
  }
}
```

---

TITLE: API Reference: Next.js Link Component
DESCRIPTION: Explains the Next.js Link component, used for client-side navigation between routes with prefetching capabilities.
SOURCE: https://nextjs.org/docs/pages/api-reference/config/next-config-js/trailingSlash

LANGUAGE: APIDOC
CODE:

```
Component: Link
```

---

TITLE: Next.js App Router File-system Conventions API
DESCRIPTION: API reference for file-system conventions in the Next.js App Router, detailing special files and folders like default.js, error.js, layout.js, page.js, and route.js, along with routing patterns like Dynamic Segments, Intercepting Routes, and Parallel Routes. Also includes metadata file conventions.
SOURCE: https://nextjs.org/docs/app/api-reference/config/next-config-js/env

LANGUAGE: APIDOC
CODE:

```
File-system Conventions:
  - default.js
  - Dynamic Segments
  - error.js
  - forbidden.js
  - instrumentation.js
  - instrumentation-client.js
  - Intercepting Routes
  - layout.js
  - loading.js
  - mdx-components.js
  - middleware.js
  - not-found.js
  - page.js
  - Parallel Routes
  - public
  - route.js
  - Route Groups
  - Route Segment Config
  - src
  - template.js
  - unauthorized.js
Metadata Files:
  - favicon, icon, and apple-icon
  - manifest.json
  - opengraph-image and twitter-image
  - robots.txt
  - sitemap.xml
```

---

TITLE: Revalidate Data with Next.js Server Action
DESCRIPTION: This Server Action demonstrates how to revalidate a specific path (e.g., '/') after an operation like a form submission. It uses `revalidatePath` from `next/cache` and is marked with `'use server'` to ensure it runs exclusively on the server.
SOURCE: https://nextjs.org/docs/14/app/api-reference/functions/revalidatePath

LANGUAGE: TypeScript
CODE:

```
'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() {
  await submitForm()
  revalidatePath('/')
}
```

---

TITLE: Next.js Component Rendering Hierarchy for Special Files
DESCRIPTION: Describes the specific rendering order of special Next.js component files within the App Router, detailing how `layout.js`, `template.js`, `error.js`, `loading.js`, `not-found.js`, and `page.js` are nested and rendered recursively based on their parent segments.
SOURCE: https://nextjs.org/docs/app/getting-started/project-structure

LANGUAGE: APIDOC
CODE:

```
Component Hierarchy Order:
- layout.js
- template.js
- error.js (React error boundary)
- loading.js (React suspense boundary)
- not-found.js (React error boundary)
- page.js or nested layout.js

Rendering Behavior:
Components defined in special files are rendered in a specific hierarchy. Components of a route segment are nested inside the components of its parent segment, rendering recursively.
```

---

TITLE: Supported: Parent Server Component Passing Server Component as Child
DESCRIPTION: This example illustrates how a parent Server Component can import both a Client Component and a Server Component, then pass the Server Component as a child to the Client Component. This pattern enables the Server Component to be rendered on the server before the Client Component is rendered on the client, optimizing performance and data fetching.
SOURCE: https://nextjs.org/docs/13/app/building-your-application/rendering/composition-patterns

LANGUAGE: TypeScript
CODE:

```
// This pattern works:\n// You can pass a Server Component as a child or prop of a\n// Client Component.\nimport ClientComponent from './client-component'\nimport ServerComponent from './server-component'\n\n// Pages in Next.js are Server Components by default\nexport default function Page() {\n  return (\n    <ClientComponent>\n      <ServerComponent />\n    </ClientComponent>\n  )\n}
```

---

TITLE: Import Client Component into Server Layout in Next.js
DESCRIPTION: This server component (`app/blog/layout.tsx`) illustrates how to import and render the `BlogNavLink` client component within a parent layout. It fetches featured posts asynchronously and then maps over them to create navigation links, demonstrating the integration of client-side interactivity within a server-rendered page structure.
SOURCE: https://nextjs.org/docs/13/app/api-reference/functions/use-selected-layout-segment

LANGUAGE: TypeScript
CODE:

```
// Import the Client Component into a parent Layout (Server Component)
import { BlogNavLink } from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

---

TITLE: Invoking Server Actions from onClick Event in Next.js
DESCRIPTION: This example illustrates how to call a Server Action from an `onClick` event handler on a button. It shows how to update the UI state (`likes`) after the Server Action (`incrementLike`) completes, providing a basic interactive element.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations

LANGUAGE: TypeScript
CODE:

```
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

---

TITLE: Access Current Locale in Next.js Page Component
DESCRIPTION: This snippet shows a Next.js page component (`app/[lang]/page.js`) that receives the `lang` parameter from the URL. This allows the page to access the currently active locale, enabling locale-specific content rendering.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/routing/internationalization

LANGUAGE: JavaScript
CODE:

```
// You now have access to the current locale
// e.g. /en-US/products -> `lang` is "en-US"
export default async function Page({ params: { lang } }) {
  return ...
}
```

---

TITLE: Next.js Server Action: Handling Form Data
DESCRIPTION: This snippet demonstrates how to define a Server Action within a Next.js page to process form submissions. The action automatically receives the FormData object, allowing direct extraction of input values without client-side state management. It's designed for progressive enhancement.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations

LANGUAGE: TypeScript
CODE:

```
export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate cache
  }

  return <form action={createInvoice}>...</form>
}
```

---

TITLE: Next.js App Router API Reference Index
DESCRIPTION: Lists the available API references for the Next.js App Router, organized by category such as directives, components, file-system conventions, and functions, including their sub-elements.
SOURCE: https://nextjs.org/docs/pages/guides/draft-mode

LANGUAGE: APIDOC
CODE:

```
- use server
+ Components
  - Font
  - Form Component
  - Image Component
  - Link Component
  - Script Component
+ File-system conventions
  - default.js
  - Dynamic Segments
  - error.js
  - forbidden.js
  - instrumentation.js
  - instrumentation-client.js
  - Intercepting Routes
  - layout.js
  - loading.js
  - mdx-components.js
  - middleware.js
  - not-found.njs
  - page.js
  - Parallel Routes
  - public
  - route.js
  - Route Groups
  - Route Segment Config
  - src
  - template.js
  - unauthorized.js
  - Metadata Files
    * favicon, icon, and apple-icon
    * manifest.json
    * opengraph-image and twitter-image
    * robots.txt
    * sitemap.xml
+ Functions
  - after
  - cacheLife
  - cacheTag
  - connection
  - cookies
  - draftMode
  - fetch
  - forbidden
  - generateImageMetadata
  - generateMetadata
  - generateSitemaps
  - generateStaticParams
  - generateViewport
  - headers
  - ImageResponse
  - NextRequest
  - NextResponse
  - notFound
  - permanentRedirect
  - redirect
  - revalidatePath
  - revalidateTag
  - unauthorized
  - unstable_cache
  - unstable_noStore
  - unstable_rethrow
  - useLinkStatus
  - useParams
  - usePathname
  - useReportWebVitals
  - useRouter
  - useSearchParams
```

---

TITLE: Create a New Next.js Application
DESCRIPTION: Initializes a new Next.js project using the `create-next-app` command-line tool. This command is the recommended way to set up a new Next.js application, providing options for TypeScript, styling, and initial configuration.
SOURCE: https://nextjs.org/docs/14/getting-started

LANGUAGE: Shell
CODE:

```
create-next-app
```

---

TITLE: Migrating Next.js Data Fetching with Async Server Components
DESCRIPTION: Illustrates the new data fetching approach in the Next.js `app` directory, replacing `getServerSideProps` and `getStaticProps`. It uses `fetch()` within `async` React Server Components to achieve different caching behaviors: `force-cache` (similar to `getStaticProps`), `no-store` (similar to `getServerSideProps`), and `revalidate` (similar to `getStaticProps` with revalidation).
SOURCE: https://nextjs.org/docs/14/pages/building-your-application/upgrading/app-router-migration

LANGUAGE: TypeScript
CODE:

```
export default async function Page() {
  // This request should be cached until manually invalidated.
  // Similar to `getStaticProps`.
  // `force-cache` is the default and can be omitted.
  const staticData = await fetch(`https://...`, { cache: 'force-cache' })

  // This request should be refetched on every request.
  // Similar to `getServerSideProps`.
  const dynamicData = await fetch(`https://...`, { cache: 'no-store' })

  // This request should be cached with a lifetime of 10 seconds.
  // Similar to `getStaticProps` with the `revalidate` option.
  const revalidatedData = await fetch(`https://...`, {
    next: { revalidate: 10 },
  })

  return <div>...</div>
}
```

---

TITLE: Next.js Directives API Reference
DESCRIPTION: Lists API directives available in Next.js, such as 'use server', which defines server-only modules.
SOURCE: https://nextjs.org/docs/architecture/nextjs-compiler

LANGUAGE: APIDOC
CODE:

```
Directives:
  - use server
```

---

TITLE: Update Next.js Sync Page Params and SearchParams Handling (Client Components)
DESCRIPTION: This snippet illustrates the updated approach for accessing `params` and `searchParams` in synchronous client components within the Next.js App Router. The `use` hook from React is now required to unwrap the `Promise` types, enabling direct access to the data. This applies to client-side rendering.
SOURCE: https://nextjs.org/docs/app/guides/upgrading/version-15

LANGUAGE: TypeScript
CODE:

```
'use client'

// Before
type Params = { slug: string }
type SearchParams = { [key: string]: string | string[] | undefined }

export default function Page({
  params,
  searchParams,
}: {
  params: Params
  searchParams: SearchParams
}) {
  const { slug } = params
  const { query } = searchParams
}

// After
import { use } from 'react'

type Params = Promise<{ slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const params = use(props.params)
  const searchParams = use(props.searchParams)
  const slug = params.slug
  const query = searchParams.query
}
```

LANGUAGE: JavaScript
CODE:

```
// Before
export default function Page({ params, searchParams }) {
  const { slug } = params
  const { query } = searchParams
}

// After
import { use } from "react"

export default function Page(props) {
  const params = use(props.params)
  const searchParams = use(props.searchParams)
  const slug = params.slug
  const query = searchParams.query
}
```

---

TITLE: Next.js Image Component Optimization
DESCRIPTION: Explanation of the Next.js `<Image>` Component for image optimization, including automatic optimization, layout shift prevention, and serving modern formats like WebP.
SOURCE: https://nextjs.org/docs/pages/guides/production-checklist

LANGUAGE: APIDOC
CODE:

```
Image Component (<Image>):
  Purpose: Optimize images
  Features: Automatically optimizes images, prevents layout shift, serves in modern formats (e.g., WebP).
```

---

TITLE: Fetching Data in Next.js Server Components
DESCRIPTION: This snippet demonstrates how to fetch data using `async`/`await` with the `fetch` API within a Next.js Server Component. It includes basic error handling and shows how to return JSON data, noting that the return value is not serialized and can include complex types like Date or Map.
SOURCE: https://nextjs.org/docs/13/app/building-your-application/data-fetching/fetching-caching-and-revalidating

LANGUAGE: TypeScript
CODE:

```
async function getData() {
  const res = await fetch('https://api.example.com/...')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const data = await getData()

  return <main></main>
}
```

---

TITLE: Call Server Functions from Client Components in Next.js
DESCRIPTION: This example illustrates how a client component (`app/components/my-button.tsx`) can import and execute a server-side function (`fetchUsers`) that was defined in a separate file with the `use server` directive. The server function is triggered by a button click.
SOURCE: https://nextjs.org/docs/app/api-reference/directives/use-server

LANGUAGE: TypeScript
CODE:

```
'use client'
import { fetchUsers } from '../actions'

export default function MyButton() {
  return <button onClick={() => fetchUsers()}>Fetch Users</button>
}
```

---

TITLE: Next.js 14 App Router Functions API Reference
DESCRIPTION: Reference for built-in functions available in the Next.js 14 App Router, covering data fetching, caching, and client-side hooks.
SOURCE: https://nextjs.org/docs/14/app/api-reference/functions/generate-viewport

LANGUAGE: APIDOC
CODE:

```
redirect()
```

LANGUAGE: APIDOC
CODE:

```
revalidatePath()
```

LANGUAGE: APIDOC
CODE:

```
revalidateTag()
```

LANGUAGE: APIDOC
CODE:

```
unstable_cache()
```

LANGUAGE: APIDOC
CODE:

```
unstable_noStore()
```

LANGUAGE: APIDOC
CODE:

```
useParams()
```

LANGUAGE: APIDOC
CODE:

```
usePathname()
```

LANGUAGE: APIDOC
CODE:

```
useReportWebVitals()
```

LANGUAGE: APIDOC
CODE:

```
useRouter()
```

LANGUAGE: APIDOC
CODE:

```
useSearchParams()
```

LANGUAGE: APIDOC
CODE:

```
useSelectedLayoutSegment()
```

LANGUAGE: APIDOC
CODE:

```
useSelectedLayoutSegments()
```

LANGUAGE: APIDOC
CODE:

```
userAgent()
```

---

TITLE: Define Metadata in Next.js App Router Page
DESCRIPTION: This snippet demonstrates how to define static metadata for a Next.js page by exporting a `metadata` object. This object allows configuring HTML <head> elements like `title` for SEO purposes, automatically handling advanced requirements.
SOURCE: https://nextjs.org/docs/13/app/building-your-application/routing/pages-and-layouts

LANGUAGE: TypeScript
CODE:

```
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
}

export default function Page() {
  return '...'
}
```

---

TITLE: Define Basic Next.js Root Layout Component
DESCRIPTION: This snippet shows the initial structure for a Next.js root layout component, which is a React Server Component wrapping all application pages. It takes `children` as a prop to render nested content.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/upgrading/from-create-react-app

LANGUAGE: TypeScript
CODE:

```
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return null
}
```

LANGUAGE: JavaScript
CODE:

```
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return null
}
```

---

TITLE: Next.js App Router: Core Routing Files
DESCRIPTION: Defines the primary file conventions used by the Next.js App Router to create different types of routes and UI components, including layouts, pages, loading states, error boundaries, and API endpoints.
SOURCE: https://nextjs.org/docs/14/getting-started/project-structure

LANGUAGE: APIDOC
CODE:

```
File Convention: Routing Files

- layout: Layout (.js, .jsx, .tsx)
- page: Page (.js, .jsx, .tsx)
- loading: Loading UI (.js, .jsx, .tsx)
- not-found: Not found UI (.js, .jsx, .tsx)
- error: Error UI (.js, .jsx, .tsx)
- global-error: Global error UI (.js, .jsx, .tsx)
- route: API endpoint (.js, .ts)
- template: Re-rendered layout (.js, .jsx, .tsx)
- default: Parallel route fallback page (.js, .jsx, .tsx)
```

---

TITLE: Next.js Configuration: next.config.js Options
DESCRIPTION: Comprehensive reference for all configurable properties within the `next.config.js` file, which controls various aspects of a Next.js application's build, development, and runtime behavior.
SOURCE: https://nextjs.org/docs/messages/no-img-element

LANGUAGE: APIDOC
CODE:

```
next.config.js:
  Configuration Options:
    - allowedDevOrigins
    - appDir
    - assetPrefix
    - authInterrupts
    - basePath
    - cacheLife
    - compress
    - crossOrigin
    - cssChunking
    - devIndicators
    - distDir
    - dynamicIO
    - env
    - eslint
    - expireTime
    - exportPathMap
    - generateBuildId
    - generateEtags
    - headers
    - htmlLimitedBots
    - httpAgentOptions
    - images
    - cacheHandler (incrementalCacheHandlerPath)
    - inlineCss
    - logging
    - mdxRs
    - onDemandEntries
    - optimizePackageImports
    - output
    - pageExtensions
    - poweredByHeader
    - ppr
    - productionBrowserSourceMaps
    - reactCompiler
    - reactMaxHeadersLength
    - reactStrictMode
    - redirects
    - rewrites
    - sassOptions
    - serverActions
    - serverComponentsHmrCache
    - serverExternalPackages
    - staleTimes
    - staticGeneration*
    - taint
    - trailingSlash
    - transpilePackages
    - turbopack
    - typedRoutes
    - typescript
    - urlImports
    - useCache
    - useLightningcss
    - viewTransition
    - webpack
```

---

TITLE: Create Post Server Action with Expected Error Handling
DESCRIPTION: This Server Action demonstrates how to create a post and handle expected errors by returning a message. It avoids throwing errors for anticipated failures, instead modeling them as return values.
SOURCE: https://nextjs.org/docs/app/getting-started/error-handling

LANGUAGE: TypeScript
CODE:

```
'use server'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
}
```

LANGUAGE: JavaScript
CODE:

```
'use server'

export async function createPost(prevState, formData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
}
```

---

TITLE: Next.js App Router File-system Conventions API Reference
DESCRIPTION: Details the various file-system conventions used in the Next.js App Router for defining routes, handling errors, middleware, and metadata files. This includes conventions like default.js, layout.js, page.js, and specific metadata files such as favicon, manifest.json, robots.txt, and sitemap.xml.
SOURCE: https://nextjs.org/docs/app/api-reference/config/next-config-js/htmlLimitedBots

LANGUAGE: APIDOC
CODE:

```
default.js
```

LANGUAGE: APIDOC
CODE:

```
Dynamic Segments
```

LANGUAGE: APIDOC
CODE:

```
error.js
```

LANGUAGE: APIDOC
CODE:

```
forbidden.js
```

LANGUAGE: APIDOC
CODE:

```
instrumentation.js
```

LANGUAGE: APIDOC
CODE:

```
instrumentation-client.js
```

LANGUAGE: APIDOC
CODE:

```
Intercepting Routes
```

LANGUAGE: APIDOC
CODE:

```
layout.js
```

LANGUAGE: APIDOC
CODE:

```
loading.js
```

LANGUAGE: APIDOC
CODE:

```
mdx-components.js
```

LANGUAGE: APIDOC
CODE:

```
middleware.js
```

LANGUAGE: APIDOC
CODE:

```
not-found.js
```

LANGUAGE: APIDOC
CODE:

```
page.js
```

LANGUAGE: APIDOC
CODE:

```
Parallel Routes
```

LANGUAGE: APIDOC
CODE:

```
public folder
```

LANGUAGE: APIDOC
CODE:

```
route.js
```

LANGUAGE: APIDOC
CODE:

```
Route Groups
```

LANGUAGE: APIDOC
CODE:

```
Route Segment Config
```

LANGUAGE: APIDOC
CODE:

```
src folder
```

LANGUAGE: APIDOC
CODE:

```
template.js
```

LANGUAGE: APIDOC
CODE:

```
unauthorized.js
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files - favicon, icon, and apple-icon
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files - manifest.json
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files - opengraph-image and twitter-image
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files - robots.txt
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files - sitemap.xml
```

---

TITLE: Fetch Post Data on Dynamic Next.js Page
DESCRIPTION: Shows how to fetch data for a specific post on a dynamic route (`[id]/page.tsx`) using the `params` prop. The `id` is extracted from `params` to retrieve post data with `getPost`, allowing the page to display content based on the URL parameter.
SOURCE: https://nextjs.org/docs/app/api-reference/components/form

LANGUAGE: TypeScript
CODE:

```
import { getPost } from '@/posts/data'

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getPost(id)

  return (
    <div>
      <h1>{data.title}</h1>
      {/* ... */}
    </div>
  )
}
```

---

TITLE: Implement Optimistic UI Updates with React useOptimistic Hook in Next.js
DESCRIPTION: Demonstrates how to use the `useOptimistic` hook in a Next.js client component to provide immediate UI feedback for form submissions before the server action completes. It shows updating a list of messages optimistically and then awaiting the actual server response.
SOURCE: https://nextjs.org/docs/app/guides/forms

LANGUAGE: TypeScript
CODE:

```
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

type Message = {
  message: string
}

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messages, (state, newMessage) => [...state, { message: newMessage }])

  const formAction = async (formData: FormData) => {
    const message = formData.get('message') as string
    addOptimisticMessage(message)
    await send(message)
  }

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>{m.message}</div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

---

TITLE: Implement Two-Tier Authentication and Authorization in Next.js Route Handlers
DESCRIPTION: This snippet shows how to secure Next.js Route Handlers with a two-tier security check. It first verifies an active user session and then checks if the authenticated user has the 'admin' role. Unauthorized or unauthenticated requests are responded to with appropriate HTTP status codes (401 or 403), treating Route Handlers like public-facing API endpoints.
SOURCE: https://nextjs.org/docs/app/guides/authentication

LANGUAGE: TypeScript
CODE:

```
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  // User authentication and role verification
  const session = await verifySession()

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    return new Response(null, { status: 401 })
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== 'admin') {
    // User is authenticated but does not have the right permissions
    return new Response(null, { status: 403 })
  }

  // Continue for authorized users
}
```

---

TITLE: Integrate Auth Slot into Root Layout for Modal Opening (app/layout.tsx)
DESCRIPTION: This snippet modifies the root `app/layout.tsx` to render the `@auth` Parallel Route slot alongside the main `children` content. It includes a `Link` to `/login`; when clicked, this link triggers the intercepted modal display instead of a full page navigation, enabling client-side modal opening.
SOURCE: https://nextjs.org/docs/app/api-reference/file-conventions/parallel-routes

LANGUAGE: TypeScript
CODE:

```
import Link from 'next/link'

export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Link href="/login">Open modal</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

LANGUAGE: JavaScript
CODE:

```
import Link from 'next/link'

export default function Layout({
  auth,
  children,
}) {
  return (
    <>
      <nav>
        <Link href="/login">Open modal</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

---

TITLE: Define a Global Root Layout in Next.js
DESCRIPTION: This snippet demonstrates how to create a `RootLayout`, which is the top-most layout in the `app` directory. It's used to define global HTML structure like `<html>` and `<body>` tags and other globally shared UI, accepting `children` for nested content.
SOURCE: https://nextjs.org/docs/14/app/api-reference/file-conventions/layout

LANGUAGE: TypeScript
CODE:

```
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

---

TITLE: Define Next.js Page Component with Dynamic Props
DESCRIPTION: This snippet demonstrates how to define a `page.js` component in Next.js using TypeScript. It shows how to destructure `params` for dynamic route segments and `searchParams` for URL query parameters, which are automatically passed as props to the page component.
SOURCE: https://nextjs.org/docs/13/app/api-reference/file-conventions/page

LANGUAGE: TypeScript
CODE:

```
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return <h1>My Page</h1>
}
```

---

TITLE: Next.js App Router: Implement Data Revalidation with fetch
DESCRIPTION: Illustrates how to use the `fetch()` API with the `revalidate` option in the `app` directory for data caching and revalidation. This example fetches posts and configures the request to revalidate every 60 seconds.
SOURCE: https://nextjs.org/docs/app/guides/migrating/app-router-migration

LANGUAGE: JavaScript
CODE:

```
// `app` directory

async function getPosts() {
  const res = await fetch(`https://.../posts`, { next: { revalidate: 60 } })
  const data = await res.json()

  return data.posts
}

export default async function PostList() {
  const posts = await getPosts()

  return posts.map((post) => <div>{post.name}</div>)
}
```

---

TITLE: Configure Time-based Data Revalidation for Fetch Requests in Next.js
DESCRIPTION: This snippet demonstrates how to implement time-based revalidation for data fetched using the `fetch` API in Next.js. By setting the `next.revalidate` option to a specific duration in seconds, the data will be cached for that period and then revalidated in the background upon the next request, exhibiting 'stale-while-revalidate' behavior.
SOURCE: https://nextjs.org/docs/app/guides/caching

LANGUAGE: javascript
CODE:

```
// Revalidate at most every hour
fetch('https://...', { next: { revalidate: 3600 } })
```

---

TITLE: Next.js: Defining Client Component for Server Component Props
DESCRIPTION: This snippet shows a Client Component designed to accept children or other props, which can then be filled by Server Components. This pattern allows for proper composition by creating a "slot" in the Client Component where server-rendered content can be placed.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/rendering/composition-patterns

LANGUAGE: TypeScript
CODE:

```
'use client'

import { useState } from 'react'

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  )
}
```

LANGUAGE: JavaScript
CODE:

```
'use client'

import { useState } from 'react'

export default function ClientComponent({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}
    </>
  )
}
```

---

TITLE: Next.js App Router API: 'use server' Directive
DESCRIPTION: Documents the 'use server' directive, which marks functions as server-side functions in the Next.js App Router, enabling server actions.
SOURCE: https://nextjs.org/docs/app/api-reference/config/eslint

LANGUAGE: APIDOC
CODE:

```
use server
```

---

TITLE: Next.js Page: Consuming Sanitized User Data
DESCRIPTION: This Server Component demonstrates the correct way to consume user data by calling a function (`getUser`) that sanitizes the data before it's passed to a Client Component. This ensures that only public information is available client-side, preventing accidental exposure.
SOURCE: https://nextjs.org/docs/app/guides/data-security

LANGUAGE: typescript
CODE:

```
import { getUser } from '../data/user'
import Profile from './ui/profile'

export default async function Page({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const publicProfile = await getUser(slug)
  return <Profile user={publicProfile} />
}
```

---

TITLE: Next.js Image Component: `fill` Property Usage
DESCRIPTION: The `fill` property is a boolean that makes the `next/image` component fill its parent element, useful when image dimensions are unknown. The parent must have a `position` style (relative, fixed, or absolute). It also discusses `object-fit` options like `contain` and `cover` for controlling image scaling within the container.
SOURCE: https://nextjs.org/docs/13/app/api-reference/components/image

LANGUAGE: JavaScript
CODE:

```
fill={true} // {true} | {false}
```

---

TITLE: Next.js 14 Application Building: Routing Concepts
DESCRIPTION: Documentation index for routing concepts within Next.js 14 applications, covering fundamental elements like pages, layouts, dynamic routes, navigation, and redirects.
SOURCE: https://nextjs.org/docs/14/pages/building-your-application/styling/css-modules

LANGUAGE: APIDOC
CODE:

```
Pages and Layouts
Dynamic Routes
Linking and Navigating
Redirecting
```

---

TITLE: Setting a Cookie for Session Data in Next.js Server Actions
DESCRIPTION: This code demonstrates how to set an encrypted session cookie on the server using Next.js server actions. It encrypts session data, sets an HTTP-only and secure cookie with a one-week expiry, and specifies the root path. This method is suitable for managing user sessions directly in browser cookies.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/authentication

LANGUAGE: TypeScript
CODE:

```
'use server'

import { cookies } from 'next/headers'

export async function handleLogin(sessionData) {
  const encryptedSessionData = encrypt(sessionData) // Encrypt your session data
  cookies().set('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // One week
    path: '/',
  })
  // Redirect or handle the response after setting the cookie
}
```

---

TITLE: Next.js Server Action with `prevState` for `useFormState`
DESCRIPTION: This snippet shows how a Next.js Server Action's function signature changes to accept a `prevState` parameter when used with the `useFormState` hook. This allows the action to return a serializable object, such as a message, to the client-side component.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/data-fetching/server-actions-and-mutations

LANGUAGE: TypeScript
CODE:

```
'use server'

export async function createUser(prevState: any, formData: FormData) {
  // ...
  return {
    message: 'Please enter a valid email',
  }
}
```

---

TITLE: API Reference: Next.js Component - Link
DESCRIPTION: Documentation for the Next.js Link component, used for client-side navigation between pages.
SOURCE: https://nextjs.org/docs/pages/api-reference/components/form

LANGUAGE: APIDOC
CODE:

```
Link
```

---

TITLE: Pass Server Actions as Props to Next.js Client Components
DESCRIPTION: This example illustrates how a Server Action can be passed as a prop to a Client Component. The Client Component then uses this prop as the `action` for an HTML form, allowing the form to trigger the server-side logic dynamically.
SOURCE: https://nextjs.org/docs/app/getting-started/updating-data

LANGUAGE: TypeScript
CODE:

```
'use client'

export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

---

TITLE: Set an outgoing cookie with cookies().set(name, value, options)
DESCRIPTION: This method takes a cookie name, value, and optional options to set an outgoing request cookie. Due to HTTP limitations, this method must be used within a Server Action or Route Handler, as cookies cannot be set after streaming starts.
SOURCE: https://nextjs.org/docs/14/app/api-reference/functions/cookies

LANGUAGE: javascript
CODE:

```
'use server'

import { cookies } from 'next/headers'

async function create(data) {
  cookies().set('name', 'lee')
  // or
  cookies().set('name', 'lee', { secure: true })
  // or
  cookies().set({
    name: 'name',
    value: 'lee',
    httpOnly: true,
    path: '/',
  })
}
```

---

TITLE: Next.js Configuration: next.config.js Properties
DESCRIPTION: Comprehensive list of configuration options available in `next.config.js` to customize Next.js behavior. These properties control various aspects of the application, including build processes, server settings, image optimization, and more.
SOURCE: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

LANGUAGE: APIDOC
CODE:

```
next.config.js Configuration Object:
  allowedDevOrigins: string[]
  appDir: boolean
  assetPrefix: string
  authInterrupts: boolean
  basePath: string
  cacheLife: number
  compress: boolean
  crossOrigin: string
  cssChunking: boolean
  devIndicators: object
  distDir: string
  dynamicIO: boolean
  env: object
  eslint: object
  expireTime: number
  exportPathMap: function
  generateBuildId: function
  generateEtags: boolean
  headers: function
  htmlLimitedBots: boolean
  httpAgentOptions: object
  images: object
  cacheHandler: string
  inlineCss: boolean
  logging: object
  mdxRs: boolean
  onDemandEntries: object
  optimizePackageImports: string[]
  output: string
  pageExtensions: string[]
  poweredByHeader: boolean
  ppr: boolean
  productionBrowserSourceMaps: boolean
  reactCompiler: boolean
  reactMaxHeadersLength: number
  reactStrictMode: boolean
  redirects: function
  rewrites: function
  sassOptions: object
  serverActions: object
  serverComponentsHmrCache: boolean
  serverExternalPackages: string[]
  staleTimes: object
  staticGeneration: object
  taint: boolean
  trailingSlash: boolean
  transpilePackages: string[]
  turbopack: object
  typedRoutes: boolean
  typescript: object
  urlImports: string[]
  useCache: boolean
  useLightningcss: boolean
  viewTransition: boolean
  webpack: function
```

---

TITLE: Load third-party scripts in Next.js layout component
DESCRIPTION: To load a third-party script for multiple routes in Next.js, import the `Script` component from `next/script` and include it directly within your layout component. This ensures the script is fetched when the layout's routes are accessed and loads only once.
SOURCE: https://nextjs.org/docs/app/guides/scripts

LANGUAGE: TypeScript
CODE:

```
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

---

TITLE: Next.js App Router File-system Conventions API Reference
DESCRIPTION: Details the special file-system conventions used in the Next.js App Router to define routes, handle errors, manage loading states, and configure various aspects of an application's structure and behavior.
SOURCE: https://nextjs.org/docs/pages/api-reference/turbopack

LANGUAGE: APIDOC
CODE:

```
default.js
```

LANGUAGE: APIDOC
CODE:

```
Dynamic Segments
```

LANGUAGE: APIDOC
CODE:

```
error.js
```

LANGUAGE: APIDOC
CODE:

```
forbidden.js
```

LANGUAGE: APIDOC
CODE:

```
instrumentation.js
```

LANGUAGE: APIDOC
CODE:

```
instrumentation-client.js
```

LANGUAGE: APIDOC
CODE:

```
Intercepting Routes
```

LANGUAGE: APIDOC
CODE:

```
layout.js
```

LANGUAGE: APIDOC
CODE:

```
loading.js
```

LANGUAGE: APIDOC
CODE:

```
mdx-components.js
```

LANGUAGE: APIDOC
CODE:

```
middleware.js
```

LANGUAGE: APIDOC
CODE:

```
not-found.js
```

LANGUAGE: APIDOC
CODE:

```
page.js
```

LANGUAGE: APIDOC
CODE:

```
Parallel Routes
```

LANGUAGE: APIDOC
CODE:

```
public folder
```

LANGUAGE: APIDOC
CODE:

```
route.js
```

LANGUAGE: APIDOC
CODE:

```
Route Groups
```

LANGUAGE: APIDOC
CODE:

```
Route Segment Config
```

LANGUAGE: APIDOC
CODE:

```
src folder
```

LANGUAGE: APIDOC
CODE:

```
template.js
```

LANGUAGE: APIDOC
CODE:

```
unauthorized.js
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files: favicon, icon, and apple-icon
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files: manifest.json
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files: opengraph-image and twitter-image
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files: robots.txt
```

LANGUAGE: APIDOC
CODE:

```
Metadata Files: sitemap.xml
```

---

TITLE: Next.js API Reference: next.config.js Options
DESCRIPTION: Comprehensive list of configuration options available in the `next.config.js` file to customize Next.js application behavior, build processes, and development settings.
SOURCE: https://nextjs.org/docs/pages/api-reference/config/next-config-js/redirects

LANGUAGE: APIDOC
CODE:

```
Next.js Configuration Options (next.config.js):
- allowedDevOrigins
- assetPrefix
- basePath
- bundlePagesRouterDependencies
- compress
- crossOrigin
- devIndicators
- distDir
- env
- eslint
- exportPathMap
- generateBuildId
- generateEtags
- headers
- httpAgentOptions
- images
- onDemandEntries
- optimizePackageImports
- output
- pageExtensions
- poweredByHeader
- productionBrowserSourceMaps
- reactStrictMode
- redirects
- rewrites
- Runtime Config
- serverExternalPackages
- trailingSlash
- transpilePackages
- turbo
- typescript
```

---

TITLE: Fetch data with fetch API in Next.js Server Components
DESCRIPTION: This snippet demonstrates how to fetch data using the native `fetch` API within an asynchronous Server Component. The component makes an API call, parses the JSON response, and renders a list of posts. It highlights that `fetch` responses are not cached by default, but Next.js prerenders the route for performance.
SOURCE: https://nextjs.org/docs/app/getting-started/fetching-data

LANGUAGE: TypeScript
CODE:

```
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

LANGUAGE: JavaScript
CODE:

```
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

---

TITLE: Next.js API Reference: Component - Link
DESCRIPTION: API documentation for the Next.js component named `Link`, used for client-side navigation.
SOURCE: https://nextjs.org/docs/architecture/turbopack

LANGUAGE: APIDOC
CODE:

```
Component: Link
```

---

TITLE: Basic Link Component Usage in Next.js
DESCRIPTION: Demonstrates how to import and use the <Link> component from 'next/link' for client-side navigation in a Next.js application, by passing a 'href' prop to navigate to a specified route like '/dashboard'.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/routing/linking-and-navigating

LANGUAGE: TypeScript
CODE:

```
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

LANGUAGE: JavaScript
CODE:

```
import Link from 'next/link'

export default function Page() {
  return <Link href="/dashboard">Dashboard</Link>
}
```

---

TITLE: Next.js Configuration Options (next.config.js) API Reference
DESCRIPTION: This section details the various configuration properties available in the `next.config.js` file, allowing developers to customize Next.js behavior for development, build, and production environments. It covers aspects like asset handling, build processes, and feature toggles.
SOURCE: https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler

LANGUAGE: APIDOC
CODE:

```
next.config.js Configuration Properties:
  allowedDevOrigins
  appDir
  assetPrefix
  authInterrupts
  basePath
  cacheLife
  compress
  crossOrigin
  cssChunking
  devIndicators
  distDir
  dynamicIO
  env
  eslint
  expireTime
  exportPathMap
  generateBuildId
  generateEtags
  headers
  htmlLimitedBots
  httpAgentOptions
  images
  cacheHandler
  inlineCss
  logging
  mdxRs
  onDemandEntries
  optimizePackageImports
  output
  pageExtensions
  poweredByHeader
  ppr
  productionBrowserSourceMaps
  reactCompiler
  reactMaxHeadersLength
  reactStrictMode
  redirects
  rewrites
  sassOptions
  serverActions
  serverComponentsHmrCache
  serverExternalPackages
  staleTimes
  staticGeneration*
  taint
  trailingSlash
  transpilePackages
  turbopack
  typedRoutes
  typescript
  urlImports
  useCache
  useLightningcss
  viewTransition
  webpack
```

---

TITLE: Run Next.js Development Server
DESCRIPTION: Command to start the Next.js development server, making the application accessible locally for development and testing.
SOURCE: https://nextjs.org/docs/pages/getting-started/installation

LANGUAGE: Terminal
CODE:

```
npm run dev
```

---

TITLE: Next.js Blog Layout Integrating Active Navigation Links (TypeScript)
DESCRIPTION: This server-side Next.js layout component demonstrates how to integrate the `BlogNavLink` client component. It fetches featured posts asynchronously and renders them as active navigation links within the blog's sidebar, showcasing the composition of server and client components.
SOURCE: https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment

LANGUAGE: TypeScript
CODE:

```
// Import the Client Component into a parent Layout (Server Component)
import { BlogNavLink } from './blog-nav-link'
import getFeaturedPosts from './get-featured-posts'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const featuredPosts = await getFeaturedPosts()
  return (
    <div>
      {featuredPosts.map((post) => (
        <div key={post.id}>
          <BlogNavLink slug={post.slug}>{post.title}</BlogNavLink>
        </div>
      ))}
      <div>{children}</div>
    </div>
  )
}
```

---

TITLE: Next.js Server Component for data fetching
DESCRIPTION: Demonstrates a Next.js Server Component (`Page`) that fetches post data asynchronously using `getPost` and passes it as props to a Client Component (`LikeButton`). This component runs on the server, reducing client-side JavaScript and allowing secure data access.
SOURCE: https://nextjs.org/docs/app/building-your-application/rendering/server-components

LANGUAGE: TypeScript
CODE:

```
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

---

TITLE: Create a basic Next.js page component
DESCRIPTION: This snippet demonstrates how to create a simple page component in Next.js using the App Router. It exports a default React component that renders a basic H1 heading. This `page.js` file makes the route segment publicly accessible.
SOURCE: https://nextjs.org/docs/14/app/building-your-application/routing/defining-routes

LANGUAGE: TypeScript
CODE:

```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

LANGUAGE: JavaScript
CODE:

```
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

---

TITLE: fetch() Function API Reference
DESCRIPTION: API reference for the 'fetch()' function in Next.js App Router. This function is an extended version of the Web Fetch API with caching capabilities.
SOURCE: https://nextjs.org/docs/app/api-reference/config/next-config-js/assetPrefix

LANGUAGE: APIDOC
CODE:

```
fetch(): Extended Web Fetch API with caching capabilities.
```

---

TITLE: Next.js 14 App Router API Functions
DESCRIPTION: Documentation for core API functions available in the Next.js 14 App Router, including utilities for navigation, data revalidation, caching, and accessing request information. These functions are essential for building dynamic and performant Next.js applications.
SOURCE: https://nextjs.org/docs/14

LANGUAGE: APIDOC
CODE:

```
Functions:
- redirect
- revalidatePath
- revalidateTag
- unstable_cache
- unstable_noStore
- useParams
- usePathname
- useReportWebVitals
- useRouter
- useSearchParams
- useSelectedLayoutSegment
- useSelectedLayoutSegments
- userAgent
```

---

TITLE: Next.js Configuration Options in next.config.js
DESCRIPTION: Detailed reference for all configurable properties within the `next.config.js` file, allowing customization of Next.js build, development, and runtime behaviors.
SOURCE: https://nextjs.org/docs/app/api-reference/functions/use-router

LANGUAGE: APIDOC
CODE:

```
Configuration: object
  next.config.js: object
    properties:
      allowedDevOrigins: property
      appDir: property
      assetPrefix: property
      authInterrupts: property
      basePath: property
      cacheLife: property
      compress: property
      crossOrigin: property
      cssChunking: property
      devIndicators: property
      distDir: property
      dynamicIO: property
      env: property
      eslint: property
      expireTime: property
      exportPathMap: property
      generateBuildId: property
      generateEtags: property
      headers: property
      htmlLimitedBots: property
      httpAgentOptions: property
      images: property
      incrementalCacheHandlerPath: property
      inlineCss: property
      logging: property
      mdxRs: property
      onDemandEntries: property
      optimizePackageImports: property
      output: property
      pageExtensions: property
      poweredByHeader: property
      ppr: property
      productionBrowserSourceMaps: property
      reactCompiler: property
      reactMaxHeadersLength: property
      reactStrictMode: property
      redirects: property
      rewrites: property
      sassOptions: property
      serverActions: property
      serverComponentsHmrCache: property
      serverExternalPackages: property
      staleTimes: property
      staticGeneration*: property
      taint: property
      trailingSlash: property
      transpilePackages: property
      turbopack: property
      typedRoutes: property
      typescript: property
      urlImports: property
      useCache: property
      useLightningcss: property
      viewTransition: property
      webpack: property
```


```
