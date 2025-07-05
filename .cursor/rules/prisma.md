TITLE: Configure Prisma Data Source with SSL/TLS
DESCRIPTION: This snippet shows how to configure a Prisma data source to use SSL/TLS for a secure PostgreSQL connection. It includes parameters in the URL for `sslmode`, `sslcert`, `sslidentity`, and `sslpassword` to specify certificate locations and requirements. SSL certificates are resolved relative to the `./prisma` directory.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/100-prisma-schema/10-overview/02-data-sources.mdx#_snippet_1

LANGUAGE: prisma
CODE:

```
datasource db {
  provider = "postgresql"
  url      = "postgresql://johndoe:mypassword@localhost:5432/mydb?schema=public&sslmode=require&sslcert=../server-ca.pem&sslidentity=../client-identity.p12&sslpassword=<REDACTED>"
}
```

---

TITLE: Initialize Prisma Client in Node.js
DESCRIPTION: This snippet sets up a basic Node.js script to import and instantiate PrismaClient, defining an asynchronous main function for database queries and handling connection closure and errors.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-node-cockroachdb.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
const { PrismaClient } = require('./generated/prisma')

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

TITLE: Reading All Users with Prisma Client in TypeScript
DESCRIPTION: This snippet demonstrates how to use Prisma Client's `findMany()` method to retrieve all records from the `User` model in the database. The results are then logged to the console, showing how to fetch and inspect data.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-typescript-mysql.mdx#_snippet_1

LANGUAGE: typescript
CODE:

```
async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}
```

---

TITLE: Initialize Prisma Client in Node.js
DESCRIPTION: Sets up a basic Node.js script to interact with Prisma Client, including importing the client, instantiating it, defining an async main function for queries, and handling database disconnection and errors.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-node-sqlserver.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
const { PrismaClient } = require('./generated/prisma')

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

TITLE: Initializing Node.js and Installing TypeScript Dependencies
DESCRIPTION: Initializes a new Node.js project with default settings using `npm init -y` and then installs `typescript`, `tsx`, and `@types/node` as development dependencies, preparing the project for TypeScript development.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/01-quickstart-sqlite.mdx#_snippet_1

LANGUAGE: terminal
CODE:

```
npm init -y
npm install typescript tsx @types/node --save-dev
```

---

TITLE: Solving N+1 Queries with Prisma `in` Filter
DESCRIPTION: This snippet shows an alternative method to solve the n+1 problem by first fetching all user IDs, then using the `in` filter within a separate `findMany` call for posts. This strategy allows fetching all relevant posts in a single batch query, reducing the total database calls to two and improving efficiency.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/100-query-optimization-performance.mdx#_snippet_12

LANGUAGE: TypeScript
CODE:

```
const users = await prisma.user.findMany({})

const userIds = users.map((x) => x.id)

const posts = await prisma.post.findMany({
  where: {
    authorId: {
      in: userIds,
    },
  },
})
```

LANGUAGE: SQL
CODE:

```
SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name" FROM "public"."User" WHERE 1=1 OFFSET $1
SELECT "public"."Post"."id", "public"."Post"."createdAt", "public"."Post"."updatedAt", "public"."Post"."title", "public"."Post"."content", "public"."Post"."published", "public"."Post"."authorId" FROM "public"."Post" WHERE "public"."Post"."authorId" IN ($1,$2,$3,$4) OFFSET $5
```

---

TITLE: Defining User Model with Field and Block Attributes (MongoDB)
DESCRIPTION: This Prisma schema defines a User model for MongoDB, illustrating the use of @id, @default, @map, and @db.ObjectId field attributes, along with a @@unique block attribute. The id field is a string primary key mapped to _id and generated automatically, email is unique, isAdmin defaults to false, and the combination of firstName and lastName must be unique.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/100-prisma-schema/20-data-model/10-models.mdx#_snippet_20

LANGUAGE: Prisma
CODE:

```
model User {
  id        String  @id @default(auto()) @map("_id") @db.ObjectId
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@unique([firstName, lastName])
}
```

---

TITLE: Instantiating Prisma Client in TypeScript
DESCRIPTION: Demonstrates how to import and create a new instance of PrismaClient in a TypeScript application. This is the standard way to initialize the client for database interactions, typically done once per application lifecycle.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/000-setup-and-configuration/015-instantiate-prisma-client.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:

```
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

---

TITLE: Initializing Prisma ORM Project with Custom Output (npx)
DESCRIPTION: This command initializes a Prisma ORM project, creating a `schema.prisma` file and a `.env` file. It also sets a custom output directory for generated Prisma Client files, preparing the project for database interaction.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases-typescript-prismaPostgres.mdx#_snippet_4

LANGUAGE: terminal
CODE:

```
npx prisma init --db --output ../generated/prisma
```

---

TITLE: Executing TypeScript File with tsx
DESCRIPTION: This command executes the `index.ts` TypeScript file using `tsx`, a command-line tool for running TypeScript files directly without prior compilation. It's used to run the Prisma Client queries defined in the script and observe their output in the terminal.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-typescript-postgresql.mdx#_snippet_2

LANGUAGE: Terminal
CODE:

```
npx tsx index.ts
```

---

TITLE: Creating Multiple Related Records Using Nested Writes and Prisma $transaction (TypeScript)
DESCRIPTION: This snippet illustrates how to create multiple new teams, each with an associated member, using nested create operations. Since the creation of each team/member pair is independent of the other pair, they are then grouped and executed atomically using the Prisma $transaction([]) API.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/058-transactions.mdx#_snippet_21

LANGUAGE: TypeScript
CODE:

```
// Nested write
const createOne = prisma.team.create({
  data: {
    name: 'Aurora Adventures',
    members: {
      create: {
        email: 'alice@prisma.io',
      },
    },
  },
})

// Nested write
const createTwo = prisma.team.create({
  data: {
    name: 'Cool Crew',
    members: {
      create: {
        email: 'elsa@prisma.io',
      },
    },
  },
})

// $transaction([]) API
await prisma.$transaction([createTwo, createOne])
```

---

TITLE: Including One-to-Many Relation in Prisma (TypeScript)
DESCRIPTION: This snippet demonstrates how to fetch a single user along with all their associated posts using the `include` option in Prisma's `findFirst` query. It shows a basic one-to-many relationship inclusion, returning all fields of the user and their related posts.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/037-relation-queries.mdx#_snippet_3

LANGUAGE: TypeScript
CODE:

```
const user = await prisma.user.findFirst({
  include: {
    posts: true,
  },
})
```

LANGUAGE: JavaScript
CODE:

```
{
  id: 19,
  name: null,
  email: 'emma@prisma.io',
  profileViews: 0,
  role: 'USER',
  coinflips: [],
  posts: [
    {
      id: 20,
      title: 'My first post',
      published: true,
      authorId: 19,
      comments: null,
      views: 0,
      likes: 0
    },
    {
      id: 21,
      title: 'How to make cookies',
      published: true,
      authorId: 19,
      comments: null,
      views: 0,
      likes: 0
    }
  ]
}
```

---

TITLE: Prisma Client Generated Types for User and Post (TypeScript)
DESCRIPTION: This snippet illustrates the static type definitions generated by Prisma Client for the `allUsers` variable and the `Post` model. It shows how `allUsers` is typed to include `Post[]` for the `posts` relation, ensuring type safety when working with queried data and demonstrating Prisma Client's strong type inference capabilities.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-typescript-postgresql.mdx#_snippet_7

LANGUAGE: TypeScript
CODE:

```
const allUsers: (User & {
  posts: Post[]
})[]

export type Post = {
  id: number
  title: string
  content: string | null
  published: boolean
  authorId: number | null
}
```

---

TITLE: Set DATABASE_URL Environment Variable
DESCRIPTION: This snippet demonstrates how to set the `DATABASE_URL` environment variable in your `.env` file. This variable is used by both Prisma and Next.js to establish the database connection.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/500-deployment/301-edge/485-deploy-to-vercel.mdx#_snippet_27

LANGUAGE: bash
CODE:

```
DATABASE_URL="postgresql://janedoe:password@ep-nameless-pond-a23b1mdz.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

---

TITLE: Creating a Single User Record and Viewing Result with Prisma Client
DESCRIPTION: This example demonstrates how to create a new user record using `prisma.user.create()` in TypeScript, providing `email` and `name`. The accompanying JavaScript output shows the structure of the newly created user object, including its auto-generated `id` and default values.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/030-crud.mdx#_snippet_3

LANGUAGE: TypeScript
CODE:

```
const user = await prisma.user.create({
  data: {
    email: 'elsa@prisma.io',
    name: 'Elsa Prisma',
  },
})
```

LANGUAGE: JavaScript
CODE:

```
{
  id: 22,
  name: 'Elsa Prisma',
  email: 'elsa@prisma.io',
  profileViews: 0,
  role: 'USER',
  coinflips: []
}
```

---

TITLE: Configure Prisma Client Generator in schema.prisma
DESCRIPTION: This snippet shows how to update the `generator` block in your `schema.prisma` file to use the `prisma-client` provider. The `output` option is required and specifies the directory where the generated Prisma Client code will be placed, giving you full control over its location.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/100-prisma-schema/10-overview/03-generators.mdx#_snippet_4

LANGUAGE: prisma
CODE:

```
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

---

TITLE: Marking Prisma Baseline Migration as Applied
DESCRIPTION: This command marks the specified migration (0_init) as already applied within the database's _prisma_migrations table. This action is crucial for baselining, as it informs Prisma Migrate that the schema changes represented by this migration are already present in the database, preventing re-execution of existing schema definitions.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/200-add-to-existing-project/110-relational-databases/170-baseline-your-database-typescript-postgresql.mdx#_snippet_3

LANGUAGE: terminal
CODE:

```
npx prisma migrate resolve --applied 0_init
```

---

TITLE: Output of Retrieving All User Records - Console
DESCRIPTION: Displays the expected console output after successfully retrieving all user records. The output is an array containing the user object(s) found in the database, demonstrating the structure of results from `findMany` queries.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/01-quickstart-sqlite.mdx#_snippet_15

LANGUAGE: code
CODE:

```
[{ id: 1, email: 'alice@prisma.io', name: 'Alice' }]
```

---

TITLE: Configuring Prisma Datasource for Database Connection
DESCRIPTION: This snippet demonstrates how to configure the `datasource` block within your `prisma/schema.prisma` file. It sets the database provider to 'postgresql' and specifies that the connection URL should be sourced from an environment variable named `DATABASE_URL`.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/200-add-to-existing-project/110-relational-databases/100-connect-your-database-node-mysql.mdx#_snippet_0

LANGUAGE: prisma
CODE:

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

TITLE: Prisma `@id` Attribute Arguments
DESCRIPTION: Details the parameters available for the `@id` attribute, including their types, whether they are required, and their specific use cases and database support.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/500-reference/100-prisma-schema-reference.mdx#_snippet_76

LANGUAGE: APIDOC
CODE:

```
Name: map
Required: No
Type: String
Description: The name of the underlying primary key constraint in the database. Not supported for MySQL or MongoDB.

Name: length
Required: No
Type: number
Description: Allows you to specify a maximum length for the subpart of the value to be indexed. MySQL only. In preview in versions 3.5.0 and later, and in general availability in versions 4.0.0 and later.

Name: sort
Required: No
Type: String
Description: Allows you to specify in what order the entries of the ID are stored in the database. The available options are `Asc` and `Desc`. SQL Server only. In preview in versions 3.5.0 and later, and in general availability in versions 4.0.0 and later.

Name: clustered
Required: No
Type: Boolean
Description: Defines whether the ID is clustered or non-clustered. Defaults to `true`. SQL Server only. In preview in versions 3.13.0 and later, and in general availability in versions 4.0.0 and later.
```

---

TITLE: Initializing Prisma Client in Node.js
DESCRIPTION: This snippet initializes the Prisma Client in a Node.js script. It imports `PrismaClient`, instantiates it, defines an asynchronous `main` function for queries, and includes error handling and database disconnection logic to ensure proper resource management.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/200-add-to-existing-project/110-relational-databases/250-querying-the-database-node-planetscale.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

TITLE: Initializing Prisma Client in TypeScript
DESCRIPTION: This snippet imports the PrismaClient constructor, instantiates it, defines an asynchronous main function for queries, and handles database disconnection and error logging. It sets up the basic structure for interacting with the database using Prisma.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-typescript-mysql.mdx#_snippet_0

LANGUAGE: typescript
CODE:

```
import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

TITLE: Defining Data Model with Prisma Schema (Prisma)
DESCRIPTION: This snippet defines the data models for 'Post', 'Profile', and 'User' within the `prisma/schema.prisma` file. These models, including their fields, types, and relationships, will be used by Prisma Migrate to create corresponding tables in the PostgreSQL database.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/150-using-prisma-migrate-typescript-postgresql.mdx#_snippet_0

LANGUAGE: prisma
CODE:

```
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}
```

---

TITLE: Applying Prisma Schema Changes with Prisma Migrate Dev
DESCRIPTION: This terminal command uses `npx prisma migrate dev` to apply changes made to the Prisma schema to the database. The `--name tags-model` flag provides a descriptive name for the migration, which results in the creation of a new SQL migration file, its application to the database, and the regeneration of Prisma Client.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/200-add-to-existing-project/110-relational-databases/275-evolve-your-schema-typescript-mysql.mdx#_snippet_1

LANGUAGE: Terminal
CODE:

```
npx prisma migrate dev --name tags-model
```

---

TITLE: Updating a Specific Related Record with Prisma (TypeScript)
DESCRIPTION: This snippet demonstrates how to update a specific related record (e.g., a post belonging to a user) using a nested `update` operation within a `prisma.user.update` query. It targets a specific related record by its ID and modifies its data.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/037-relation-queries.mdx#_snippet_28

LANGUAGE: ts
CODE:

```
const result = await prisma.user.update({
  where: {
    id: 6,
  },
  data: {
    posts: {
      update: {
        where: {
          id: 9,
        },
        data: {
          title: 'My updated title',
        },
      },
    },
  },
  include: {
    posts: true,
  },
})
```

---

TITLE: Define MongoDB Many-to-Many Relations in Prisma Schema
DESCRIPTION: This Prisma schema defines an explicit many-to-many relationship between `Post` and `Category` models for MongoDB. It illustrates the use of scalar list fields (`categoryIDs`, `postIDs`) to store referenced IDs and `@relation` attributes with `fields` and `references` arguments on both sides. This setup is required for m-n relations in MongoDB with Prisma ORM.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/100-prisma-schema/20-data-model/20-relations/300-many-to-many-relations.mdx#_snippet_18

LANGUAGE: prisma
CODE:

```
model Post {
  id          String     @id @default(auto()) @map("_id") @db.ObjectId
  categoryIDs String[]   @db.ObjectId
  categories  Category[] @relation(fields: [categoryIDs], references: [id])
}

model Category {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  name    String
  postIDs String[] @db.ObjectId
  posts   Post[]   @relation(fields: [postIDs], references: [id])
}
```

---

TITLE: Run Prisma Database Migration to Create Tables
DESCRIPTION: This Prisma CLI command creates and executes a schema migration named 'init'. It maps the `User` and `Post` models defined in your Prisma schema to corresponding tables in your database.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/01-quickstart-prismaPostgres.mdx#_snippet_4

LANGUAGE: terminal
CODE:

```
npx prisma migrate dev --name init
```

---

TITLE: Extending Prisma Model Types with Prisma.Result (TypeScript)
DESCRIPTION: This snippet showcases the use of `Prisma.Result` to extend a Prisma model's type, specifically adding a `__typename` property to the `User` model via a client extension. It demonstrates how to define the extension and then correctly infer the extended model's type for use in queries, ensuring type safety for custom computed fields.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/300-client-extensions/index.mdx#_snippet_7

LANGUAGE: typescript
CODE:

```
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient().$extends({
  result: {
    user: {
      __typename: {
        needs: {},
        compute() {
          return 'User'
        },
      },
    },
  },
})

type ExtendedUser = Prisma.Result<typeof prisma.user, { select: { id: true } }, 'findFirstOrThrow'>

async function main() {
  const user: ExtendedUser = await prisma.user.findFirstOrThrow({
    select: {
      id: true,
      __typename: true,
    },
  })

  console.log(user.__typename) // Output: 'User'
}

main()
```

---

TITLE: Querying All Users with Prisma Client in TypeScript
DESCRIPTION: This snippet demonstrates how to retrieve all 'User' records from the database using 'prisma.user.findMany()'. It is intended to be placed within the 'main' function to perform a basic read operation and log the retrieved data to the console, illustrating a fundamental Prisma Client query.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-typescript-cockroachdb.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:

```
async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
}
```

---

TITLE: Update Environment Variable for Post Database URL
DESCRIPTION: This snippet shows how to rename the `DATABASE_URL` environment variable to `PPG_POST_DATABASE_URL` in the `.env` file. This ensures that the post database connection string is uniquely identified and used by its dedicated Prisma instance.
SOURCE: https://github.com/prisma/docs/blob/main/content/800-guides/150-multiple-databases.mdx#_snippet_10

LANGUAGE: text
CODE:

```
//delete-start
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI...
//delete-end
//add-start
PPG_POST_DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI...
//add-end
```

---

TITLE: Set DATABASE_URL Secret for Deployed Cloudflare Worker
DESCRIPTION: Command to securely set the `DATABASE_URL` environment variable as a secret for a deployed Cloudflare Worker using the `wrangler secret put` CLI command. This is an interactive step.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/500-deployment/301-edge/450-deploy-to-cloudflare.mdx#_snippet_42

LANGUAGE: terminal
CODE:

```
npx wrangler secret put DATABASE_URL
```

---

TITLE: Implementing Interactive Transactions for Money Transfer with Prisma Client (TypeScript)
DESCRIPTION: This TypeScript code demonstrates how to perform an atomic money transfer using Prisma's interactive transactions. It decrements the sender's balance, checks for insufficient funds, and then increments the recipient's balance. All operations within the `tx` instance are part of a single transaction, ensuring that either all steps succeed or all are rolled back if an error occurs, such as insufficient funds.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/058-transactions.mdx#_snippet_39

LANGUAGE: TypeScript
CODE:

```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function transfer(from: string, to: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    // 1. Decrement amount from the sender.
    const sender = await tx.account.update({
      data: {
        balance: {
          decrement: amount,
        },
      },
      where: {
        email: from,
      },
    })

    // 2. Verify that the sender's balance didn't go below zero.
    if (sender.balance < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`)
    }

    // 3. Increment the recipient's balance by amount
    const recipient = tx.account.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        email: to,
      },
    })

    return recipient
  })
}

async function main() {
  // This transfer is successful
  await transfer('alice@prisma.io', 'bob@prisma.io', 100)
  // This transfer fails because Alice doesn't have enough funds in her account
  await transfer('alice@prisma.io', 'bob@prisma.io', 100)
}

main()
```

---

TITLE: Initializing Prisma Client in TypeScript
DESCRIPTION: This snippet initializes Prisma Client for database interaction within a Node.js script. It imports `PrismaClient`, instantiates it, defines an `async main` function for queries, and includes robust error handling and connection closing logic to ensure proper resource management.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-typescript-postgresql.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:

```
import { PrismaClient } from './generated/prisma'

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

TITLE: Counting All Records and Non-Null Fields in Prisma TypeScript
DESCRIPTION: This example demonstrates how to count all records in a model (`_all`) and simultaneously count all non-null values for a specific scalar field (`name`). This functionality is available in Prisma 2.15.0 and later. The `count` method with a `select` object allows for these aggregate counts.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/056-aggregation-grouping-summarizing.mdx#_snippet_19

LANGUAGE: TypeScript
CODE:

```
const userCount = await prisma.user.count({
  select: {
    _all: true, // Count all records
    name: true, // Count all non-null field values
  },
})
```

LANGUAGE: JavaScript
CODE:

```
{ _all: 30, name: 10 }
```

---

TITLE: Deleting Records - Prisma Client v1 vs v2 (TypeScript)
DESCRIPTION: These snippets illustrate how to delete records using Prisma Client v1 and v2. Prisma Client v1 uses a dedicated `deleteUser` method with the record's ID. Prisma Client v2 standardizes on the `delete` method with a `where` clause. Both operations return the deleted user object.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/800-more/300-upgrade-guides/800-upgrade-from-prisma-1/03-upgrading-the-prisma-layer-mysql.mdx#_snippet_54

LANGUAGE: ts
CODE:

```
await prisma.deleteUser({ id: 1 })
```

LANGUAGE: ts
CODE:

```
await prisma.user.delete({
  where: { id: 1 },
})
```

---

TITLE: Installing Prisma Client Package - Terminal
DESCRIPTION: Installs the `@prisma/client` package, which is necessary to interact with the database using Prisma. This command also triggers `prisma generate` to create a tailored Prisma Client based on the schema.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/01-quickstart-sqlite.mdx#_snippet_7

LANGUAGE: terminal
CODE:

```
npm install @prisma/client
```

---

TITLE: Implementing Atomic User Data Deletion with Prisma $transaction([]) in TypeScript
DESCRIPTION: This TypeScript snippet demonstrates how to use the `$transaction([])` API to atomically delete a user's data, including posts and private messages, across multiple models. It defines three separate delete operations (`deletePosts`, `deleteMessages`, `deleteUser`) and then wraps them in a single `$transaction([])` call. This ensures that all operations succeed or fail together, crucial for maintaining data integrity, especially in scenarios like "right to be forgotten" legislation.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/058-transactions.mdx#_snippet_27

LANGUAGE: TypeScript
CODE:

```
const id = 9 // User to be deleted

const deletePosts = prisma.post.deleteMany({
  where: {
    userId: id,
  },
})

const deleteMessages = prisma.privateMessage.deleteMany({
  where: {
    userId: id,
  },
})

const deleteUser = prisma.user.delete({
  where: {
    id: id,
  },
})

await prisma.$transaction([deletePosts, deleteMessages, deleteUser]) // Operations succeed or fail together
```

---

TITLE: Execute Prisma Database Seed Script
DESCRIPTION: This command runs the database seeding script configured in `package.json`. It populates your database with the sample `User` and `Post` data defined in `prisma/seed.ts`, providing initial data for development and testing.
SOURCE: https://github.com/prisma/docs/blob/main/content/800-guides/160-tanstack-start.mdx#_snippet_21

LANGUAGE: terminal
CODE:

```
npx prisma db seed
```

---

TITLE: Defining Data Models with Prisma Schema
DESCRIPTION: This snippet defines the data models for 'Post', 'Profile', and 'User' within the Prisma schema. It establishes relationships between these models, specifies field types, default values, and unique constraints, which Prisma Migrate uses to generate corresponding database tables.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/150-using-prisma-migrate-node-postgresql.mdx#_snippet_0

LANGUAGE: Prisma
CODE:

```
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  posts   Post[]
  profile Profile?
}
```

---

TITLE: Installing Prisma Client Package - Terminal
DESCRIPTION: This command installs the `@prisma/client` package, which is the core library for interacting with your database using Prisma. It's a prerequisite for generating and using Prisma Client.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/200-add-to-existing-project/110-relational-databases/_install-prisma-client-partial.mdx#_snippet_0

LANGUAGE: terminal
CODE:

```
npm install @prisma/client
```

---

TITLE: Multiple SQL Queries from N+1 `posts` Resolver
DESCRIPTION: These SQL queries are generated when the `posts` resolver is invoked for each user. Each query fetches posts for a single `authorId`, clearly demonstrating the N+1 problem where multiple individual database calls are made instead of a single batched operation.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/100-query-optimization-performance.mdx#_snippet_7

LANGUAGE: sql
CODE:

```
{
  timestamp: 2021-02-19T09:43:06.343Z,
  query: 'SELECT `dev`.`Post`.`id`, `dev`.`Post`.`createdAt`, `dev`.`Post`.`updatedAt`, `dev`.`Post`.`title`, `dev`.`Post`.`content`, `dev`.`Post`.`published`, `dev`.`Post`.`viewCount`, `dev`.`Post`.`authorId` FROM `dev`.`Post` WHERE `dev`.`Post`.`authorId` = ? LIMIT ? OFFSET ?',
  params: '[1,-1,0]',
  duration: 0,
  target: 'quaint::connector::metrics'
}
{
  timestamp: 2021-02-19T09:43:06.347Z,
  query: 'SELECT `dev`.`Post`.`id`, `dev`.`Post`.`createdAt`, `dev`.`Post`.`updatedAt`, `dev`.`Post`.`title`, `dev`.`Post`.`content`, `dev`.`Post`.`published`, `dev`.`Post`.`viewCount`, `dev`.`Post`.`authorId` FROM `dev`.`Post` WHERE `dev`.`Post`.`authorId` = ? LIMIT ? OFFSET ?',
  params: '[3,-1,0]',
  duration: 0,
  target: 'quaint::connector::metrics'
}
{
  timestamp: 2021-02-19T09:43:06.348Z,
  query: 'SELECT `dev`.`Post`.`id`, `dev`.`Post`.`createdAt`, `dev`.`Post`.`updatedAt`, `dev`.`Post`.`title`, `dev`.`Post`.`content`, `dev`.`Post`.`published`, `dev`.`Post`.`viewCount`, `dev`.`Post`.`authorId` FROM `dev`.`Post` WHERE `dev`.`Post`.`authorId` = ? LIMIT ? OFFSET ?',
  params: '[2,-1,0]',
  duration: 0,
  target: 'quaint::connector::metrics'
}
{
  timestamp: 2021-02-19T09:43:06.348Z,
  query: 'SELECT `dev`.`Post`.`id`, `dev`.`Post`.`createdAt`, `dev`.`Post`.`updatedAt`, `dev`.`Post`.`title`, `dev`.`Post`.`content`, `dev`.`Post`.`published`, `dev`.`Post`.`viewCount`, `dev`.`Post`.`authorId` FROM `dev`.`Post` WHERE `dev`.`Post`.`authorId` = ? LIMIT ? OFFSET ?',
  params: '[4,-1,0]',
  duration: 0,
  target: 'quaint::connector::metrics'
}
{
  timestamp: 2021-02-19T09:43:06.348Z,
  query: 'SELECT `dev`.`Post`.`id`, `dev`.`Post`.`createdAt`, `dev`.`Post`.`updatedAt`, `dev`.`Post`.`title`, `dev`.`Post`.`content`, `dev`.`Post`.`published`, `dev`.`Post`.`viewCount`, `dev`.`Post`.`authorId` FROM `dev`.`Post` WHERE `dev`.`Post`.`authorId` = ? LIMIT ? OFFSET ?',
  params: '[5,-1,0]',
  duration: 0,
  target: 'quaint::connector::metrics'
}
```

---

TITLE: Configuring Prisma Datasource Provider
DESCRIPTION: This Prisma schema snippet shows how to configure the `datasource` block to specify the database `provider`. It sets the provider to a dynamic value and defines the `url` using an environment variable, which is crucial for connecting Prisma to the correct database.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/_prisma-init-partial.mdx#_snippet_2

LANGUAGE: prisma
CODE:

```
datasource db {
  //edit-next-line
    provider = "${props.datasource.toLowerCase()}"
    url      = env("DATABASE_URL")
}
```

---

TITLE: Initializing Prisma Client for MongoDB Queries (JavaScript)
DESCRIPTION: This snippet initializes Prisma Client in a Node.js script for querying a MongoDB database. It sets up the basic structure for an asynchronous 'main' function where database operations will be performed, ensuring proper connection and disconnection handling. It requires the '@prisma/client' module.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/200-add-to-existing-project/120-mongodb/250-querying-the-database-node-mongodb.mdx#_snippet_0

LANGUAGE: javascript
CODE:

```
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
```

---

TITLE: Defining and Applying an Extension with Prisma.defineExtension (TypeScript)
DESCRIPTION: Illustrates defining an extension using `Prisma.defineExtension` and then applying it to a Prisma Client instance. This method is recommended for better organization, allowing extensions to be defined separately and reused or combined, especially useful for multi-file projects.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/300-client-extensions/index.mdx#_snippet_1

LANGUAGE: TypeScript
CODE:

```
import { Prisma } from '@prisma/client'

// Define the extension
const myExtension = Prisma.defineExtension({
  name: 'signUp', // Optional: name appears in error logs
  model: {        // This is a `model` component
    user: { ... } // The extension logic for the `user` model goes inside the curly braces
  },
})

// Pass the extension to a Prisma Client instance
const prisma = new PrismaClient().$extends(myExtension)
```

---

TITLE: Importing Prisma Client in JavaScript
DESCRIPTION: This snippet demonstrates how to import and instantiate Prisma Client in a JavaScript project using CommonJS syntax for standard Node.js environments. The 'prisma' instance is then ready to be used for database operations.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/000-setup-and-configuration/005-introduction.mdx#_snippet_4

LANGUAGE: js
CODE:

```
const { PrismaClient } = require('./generated/prisma')

const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB
```

---

TITLE: Upgrade Prisma ORM using npm
DESCRIPTION: This command upgrades both the `prisma` and `@prisma/client` packages to version 4 using npm. The `@4` tag explicitly forces the upgrade across major versions, bypassing the default caret `^` behavior, which typically prevents major version upgrades.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/800-more/300-upgrade-guides/200-upgrading-versions/700-upgrading-to-prisma-4.mdx#_snippet_17

LANGUAGE: terminal
CODE:

```
npm install prisma@4 @prisma/client@4
```

---

TITLE: Extending a Specific Prisma Model with Custom Methods (TypeScript)
DESCRIPTION: This snippet demonstrates the basic structure for extending a specific Prisma model, such as `user`, with custom methods using the `$extends` client-level method. It shows how to define the `model` component within the extension configuration to target a particular model.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/300-client-extensions/100-model.mdx#_snippet_0

LANGUAGE: TypeScript
CODE:

```
const prisma = new PrismaClient().$extends({
  name?: '<name>',  // (optional) names the extension for error logs
  model?: {
    user: { ... }   // in this case, we extend the `user` model
  },
});
```

---

TITLE: Defining Optional Fields in Prisma for Relational Databases
DESCRIPTION: This snippet demonstrates an optional field (`content String?`) in a Prisma schema for relational databases. The `?` modifier indicates the field can be null, translating to a `NOT NULL` constraint absence in the database and an optional type in Prisma Client.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/100-prisma-schema/20-data-model/10-models.mdx#_snippet_14

LANGUAGE: Prisma
CODE:

```
model Comment {
  id      Int     @id @default(autoincrement())
  title   String
  content String?
}
```

---

TITLE: Creating Project Directory and Navigating (Shell)
DESCRIPTION: This snippet creates a new directory named `hello-prisma` for the project and then changes the current working directory into it. This is the initial step for setting up the project environment.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases-typescript-postgresql.mdx#_snippet_0

LANGUAGE: Shell
CODE:

```
mkdir hello-prisma
cd hello-prisma
```

---

TITLE: Selecting Subset of Fields for Single Record with Prisma Client (TypeScript)
DESCRIPTION: This snippet uses prisma.user.findUnique() to retrieve a specific user record and demonstrates how to select only a subset of its fields (email and name) using the select option. This optimizes the query by fetching only necessary data.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/030-crud.mdx#_snippet_18

LANGUAGE: TypeScript
CODE:

```
const user = await prisma.user.findUnique({
  where: {
    email: 'emma@prisma.io',
  },
  select: {
    email: true,
    name: true,
  },
})
```

---

TITLE: Including Related Records with Prisma findMany (TypeScript)
DESCRIPTION: This snippet demonstrates how to use prisma.user.findMany to retrieve User records and include their associated posts using the include option. It filters users by role: 'ADMIN' and shows how to fetch related data in a single query.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/100-queries/030-crud.mdx#_snippet_20

LANGUAGE: TypeScript
CODE:

```
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
  },
  include: {
    posts: true,
  },
})
```

---

TITLE: Applying Database Migrations with Prisma Migrate
DESCRIPTION: This command uses Prisma Migrate to apply the defined data model to the database. It generates a new SQL migration file and executes it against the database, creating or updating the necessary tables and columns. It also implicitly calls 'prisma generate' to update Prisma Client.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/150-using-prisma-migrate-node-postgresql.mdx#_snippet_1

LANGUAGE: Shell
CODE:

```
npx prisma migrate dev --name init
```

---

TITLE: Defining Initial Prisma Schema for User and Post Models
DESCRIPTION: This snippet defines the foundational Prisma schema for a PostgreSQL database, including `User` and `Post` models. It establishes an auto-incrementing ID, string fields, a boolean field with a default value, and a one-to-many relationship between `User` and `Post` via `authorId`.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/300-prisma-migrate/050-getting-started.mdx#_snippet_0

LANGUAGE: prisma
CODE:

```
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  published Boolean @default(true)
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}
```

---

TITLE: Configure Prisma binaryTargets for AWS Lambda Deployment
DESCRIPTION: Specify `binaryTargets` in your Prisma schema to include only the necessary query engine for your deployment environment (e.g., `rhel-openssl-3.0.x` for AWS Lambda) while developing on a different platform (`native`). This allows you to delete unneeded local engine binaries, further reducing the deployment package size. Be aware of the correct `binaryTarget` for different Node.js versions.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/500-deployment/650-caveats-when-deploying-to-aws-platforms.mdx#_snippet_3

LANGUAGE: prisma
CODE:

```
binaryTargets = ["native", "rhel-openssl-3.0.x"]
```

---

TITLE: Filter Posts by Content and Published Status using Explicit AND in Prisma
DESCRIPTION: This snippet demonstrates how to use the explicit `AND` operator in Prisma's `where` clause to combine multiple conditions. It retrieves `Post` records where the `content` field contains 'Prisma' and the `published` status is `false`.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/500-reference/050-prisma-client-reference.mdx#_snippet_184

LANGUAGE: js
CODE:

```
const result = await prisma.post.findMany({
  where: {
    AND: [
      {
        content: {
          contains: 'Prisma',
        },
      },
      {
        published: {
          equals: false,
        },
      },
    ],
  },
});
```

---

TITLE: Example JSON Response from Deployed Deno Application
DESCRIPTION: This text snippet shows an example JSON response returned by the deployed Deno application. It represents a log record created in the database, including a unique ID, log level, message detailing the request, and request headers in the metadata.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/500-deployment/301-edge/550-deploy-to-deno-deploy.mdx#_snippet_12

LANGUAGE: text
CODE:

```
{
  "id": 5,
  "level": "Info",
  "message": "GET https://prisma-deno-deploy.deno.dev/",
  "meta": {
    "headers": "{}"
  }
}
```

---

TITLE: Prisma Schema for Implicit Many-to-Many Relation
DESCRIPTION: Defines a Prisma schema with an implicit many-to-many relation between Post and Tag models, where Prisma ORM automatically manages the join table.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/800-more/300-upgrade-guides/200-upgrading-versions/500-upgrading-to-prisma-6.mdx#_snippet_1

LANGUAGE: prisma
CODE:

```
model Post {
  id         Int    @id @default(autoincrement())
  title      String
  categories Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}
```

---

TITLE: Applying Multiple Prisma Extensions to Separate and Combined Clients (TypeScript)
DESCRIPTION: Illustrates applying extensions incrementally to create multiple extended client instances. This allows for flexible usage, where individual extended clients (`prismaA`, `prismaB`) can be used separately, or combined (`prismaAB`) for cumulative functionality, providing more granular control over client behavior.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/300-client-extensions/index.mdx#_snippet_4

LANGUAGE: TypeScript
CODE:

```
// First of all, store your original Prisma Client in a variable as usual
const prisma = new PrismaClient()

// Declare an extended client that has extensionA applied
const prismaA = prisma.$extends(extensionA)

// Declare an extended client that has extensionB applied
const prismaB = prisma.$extends(extensionB)

// Declare an extended client that is a combination of clientA and clientB
const prismaAB = prismaA.$extends(extensionB)
```

---

TITLE: Prisma Schema Generated by Introspection for Multiple Relations
DESCRIPTION: Prisma schema definition showing how `prisma db pull` introspects a database schema with multiple implicit many-to-many relationships, generating distinct `@relation` attributes for each relationship.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/100-prisma-schema/20-data-model/20-relations/300-many-to-many-relations.mdx#_snippet_16

LANGUAGE: Prisma
CODE:

```
model User {
  id                       Int     @id @default(autoincrement())
  Video_UserDislikedVideos Video[] @relation("UserDislikedVideos")
  Video_UserLikedVideos    Video[] @relation("UserLikedVideos")
}

model Video {
  id                      Int    @id @default(autoincrement())
  User_UserDislikedVideos User[] @relation("UserDislikedVideos")
  User_UserLikedVideos    User[] @relation("UserLikedVideos")
}
```

---

TITLE: Reading Single Record - Prisma Client v1 vs v2 (TypeScript)
DESCRIPTION: These snippets demonstrate how to fetch a single record by its unique identifier using both Prisma Client v1 and v2. Prisma Client v1 uses a direct model method call, while v2 introduces the `findUnique` method with a `where` clause for improved clarity and type safety. Both snippets expect to return a single user object matching the provided ID.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/800-more/300-upgrade-guides/800-upgrade-from-prisma-1/03-upgrading-the-prisma-layer-mysql.mdx#_snippet_47

LANGUAGE: ts
CODE:

```
const user = await prisma.user({ id: 1 })
```

LANGUAGE: ts
CODE:

```
await prisma.user.findUnique({
  where: { id: 1 },
})
```

---

TITLE: Execute Node.js script with Prisma Client
DESCRIPTION: Command to run the Node.js script containing Prisma Client queries from the terminal.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-node-sqlserver.mdx#_snippet_2

LANGUAGE: terminal
CODE:

```
node index.js
```

---

TITLE: Defining Default Values with `autoincrement()` and `now()` in Prisma (Relational)
DESCRIPTION: This Prisma schema snippet defines a `Post` model for relational databases. It utilizes `@default(autoincrement())` for the `id` field to automatically generate unique integer IDs and `@default(now())` for `createdAt` to set the current timestamp upon record creation, both implemented at the database level.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/100-prisma-schema/20-data-model/10-models.mdx#_snippet_41

LANGUAGE: prisma
CODE:

```
model Post {\n  id        Int      @id @default(autoincrement())\n  createdAt DateTime @default(now())\n}
```

---

TITLE: Prisma `upsert` Operation Overview
DESCRIPTION: Explains the core functionality of the Prisma `upsert` operation, which conditionally updates an existing record or creates a new one based on a `where` condition.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/500-reference/050-prisma-client-reference.mdx#_snippet_52

LANGUAGE: APIDOC
CODE:

```
Prisma `upsert` Operation:
  - If an existing database record satisfies the `where` condition, it updates that record.
  - If no database record satisfies the `where` condition, it creates a new database record.
```

---

TITLE: Prisma Client Extensions (`$extends`) API
DESCRIPTION: Describes the `$extends` functionality for adding custom capabilities to Prisma Client. It allows extending models, the client itself, custom queries, and query results.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/500-reference/050-prisma-client-reference.mdx#_snippet_251

LANGUAGE: APIDOC
CODE:

```
$extends:
  model: Add custom methods to your models.
  client: Add custom methods to your client.
  query: Create custom Prisma Client queries.
  result: Add custom fields to your query results.
```

---

TITLE: Statically Typed Output of User Query (TypeScript)
DESCRIPTION: This snippet displays the static type definition for the `allUsers` variable, as inferred by Prisma Client's generated types. It illustrates the type safety provided by Prisma, showing the precise structure of the returned array of user objects, including the nested `posts` and `profile` relations with their respective fields and types.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/100-start-from-scratch/110-relational-databases/250-querying-the-database-typescript-prismaPostgres.mdx#_snippet_7

LANGUAGE: TypeScript
CODE:

```
const allUsers: ({
  posts: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string | null;
    published: boolean;
    authorId: number;
  }[];
  profile: {
    id: number;
    bio: string | null;
    userId: number;
  } | null;
} & {
  ...;
})[]
```

---

TITLE: Defining Relations in Prisma Schema (Prisma)
DESCRIPTION: This Prisma schema snippet demonstrates how to establish one-to-many and one-to-one relationships between Post, Profile, and User models. It shows the addition of relation fields like author and authorId for Post, user and userId for Profile, and posts and profile for User, ensuring proper foreign key linkages within the schema.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/02-setup-prisma/200-add-to-existing-project/110-relational-databases/150-introspection-node-planetscale.mdx#_snippet_3

LANGUAGE: prisma
CODE:

```
model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime
  title     String   @db.VarChar(255)
  content   String?
  published Boolean  @default(false)
  //add-next-line
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int

  @@index([authorId])
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  //add-next-line
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique

  @@index([userId])
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  //add-start
  posts   Post[]
  profile Profile?
  //add-end
}
```

---

TITLE: Migrating Simple `findFirst` with `rejectOnNotFound` to `findFirstOrThrow` in JavaScript
DESCRIPTION: This snippet demonstrates the direct replacement for simple `rejectOnNotFound` usage on a per-query basis. Instead of passing `rejectOnNotFound: true` to `findFirst`, you should now use `findFirstOrThrow` which inherently throws an error if no record is found.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/800-more/300-upgrade-guides/200-upgrading-versions/600-upgrading-to-prisma-5/001-rejectonnotfound-changes.mdx#_snippet_0

LANGUAGE: JavaScript
CODE:

```
prisma.user.findFirst({
  where: { name: 'Alice' },
  rejectOnNotFound: true,
})
```

LANGUAGE: JavaScript
CODE:

```
prisma.user.findFirstOrThrow({
  where: { name: 'Alice' },
})
```

---

TITLE: Executing Script to Create User - Terminal
DESCRIPTION: Runs the `script.ts` file using `tsx` to execute the Prisma Client query for creating a new user. This command compiles and executes TypeScript files directly, allowing for quick testing of database operations.
SOURCE: https://github.com/prisma/docs/blob/main/content/100-getting-started/01-quickstart-sqlite.mdx#_snippet_11

LANGUAGE: terminal
CODE:

```
npx tsx script.ts
```

---

TITLE: Querying Posts with NOT Has Tag (TypeScript)
DESCRIPTION: This snippet demonstrates how to query posts where the `tags` array does not contain a specific value ('databases') using the `NOT` operator in Prisma. It highlights that `NULL` arrays are not included in the results, even if they logically don't contain the specified value.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/200-special-fields-and-types/200-working-with-scalar-lists-arrays.mdx#_snippet_6

LANGUAGE: TypeScript
CODE:

```
const posts = await prisma.post.findMany({
  where: {
    NOT: {
      tags: {
        has: 'databases',
      },
    },
  },
})
```

---

TITLE: Installing Core OpenTelemetry Packages
DESCRIPTION: This command installs essential OpenTelemetry packages required for setting up tracing, including semantic conventions, HTTP trace exporter, and SDK components for base and Node.js tracing. These packages form the foundation for OpenTelemetry instrumentation.
SOURCE: https://github.com/prisma/docs/blob/main/content/200-orm/200-prisma-client/600-observability-and-logging/250-opentelemetry-tracing.mdx#_snippet_3

LANGUAGE: console
CODE:

```
npm install @opentelemetry/semantic-conventions @opentelemetry/exporter-trace-otlp-http @opentelemetry/sdk-trace-base @opentelemetry/sdk-trace-node @opentelemetry/resources
```

---

TITLE: Display User Names in Astro Component
DESCRIPTION: Renders a list of user names within an Astro component by mapping over the `users` array. Each user's name is displayed in an `<li>` element, demonstrating how to integrate fetched data into the HTML template.
SOURCE: https://github.com/prisma/docs/blob/main/content/800-guides/220-astro.mdx#_snippet_15

LANGUAGE: Astro
CODE:

```
---
import type { User, Post } from "../generated/prisma/client.js";
type UserWithPosts = User & { posts: Post[] };
const response = await fetch("http://localhost:4321/api/users");
const users: UserWithPosts[] = await response.json();
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width" />
    <meta name="generator" content={Astro.generator} />
    <title>Astro</title>
  </head>
  <body>
    <h1>Astro + Prisma</h1>
      {users.map((user: UserWithPosts) => (
        <li>
          <h2>{user.name}</h2>
        </li>
      ))}
  </body>
</html>
```
