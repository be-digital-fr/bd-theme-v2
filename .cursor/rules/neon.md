TITLE: Casting Timestamp to Date in PostgreSQL
DESCRIPTION: This example demonstrates how to use the CAST() function in PostgreSQL to convert a timestamp string into a DATE type. It shows a direct conversion of a literal timestamp value.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-cast.md#_snippet_10

LANGUAGE: SQL
CODE:

```
SELECT CAST('2024-02-01 12:34:56' AS DATE);
```

---

TITLE: Neon Postgres Connection String Example
DESCRIPTION: This example shows the structure of the connection string provided by Neon after creating a new project. This string is essential for connecting your Go application to the Neon Postgres database. Users must replace the bracketed placeholders with their actual database credentials.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/feature-flags-golang.md#_snippet_0

LANGUAGE: plaintext
CODE:

```
postgres://[user]:[password]@[hostname]/[dbname]?sslmode=require
```

---

TITLE: Connecting to Neon using database/sql and pgx/v5/stdlib in Go
DESCRIPTION: This Go snippet demonstrates connecting to a Neon PostgreSQL database using the standard `database/sql` package along with the `pgx/v5/stdlib` driver. It opens a database connection using a provided connection string, queries the PostgreSQL version, and prints it to the console. Error handling is included for connection and query operations.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/go.md#_snippet_0

LANGUAGE: Go
CODE:

```
package main

import (
    "context"
    "database/sql"
    "fmt"

    _ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
    connStr := "postgresql://[user]:[password]@[neon_hostname]/[dbname]?sslmode=require"
    db, err := sql.Open("postgres", connStr)
    if err != nil {
        panic(err)
    }
    defer db.Close()

    var version string
    if err := db.QueryRow("select version()").Scan(&version); err != nil {
        panic(err)
    }

    fmt.Printf("version=%s\n", version)
}
```

---

TITLE: Example Go Project Structure for Database Migrations
DESCRIPTION: This snippet illustrates a recommended directory structure for a Go application that incorporates database migrations. It shows the typical placement of `main.go`, internal application logic, and the dedicated `migrations` directory containing versioned `up.sql` and `down.sql` files for schema changes.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/golang-db-migrations-postgres.md#_snippet_1

LANGUAGE: text
CODE:

```
your-go-project/
├── cmd/
│   └── main.go
├── internal/
│   └── app/
├── migrations/
│   ├── 000001_create_users_table.up.sql
│   ├── 000001_create_users_table.down.sql
│   ├── 000002_add_user_roles.up.sql
│   └── 000002_add_user_roles.down.sql
└── go.mod
```

---

TITLE: Casting Current Timestamp to Date in PostgreSQL
DESCRIPTION: This SQL query demonstrates how to extract only the date part from the current timestamp. It uses the `NOW()` function to get the current timestamp and then casts it to a `DATE` data type using the `::date` cast operator, effectively truncating the time component.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-date.md#_snippet_4

LANGUAGE: SQL
CODE:

```
SELECT NOW()::date;
```

---

TITLE: Defining Prisma API Operations for Posts and Comments in TypeScript
DESCRIPTION: This snippet defines a set of API functions for interacting with a Postgres database via Prisma, specifically for managing posts and comments. It includes functions for fetching posts and comments, adding, editing, and deleting comments, and integrates an 'outbox' pattern to record changes for event-driven systems, ensuring data consistency and propagation.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/real-time-comments.md#_snippet_7

LANGUAGE: TypeScript
CODE:

```
// File: lib/prisma/api.ts

import prisma from '@/lib/prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export type Author = {
  id: number;
  image: string;
  username: string;
};

export type Comment = {
  id: number;
  postId: number;
  author: Author;
  content: string;
  createdAt: Date;
  optimistic?: boolean;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
};

export async function getPosts(): Promise<Post[]> {
  return await prisma.post.findMany({
    include: {
      comments: {
        include: {
          author: true,
        },
      },
    },
  });
}

export async function getPost(id: number): Promise<[Post, number]> {
  return await prisma.$transaction(async (tx) => {
    const post = await getPostTx(tx, id);
    type r = { nextval: number };
    const [{ nextval }] = await tx.$queryRaw<
      r[]
    >`SELECT nextval('outbox_sequence_id_seq')::integer`;
    return [post, nextval];
  });
}

async function getPostTx(tx: TxClient, id: number) {
  return await tx.post.findUniqueOrThrow({
    where: { id },
    include: {
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });
}

export async function getRandomUser() {
  const count = await prisma.user.count();
  return await prisma.user.findFirstOrThrow({
    skip: Math.floor(Math.random() * count),
  });
}

export type TxClient = Omit<PrismaClient, runtime.ITXClientDenyList>;

export async function addComment(
  tx: TxClient,
  mutationId: string,
  postId: number,
  authorId: number,
  content: string
): Promise<Prisma.outboxCreateInput> {
  const comment = await tx.comment.create({
    data: { postId, authorId, content },
    include: { author: true },
  });
  return {
    mutation_id: mutationId,
    channel: `post:${comment.postId}`,
    name: 'addComment',
    data: comment,
    headers: {},
  };
}

export async function editComment(
  tx: TxClient,
  mutationId: string,
  id: number,
  content: string
): Promise<Prisma.outboxCreateInput> {
  await tx.comment.findUniqueOrThrow({ where: { id } });
  const comment = await tx.comment.update({
    where: { id },
    data: { content },
    include: { author: true },
  });
  return {
    mutation_id: mutationId,
    channel: `post:${comment.postId}`,
    name: 'editComment',
    data: comment,
    headers: {},
  };
}

export async function deleteComment(
  tx: TxClient,
  mutationId: string,
  id: number
): Promise<Prisma.outboxCreateInput> {
  const comment = await tx.comment.delete({
    where: { id },
  });
  return {
    mutation_id: mutationId,
    channel: `post:${comment.postId}`,
    name: 'deleteComment',
    data: comment,
    headers: {},
  };
}

export async function withOutboxWrite(
  op: (tx: TxClient, ...args: any[]) => Promise<Prisma.outboxCreateInput>,
  ...args: any[]
) {
  return await prisma.$transaction(async (tx) => {
    const { mutation_id, channel, name, data, headers } = await op(tx, ...args);
    await tx.outbox.create({
      data: { mutation_id, channel, name, data, headers },
    });
  });
}
```

---

TITLE: Installing the Neon API Python SDK
DESCRIPTION: This snippet demonstrates how to install the `neon-api` Python SDK using `pip`, the Python package installer. This is the first step required to use the SDK in your Python projects, ensuring all necessary dependencies are met.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/reference/python-sdk.md#_snippet_0

LANGUAGE: Shell
CODE:

```
$ pip install neon-api
```

---

TITLE: Configuring Neon Connection Environment Variables (.env)
DESCRIPTION: This snippet shows the structure of a `.env` file used to store sensitive Neon database connection details. It includes `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`, and an optional `ENDPOINT_ID` for SNI-unaware clients, ensuring credentials are not hardcoded.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/node.md#_snippet_4

LANGUAGE: Shell
CODE:

```
PGHOST='[neon_hostname]'
PGDATABASE='[dbname]'
PGUSER='[user]'
PGPASSWORD='[password]'
ENDPOINT_ID='[endpoint_id]'
```

---

TITLE: `serverUser.getPermission(scope, permissionId[, options])` Method
DESCRIPTION: Retrieves a specific permission by its scope and ID, with optional error handling. Returns a Promise resolving to the `TeamPermission` object if found, or `null` based on options.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/neon-auth/sdk/nextjs/types/server-user.md#_snippet_9

LANGUAGE: typescript
CODE:

```
declare function getPermission(
  scope: string,
  permissionId: string,
  options?: {
    or?: 'return-null' | 'throw';
  }
): Promise<TeamPermission | null>;
```

LANGUAGE: APIDOC
CODE:

```
getPermission(scope, permissionId[, options])
  scope: The scope of the permission
  permissionId: The ID of the permission
  options: An object containing options:
    or: What to do if the permission is not found:
      "return-null": Return null (default)
      "throw": Throw an error
  Returns: Promise<TeamPermission | null>
```

---

TITLE: FastAPI Application Entry Point (main.py)
DESCRIPTION: This Python code defines the main FastAPI application, setting up lifecycle events for PostgreSQL connection management using `asynccontextmanager` and including product routes. It also configures Uvicorn for running the server, making it the primary entry point for the application.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/fastapi-async.md#_snippet_23

LANGUAGE: python
CODE:

```
from fastapi import FastAPI
from contextlib import asynccontextmanager
from database.postgres import init_postgres, close_postgres
from routes.product_routes import product_router
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_postgres()
    yield
    await close_postgres()


app: FastAPI = FastAPI(lifespan=lifespan, title="Async FastAPI PostgreSQL Inventory Manager")
app.include_router(product_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
```

---

TITLE: Installing Neon CLI via npm
DESCRIPTION: This command globally installs the Neon CLI using npm (Node Package Manager). npm must be installed on your system to use this method. This method is applicable across macOS, Windows, and Linux.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/reference/cli-quickstart.md#_snippet_1

LANGUAGE: shell
CODE:

```
npm i -g neonctl
```

---

TITLE: Rearranging Names with REGEXP_REPLACE() in PostgreSQL
DESCRIPTION: Demonstrates how to use REGEXP_REPLACE() to transform a 'first_name last_name' string into a 'last_name, first_name' format. It utilizes capturing groups (.*) and backreferences (\2, \1) to reorder the matched parts.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-string-functions/regexp_replace.md#_snippet_2

LANGUAGE: SQL
CODE:

```
SELECT REGEXP_REPLACE('John Doe','(.*) (.*)','\2, \1');
```

---

TITLE: Connecting to Neon Database with node-postgres in Serverless Functions (JavaScript)
DESCRIPTION: This snippet demonstrates how to connect to a Neon database using the `node-postgres` client within a Serverless Function. It initializes a connection pool with the database URL from environment variables and performs a simple query to fetch the PostgreSQL version, releasing the client after use. Requires `pg` package.
SOURCE: https://github.com/neondatabase/website/blob/main/public/llms/frameworks-nextjs.txt#_snippet_16

LANGUAGE: javascript
CODE:

```
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default async function handler(req, res) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    const { version } = rows[0];
    res.status(200).json({ version });
  } finally {
    client.release();
  }
}
```

---

TITLE: Implement Go Protected User Profile Handler
DESCRIPTION: This Go code defines a `UserHandler` with a `Profile` method that serves as a protected API endpoint. It retrieves the authenticated user's ID from the request context (set by the authentication middleware), fetches user data from a repository, and returns a JSON response of the user's profile. It demonstrates how to consume the user ID provided by the middleware.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/golang-jwt.md#_snippet_26

LANGUAGE: Go
CODE:

```
// handlers/user.go
package handlers

import (
    "encoding/json"
    "net/http"

    "github.com/yourusername/auth-system/middleware"
    "github.com/yourusername/auth-system/models"
)

// UserHandler contains HTTP handlers for user-related endpoints
type UserHandler struct {
    userRepo *models.UserRepository
}

// NewUserHandler creates a new user handler
func NewUserHandler(userRepo *models.UserRepository) *UserHandler {
    return &UserHandler{
        userRepo: userRepo,
    }
}

// UserResponse represents the user data returned to clients
type UserResponse struct {
    ID       string  `json:"id"`
    Email    string  `json:"email"`
    Username string  `json:"username"`
}

// Profile returns the authenticated user's profile
func (h *UserHandler) Profile(w http.ResponseWriter, r *http.Request) {
    // Get user ID from request context (set by auth middleware)
    userID, ok := middleware.GetUserID(r)
    if !ok {
        http.Error(w, "Unauthorized", http.StatusUnauthorized)
        return
    }

    // Get user from database
    user, err := h.userRepo.GetUserByID(userID)
    if err != nil {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }

    // Return user profile (excluding sensitive data)
    response := UserResponse{
        ID:       user.ID.String(),
        Email:    user.Email,
        Username: user.Username,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
```

---

TITLE: Inserting Data into a PostgreSQL Table with Auto-Generated UUIDs
DESCRIPTION: Inserts multiple rows into the `contacts` table without explicitly providing `contact_id` values. PostgreSQL automatically generates UUIDs for the `contact_id` column using the defined default function, and the `RETURNING *` clause shows the newly inserted rows including their generated UUIDs.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-uuid.md#_snippet_4

LANGUAGE: SQL
CODE:

```
INSERT INTO contacts ( first_name, last_name, email, phone)
VALUES
  ('John', 'Smith', 'john.smith@example.com',  '408-237-2345'),
  ('Jane', 'Smith', 'jane.smith@example.com', '408-237-2344'),
  ('Alex', 'Smith', 'alex.smith@example.com', '408-237-2343')
RETURNING *;
```

---

TITLE: Example Neon Postgres Connection String
DESCRIPTION: This snippet shows a typical Neon Postgres connection string, including the hostname, database name, and SSL mode. This string is used to connect applications to the Neon database.
SOURCE: https://github.com/neondatabase/website/blob/main/public/llms/import-migrate-mysql.txt#_snippet_0

LANGUAGE: bash
CODE:

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
```

---

TITLE: Example Neon Database Connection String
DESCRIPTION: An example of a Neon database connection string, illustrating the typical format including username, password, host, database name, and SSL mode, which is required for `pg_dump`.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/manage/backup-pg-dump.md#_snippet_1

LANGUAGE: bash
CODE:

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

TITLE: Install Node.js PostgreSQL client library
DESCRIPTION: This command installs the `pg` (node-postgres) package as a local dependency in your project. This library provides a pure JavaScript client for PostgreSQL, enabling your Lambda function to connect and interact with a PostgreSQL database.
SOURCE: https://github.com/neondatabase/website/blob/main/public/llms/guides-aws-lambda.txt#_snippet_4

LANGUAGE: bash
CODE:

```
npm install pg
```

---

TITLE: Configure Reflex Database Connection with Environment Variable
DESCRIPTION: Python code snippet for `rxconfig.py` showing how to configure the Reflex application to use an environment variable for the database connection string. This is a more secure and flexible approach, especially for production environments.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/reflex.md#_snippet_6

LANGUAGE: python
CODE:

```
import os

DATABASE_URL = os.getenv("NEON_DATABASE_URL")

config = rx.Config(
    app_name="new_project",
    db_url=DATABASE_URL,
)
```

---

TITLE: Set Local Database Environment Variable
DESCRIPTION: Illustrates how to set the `DATABASE_URL` environment variable in a `.env` file for local development. This variable is crucial for the Netlify function to connect to your Neon database instance.
SOURCE: https://github.com/neondatabase/website/blob/main/public/llms/guides-netlify-functions.txt#_snippet_10

LANGUAGE: text
CODE:

```
DATABASE_URL=YOUR_NEON_CONNECTION_STRING
```

---

TITLE: Creating a PL/pgSQL Money Transfer Stored Procedure
DESCRIPTION: This PL/pgSQL stored procedure, named `transfer`, facilitates transferring a specified `amount` from a `sender`'s account to a `receiver`'s account. It updates the balances in the `accounts` table by subtracting from the sender and adding to the receiver, then commits the transaction to ensure atomicity. This demonstrates transaction support within stored procedures.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-plpgsql/postgresql-create-procedure.md#_snippet_5

LANGUAGE: PL/pgSQL
CODE:

```
create or replace procedure transfer(
   sender int,
   receiver int,
   amount dec
)
language plpgsql
as $$
begin
    -- subtracting the amount from the sender's account
    update accounts
    set balance = balance - amount
    where id = sender;

    -- adding the amount to the receiver's account
    update accounts
    set balance = balance + amount
    where id = receiver;

    commit;
end;$$;
```

---

TITLE: Customer and Sensitive Data Encryption (AWS KMS and Azure Key Vault)
DESCRIPTION: Details Neon's encryption strategy for data at rest (AES-256) and in transit (TLS 1.2/1.3), specifying key management via AWS KMS and Azure Key Vault with rotation policies. Access to decryption keys is restricted via IAM roles and logged for auditing and compliance.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/security/security-overview.md#_snippet_0

LANGUAGE: APIDOC
CODE:

```
Encryption:
  Data at Rest: AES-256
  Data in Transit: TLS 1.2/1.3 protocols
  Key Management:
    - AWS Key Management Service (KMS)
    - Azure Key Vault
  Key Rotation: Policies in place
  Access Control:
    - Specific IAM roles for decryption key access
    - All access logged via AWS CloudTrail and Azure Monitor
```

---

TITLE: Running Authenticated Queries in Next.js Client Component
DESCRIPTION: This TypeScript snippet illustrates how to perform an authenticated database query from a Next.js client component. It utilizes `useUser` from `@stackframe/stack` to obtain the user's access token, which is then used to initialize the Neon client. The `useEffect` hook ensures that `todos` are loaded with RLS applied, restricting results to the current user's data.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/neon-rls-stack-auth.md#_snippet_10

LANGUAGE: TypeScript
CODE:

```
'use client';

import type { Todo } from '@/app/schema';
import { neon } => '@neondatabase/serverless';
import { useUser } from '@stackframe/stack';
import { useEffect, useState } from 'react';

const getDb = (token: string) =>
  neon(process.env.NEXT_PUBLIC_DATABASE_AUTHENTICATED_URL!, {
    authToken: token, // [!code highlight]
  });

export function TodoList() {
  const user = useUser();
  const [todos, setTodos] = useState<Array<Todo>>();

  useEffect(() => {
    async function loadTodos() {
      const authToken = (await user?.getAuthJson())?.accessToken; // [!code highlight]

      if (!authToken) {
        return;
      }

      const sql = getDb(authToken);

      // WHERE filter is optional because of RLS.
      // But we send it anyway for performance reasons.
      const todosResponse = await
        sql('select * from todos where user_id = auth.user_id()'); // [!code highlight]

      setTodos(todosResponse as Array<Todo>);
    }

    loadTodos();
  }, [user]);

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>
          {todo.task}
        </li>
      ))}
    </ul>
  );
}
```

---

TITLE: Connecting to Neon in Serverless Functions with node-postgres
DESCRIPTION: This snippet demonstrates connecting to a Neon database using the `node-postgres` Pool within a Next.js Serverless Function (API route). It establishes a connection, queries the PostgreSQL version, and returns it as a JSON response, ensuring the client is released after use.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/nextjs.md#_snippet_16

LANGUAGE: javascript
CODE:

```
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default async function handler(req, res) {
  const client = await pool.connect();
  try {
    const { rows } = await client.query('SELECT version()');
    const { version } = rows[0];
    res.status(200).json({ version });
  } finally {
    client.release();
  }
}
```

---

TITLE: Connecting to Neon in getStaticProps with node-postgres
DESCRIPTION: This snippet demonstrates connecting to a Neon database using the `node-postgres` Pool in a Next.js `getStaticProps` function. It establishes a connection, queries the PostgreSQL version, and releases the client, making the data available as props for the page.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/nextjs.md#_snippet_13

LANGUAGE: javascript
CODE:

```
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export async function getStaticProps() {
  const client = await pool.connect();
  try {
    const response = await client.query('SELECT version()');
    return { props: { data: response.rows[0].version } };
  } finally {
    client.release();
  }
}

export default function Page({ data }) {
  return <>{data}</>;
}
```

---

TITLE: Empty Ecto Migration File Structure (Elixir)
DESCRIPTION: This Elixir code block illustrates the basic structure of a newly generated Ecto migration file. It defines a module for the migration and includes an empty `change` function, where database schema modifications will be defined.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/elixir-ecto.md#_snippet_10

LANGUAGE: elixir
CODE:

```
defmodule Friends.Repo.Migrations.CreatePeople do
  use Ecto.Migration

  def change do

  end
end
```

---

TITLE: Implementing Product Price Resolver (JavaScript)
DESCRIPTION: This JavaScript resolver function, 'product/price.js', calculates a product's price based on its visit count. It connects to the Neon database, queries the 'product_visits' table to count entries for the given product 'id', and then returns the count as an integer. This simulates a dynamic pricing model based on customer interest.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/grafbase.md#_snippet_8

LANGUAGE: javascript
CODE:

```
import { Client } from '@neondatabase/serverless'

export default async function Resolver({ id }) {
  const client = new Client(process.env.DATABASE_URL)
  await client.connect()

  const {
    rows: [{ count }]
  } = await client.query(
    `SELECT COUNT(*) FROM product_visits WHERE product_id = '${id}'`
  )
  await client.end()

  return Number.parseInt(count)
}
```

---

TITLE: Creating a Sample PostgreSQL Customers Table
DESCRIPTION: This SQL script creates a customers table for demonstration purposes. It first ensures the table does not already exist using DROP TABLE IF EXISTS, then defines id as a SERIAL PRIMARY KEY and customer_name as a VARCHAR(255) NOT NULL column.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-add-column.md#_snippet_2

LANGUAGE: SQL
CODE:

```
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL
);
```

---

TITLE: Insert Single Vector Embeddings
DESCRIPTION: Inserts two new rows with specified 3-dimensional vector embeddings into the `items` table. This demonstrates basic data insertion for vector data.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/extensions/pgvector.md#_snippet_3

LANGUAGE: sql
CODE:

```
INSERT INTO items (embedding) VALUES ('[1,2,3]'), ('[4,5,6]');
```

---

TITLE: PostgreSQL: Basic Multi-Row INSERT Syntax
DESCRIPTION: Provides the fundamental SQL syntax for inserting multiple rows into a table using a single INSERT statement. It outlines the structure for specifying the table name, column list, and multiple comma-separated value lists, improving performance and ensuring atomicity.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-insert-multiple-rows.md#_snippet_0

LANGUAGE: shellsql
CODE:

```
INSERT INTO table_name (column_list)
VALUES
    (value_list_1),
    (value_list_2),
    ...
    (value_list_n);
```

---

TITLE: Implementing Database Service with postgres.js in NestJS
DESCRIPTION: This NestJS service ('AppService') demonstrates how to interact with the database using the 'postgres.js' client injected as 'POSTGRES_POOL'. The 'getTable' method directly executes a 'SELECT *' query for a given table name using the 'postgres.js' instance and returns the results.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/nestjs.md#_snippet_8

LANGUAGE: typescript
CODE:

```
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  async getTable(name: string): Promise<any[]> {
    return await this.sql(`SELECT * FROM ${name}`);
  }
}
```

---

TITLE: Retrieving All Employee Skills using jsonb_array_elements() - PostgreSQL
DESCRIPTION: This query uses `jsonb_array_elements()` to extract and expand the `skills` JSONB array from each row in the `employees` table. It flattens the array, returning each individual skill as a separate row, effectively listing all skills across all employees.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-json-functions/postgresql-jsonb_array_elements.md#_snippet_6

LANGUAGE: SQL
CODE:

```
SELECT jsonb_array_elements(skills) skills
FROM employees;
```

---

TITLE: Inserting Data for ON DELETE SET NULL Demo - SQL
DESCRIPTION: This SQL snippet inserts sample data into the `customers` and `contacts` tables, similar to the initial setup. This data is used to demonstrate the behavior of the `ON DELETE SET NULL` foreign key action.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-foreign-key.md#_snippet_7

LANGUAGE: sql
CODE:

```
INSERT INTO customers(customer_name)
VALUES('BlueBird Inc'),
      ('Dolphin LLC');

INSERT INTO contacts(customer_id, contact_name, phone, email)
VALUES(1,'John Doe','(408)-111-1234','john.doe@example.com'),
      (1,'Jane Doe','(408)-111-1235','jane.doe@example.com'),
      (2,'David Wright','(408)-222-1234','david.wright@example.com');
```

---

TITLE: Adding Foreign Key with ON DELETE CASCADE to Existing Table - SQL
DESCRIPTION: This SQL `ALTER TABLE` statement adds a new foreign key constraint to an existing child table, explicitly defining the `ON DELETE CASCADE` action. This ensures that when a referenced row in the parent table is deleted, all corresponding referencing rows in the child table are automatically removed.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-foreign-key.md#_snippet_16

LANGUAGE: SQL
CODE:

```
ALTER TABLE child_table
ADD CONSTRAINT constraint_fk
FOREIGN KEY (fk_columns)
REFERENCES parent_table(parent_key_columns)
ON DELETE CASCADE;
```

---

TITLE: Connecting to Neon with Postgres.js (JavaScript)
DESCRIPTION: This JavaScript code demonstrates connecting to a Neon database using the `postgres.js` client. It initializes the client with connection details from environment variables, enforces SSL, and executes a `SELECT version()` query to confirm the database connection, logging the first result.
SOURCE: https://github.com/neondatabase/website/blob/main/public/llms/frameworks-node.txt#_snippet_7

LANGUAGE: JavaScript
CODE:

```
require('dotenv').config();

const postgres = require('postgres');

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: "[username]",
  password: "[password]",
  port: 5432,
  ssl: 'require',
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result[0]);
}

getPgVersion();
```

---

TITLE: Installing node-postgres Dependencies (Shell)
DESCRIPTION: This command installs the `pg` package, the official Node.js client for PostgreSQL, and `dotenv` for loading environment variables. It's a common choice for connecting Node.js applications to PostgreSQL databases like Neon.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/node.md#_snippet_2

LANGUAGE: Shell
CODE:

```
npm install pg dotenv
```

---

TITLE: Querying Neon Database with Cognito Auth (Server-Side) - TypeScript
DESCRIPTION: This server-side Next.js component demonstrates how to fetch an AWS Cognito session token and use it to authenticate queries to a Neon database. It utilizes `aws-amplify/auth/server` and `runWithAmplifyServerContext` to retrieve the session, then passes the access token to the `neon` client's `authToken` option. Queries are automatically filtered by Row-Level Security (RLS) based on the authenticated user's ID.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/neon-rls-aws-cognito.md#_snippet_9

LANGUAGE: TypeScript
CODE:

```
"use server";

import { neon } from '@neondatabase/serverless';
import { cookies } from 'next/headers';
import { fetchAuthSession } from "aws-amplify/auth/server";
import { runWithAmplifyServerContext } from "@/app/utils/amplify-server-util";

async function getCognitoSession() {
  try {
    const session = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: (contextSpec) => fetchAuthSession(contextSpec),
    });

    if (!session?.tokens?.accessToken) {
      throw new Error('No valid session found');
    }

    return session.tokens.accessToken.toString();
  } catch (error) {
    console.error("Error fetching session:", error);
    throw new Error('Failed to authenticate session');
  }
}

export default async function TodoList() {
  const sql = neon(process.env.DATABASE_AUTHENTICATED_URL!, {
    authToken: async () => {
      const sessionToken = await getCognitoSession(); // [!code highlight]
      if (!sessionToken) {
        throw new Error('No session token available');
      }
      return sessionToken;
    },
  });

  // WHERE filter is optional because of RLS.
  // But we send it anyway for performance reasons.
  const todos = await sql('SELECT * FROM todos WHERE user_id = auth.user_id()'); // [!code highlight]

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.task}</li>
      ))}
    </ul>
  );
}
```

---

TITLE: Creating Table and Trigger for Automatic Timestamps in PostgreSQL
DESCRIPTION: This comprehensive SQL snippet creates an `articles` table with `created_at` and `updated_at` columns, both defaulting to `current_timestamp(3)`. It also defines a PL/pgSQL function `update_modified_column` and an `AFTER UPDATE` trigger `update_article_modtime` to automatically set the `updated_at` timestamp on record modification. Includes example `INSERT` statements to populate the table.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/functions/current_timestamp.md#_snippet_11

LANGUAGE: SQL
CODE:

```
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(3),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT current_timestamp(3)
);

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = current_timestamp(3);
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_article_modtime
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION modified_column();

INSERT INTO articles (title, content) VALUES ('First Article', 'Content here');
INSERT INTO articles (title, content) VALUES ('Second Article', 'Content here');
```

---

TITLE: Admin Page HTML Template for Feature Flags
DESCRIPTION: This HTML template defines the structure for the feature flag administration page. It uses Go template syntax (`{{range .Flags}}`, `{{.Name}}`, `{{.ID}}`, `{{if .Enabled}}`) to dynamically render a list of feature flags with toggle switches.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/feature-flags-golang.md#_snippet_21

LANGUAGE: HTML
CODE:

```
{{define "content"}}
<div class="dark:bg-gray-800 mb-8 rounded-lg bg-white p-6 shadow-md">
  <h2 class="text-gray-800 dark:text-gray-100 mb-3 text-2xl font-bold">
    Feature Flag Administration
  </h2>
  <p class="text-gray-600 dark:text-gray-300 mb-8">
    Toggle feature flags on and off. Changes take effect immediately for all users.
  </p>

  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2">
    {{range .Flags}}
    <div
      class="border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-lg border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow"
    >
      <div class="mb-4 flex items-start justify-between">
        <h3 class="text-gray-800 dark:text-gray-100 text-lg font-semibold">{{.Name}}</h3>
        <label class="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            class="flag-toggle peer sr-only"
            data-id="{{.ID}}"
            {{if
            .Enabled}}checked{{end}}
          />
          <div
            class="bg-gray-200 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 after:border-gray-300 dark:border-gray-600 peer-checked:bg-blue-600 peer h-6 w-11 rounded-full after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4"
          ></div>
        </label>
      </div>
      <p class="text-gray-600 dark:text-gray-300 mb-3">{{.Description}}</p>
      <p class="text-gray-500 dark:text-gray-400 font-mono text-xs">ID: {{.ID}}</p>
    </div>
    {{end}}
  </div>
</div>
```

---

TITLE: Connecting to Neon with postgres.js in Next.js Server Component
DESCRIPTION: Illustrates connecting to a Neon database using the `postgres.js` client within a Next.js App Router Server Component. It establishes a connection requiring SSL and executes a simple query to retrieve the PostgreSQL version, returning the result for display.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/nextjs.md#_snippet_5

LANGUAGE: javascript
CODE:

```
import postgres from 'postgres';

async function getData() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return response[0].version;
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
```

---

TITLE: Connecting to Neon with postgres.js in Next.js Server Component
DESCRIPTION: This Next.js Server Component utilizes the `postgres.js` client to establish a connection with a Neon database. It fetches the PostgreSQL version, showcasing how to perform server-side data queries efficiently using the `postgres` library.
SOURCE: https://github.com/neondatabase/website/blob/main/public/llms/frameworks-nextjs.txt#_snippet_5

LANGUAGE: javascript
CODE:

```
import postgres from 'postgres';

async function getData() {
  const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
  const response = await sql`SELECT version()`;
  return response[0].version;
}

export default async function Page() {
  const data = await getData();
  return <>{data}</>;
}
```

---

TITLE: Creating an HNSW Index for Vector Search in Postgres
DESCRIPTION: This command creates an HNSW (Hierarchical Navigable Small World) index on the `data` vector column. HNSW indexes are crucial for accelerating approximate nearest neighbor (ANN) searches, significantly improving performance on large datasets.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/vector-search.md#_snippet_5

LANGUAGE: SQL
CODE:

```
CREATE INDEX ON embeddings USING hnsw (data);
```

---

TITLE: Binding Parameter to PreparedStatement in Java
DESCRIPTION: This Java code snippet illustrates how to bind an integer parameter to the `PreparedStatement`. The `pstmt.setInt(1, id)` method sets the value of the first placeholder (`?`) in the SQL query to the provided `id`, ensuring safe and efficient parameter handling.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-jdbc/delete.md#_snippet_3

LANGUAGE: Java
CODE:

```
pstmt.setInt(1, id);
```

---

TITLE: Retrieving Cities by Country ID (Step 2)
DESCRIPTION: Illustrates how to select city names from the `city` table, filtered by a specific `country_id` (103). This query builds upon the previous step, using the retrieved country ID to find associated cities.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-subquery.md#_snippet_3

LANGUAGE: sql
CODE:

```
SELECT
  city
FROM
  city
WHERE
  country_id = 103
ORDER BY
  city;
```

LANGUAGE: text
CODE:

```
         city
-------------------------
 Akron
 Arlington
 Augusta-Richmond County
 Aurora
 Bellevue
 Brockton
 Cape Coral
 Citrus Heights
...
```

---

TITLE: PostgreSQL: Basic Multi-Row INSERT Example
DESCRIPTION: Demonstrates a practical application of the multi-row INSERT statement by adding three new contact records (John Doe, Jane Smith, Bob Johnson) into the contacts table. This example populates specific columns: first_name, last_name, and email.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-insert-multiple-rows.md#_snippet_3

LANGUAGE: sql
CODE:

```
INSERT INTO contacts (first_name, last_name, email)
VALUES
    ('John', 'Doe', 'john.doe@example.com'),
    ('Jane', 'Smith', 'jane.smith@example.com'),
    ('Bob', 'Johnson', 'bob.johnson@example.com');
```

---

TITLE: Declaring and Initializing Multiple PL/pgSQL Variables
DESCRIPTION: This example illustrates how to declare and initialize multiple PL/pgSQL variables of different data types (integer, varchar, numeric) within a DO block. It then uses raise notice to display their values, demonstrating basic variable usage.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-plpgsql/plpgsql-variables.md#_snippet_3

LANGUAGE: sql
CODE:

```
do $$
declare
   counter    integer = 1;
   first_name varchar(50) = 'John';
   last_name  varchar(50) = 'Doe';
   payment    numeric(11,2) = 20.5;
begin
   raise notice '% % % has been paid % USD',
       counter,
	   first_name,
	   last_name,
	   payment;
end $$;
```

---

TITLE: Create a new RedwoodSDK project
DESCRIPTION: Command to initialize a new RedwoodSDK project using the minimal starter template.
SOURCE: https://github.com/neondatabase/website/blob/main/public/llms/guides-redwoodsdk.txt#_snippet_0

LANGUAGE: bash
CODE:

```
npx degit redwoodjs/sdk/starters/minimal my-redwood-app
```

---

TITLE: Output of RETURNING Clause
DESCRIPTION: This output shows the ID returned by the INSERT statement when the RETURNING id clause is used, confirming the ID of the newly inserted row.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-tutorial/postgresql-insert.md#_snippet_19

LANGUAGE: text
CODE:

```
 id
----
  4
(1 row)
```

---

TITLE: Basic Syntax of PostgreSQL NOW() Function
DESCRIPTION: This snippet shows the basic syntax for calling the PostgreSQL NOW() function, which returns the current date and time with the database server's time zone. It requires no arguments.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-date-functions/postgresql-now.md#_snippet_0

LANGUAGE: sql
CODE:

```
NOW()
```

---

TITLE: Connecting to Neon and Querying with Serverless Driver (JavaScript)
DESCRIPTION: Demonstrates connecting to a Neon Postgres database using the `@neondatabase/serverless` driver within a Nuxt `defineCachedEventHandler`. It fetches the `databaseUrl` from runtime config, executes a `SELECT version()` query, and caches the result for a day to optimize performance.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/nuxt.md#_snippet_5

LANGUAGE: javascript
CODE:

```
import { neon } from '@neondatabase/serverless';

export default defineCachedEventHandler(
  async (event) => {
    const { databaseUrl } = useRuntimeConfig();
    const db = neon(databaseUrl);
    const result = await db`SELECT version()`;
    return result;
  },
  {
    maxAge: 60 * 60 * 24, // cache it for a day
  }
);
```

---

TITLE: Updating Books with Parameterized Query in C#
DESCRIPTION: This snippet shows how to update records in the 'books' table using an UPDATE statement with parameterized queries to prevent SQL injection. It uses ExecuteNonQuery() to get the number of affected rows.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/dotnet-npgsql.md#_snippet_7

LANGUAGE: csharp
CODE:

```
using (var conn = new NpgsqlConnection(connString))
{
    Console.Out.WriteLine("Opening connection");
    conn.Open();

    using (var command = new NpgsqlCommand(
        @"UPDATE books
          SET year_published = @year
          WHERE id = @id", conn))
    {
        command.Parameters.AddWithValue("id", 1);
        command.Parameters.AddWithValue("year", 1926);

        int nRows = command.ExecuteNonQuery();
        Console.Out.WriteLine($"Number of books updated={nRows}");
    }
}
```

---

TITLE: Syntax of LAST_VALUE() Function in PostgreSQL
DESCRIPTION: This snippet shows the general syntax for the `LAST_VALUE()` window function in PostgreSQL. It illustrates how to specify the `expression` to evaluate, the `PARTITION BY` clause for dividing the result set, and the `ORDER BY` clause for sorting within partitions.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-window-function/postgresql-last_value-function.md#_snippet_0

LANGUAGE: css
CODE:

```
LAST_VALUE ( expression )
OVER (
    [PARTITION BY partition_expression, ... ]
    ORDER BY sort_expression [ASC | DESC], ...
)
```

---

TITLE: Example Neon Pooled Database Connection String
DESCRIPTION: This snippet shows an example of a Neon Postgres database connection string with connection pooling enabled. The `-pooler` option is crucial for serverless environments like Cloudflare Workers to manage database connections efficiently.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/cloudflare-workers.md#_snippet_2

LANGUAGE: bash
CODE:

```
postgresql://alex:AbC123dEf@ep-cool-darkness-123456-pooler.us-east-2.aws.neon.tech/dbname?sslmode=require
```

---

TITLE: Initializing TypeORM DataSource with Neon Connection (TypeScript)
DESCRIPTION: This snippet demonstrates how to initialize TypeORM's DataSource to connect to a Neon PostgreSQL database. It configures the connection type as 'postgres', uses an environment variable `DATABASE_URL` for the connection string, and enforces SSL for secure communication. The `entities` array should be populated with your TypeORM entity definitions.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/typeorm.md#_snippet_0

LANGUAGE: typescript
CODE:

```
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: true,
  entities: [
    /*list of entities*/
  ],
});
```

---

TITLE: Install Neon Serverless Driver and WebSocket Dependencies
DESCRIPTION: This command installs the necessary packages for using the Neon serverless driver with Drizzle. It includes `@neondatabase/serverless` for the driver itself and `ws` for WebSocket support, along with its TypeScript type definitions.
SOURCE: https://github.com/neondatabase/website/blob/main/public/llms/guides-drizzle.txt#_snippet_1

LANGUAGE: bash
CODE:

```
npm install ws @neondatabase/serverless
npm install -D @types/ws
```

---

TITLE: Configuring Table Permissions for Authenticated and Anonymous Roles in Postgres
DESCRIPTION: This SQL snippet defines table-level permissions for the 'authenticated' and 'anonymous' roles in the 'public' schema. It grants SELECT, UPDATE, INSERT, and DELETE privileges on all existing and future tables, along with USAGE on the schema, enabling different access levels for logged-in and public users.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/neon-rls-stytch.md#_snippet_3

LANGUAGE: SQL
CODE:

```
-- For existing tables
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  to authenticated;

GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  to anonymous;

-- For future tables
ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
  TO authenticated;

ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
  TO anonymous;

-- Grant USAGE on "public" schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anonymous;
```

---

TITLE: Configuring Table Permissions for Authenticated and Anonymous Roles in Postgres
DESCRIPTION: These SQL commands set up table-level permissions for the authenticated and anonymous roles in the public schema. They grant SELECT, UPDATE, INSERT, and DELETE privileges on all existing and future tables, and USAGE on the schema, allowing both logged-in and unauthenticated users appropriate data access.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/neon-rls-google-identity.md#_snippet_1

LANGUAGE: SQL
CODE:

```
-- For existing tables
GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  to authenticated;

GRANT SELECT, UPDATE, INSERT, DELETE ON ALL TABLES
  IN SCHEMA public
  to anonymous;

-- For future tables
ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
  TO authenticated;

ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
  GRANT SELECT, UPDATE, INSERT, DELETE ON TABLES
  TO anonymous;

-- Grant USAGE on "public" schema
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anonymous;
```

---

TITLE: Delete Product by ID (DELETE)
DESCRIPTION: Deletes a product from the database based on its ID. The ID is provided as a path parameter. Returns a success message if the product is found and deleted, otherwise returns a 404 Not Found error. Includes error handling for database operations.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/fastapi-async.md#_snippet_15

LANGUAGE: Python
CODE:

```
@product_router.delete("/products/{id}")
async def delete_product(
    id: int = Path(..., ge=1),
    db_pool: asyncpg.Pool = Depends(get_postgres)
) -> dict:
    """
    Delete a product by its ID.

    Parameters
    ----------
    id : int
        The ID of the product to delete.
    db_pool : asyncpg.Pool, optional
        Database connection pool injected by dependency.

    Returns
    -------
    dict
        A message indicating the product was deleted.
    """
    query = "DELETE FROM products WHERE id = $1 RETURNING id"

    try:
        async with db_pool.acquire() as conn:
            result = await conn.fetchrow(query, id)
            if result:
                return {"message": "Product deleted successfully"}
            else:
                logger.warning(f"Product with ID {id} not found for deletion")
                raise HTTPException(status_code=404, detail="Product not found")
    except Exception as e:
        logger.error(f"Error deleting product: {e}")
        raise HTTPException(
            status_code=500, detail="Internal server error during product deletion"
        )
```

LANGUAGE: SQL
CODE:

```
DELETE FROM products WHERE id = $1 RETURNING id
```

---

TITLE: Configuring Database Connection String in .env File
DESCRIPTION: This snippet shows the content for a `.env` file, used to store the Neon Postgres connection string as an environment variable. This approach helps in securely managing sensitive database credentials outside the main codebase.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/entity-migrations.md#_snippet_5

LANGUAGE: Bash
CODE:

```
DATABASE_URL=NEON_POSTGRES_CONNECTION_STRING
```

---

TITLE: Removing Leading Spaces with LTRIM() in PostgreSQL
DESCRIPTION: This example illustrates the use of the LTRIM() function to remove all leading spaces from a string. Since the 'character' argument defaults to space, it is omitted here.
SOURCE: https://github.com/neondatabase/website/blob/main/content/postgresql/postgresql-string-functions/postgresql-ltrim.md#_snippet_2

LANGUAGE: SQL
CODE:

```
SELECT LTRIM('   PostgreSQL');
```

---

TITLE: Creating a New Laravel Project with Composer
DESCRIPTION: This command uses Composer to create a new Laravel project named `guide-neon-laravel`. The `--prefer-dist` flag ensures that the project is created from a distribution archive, which is generally faster for production environments.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/laravel-migrations.md#_snippet_1

LANGUAGE: bash
CODE:

```
composer create-project --prefer-dist laravel/laravel guide-neon-laravel
```

---

TITLE: Configuring Laravel Database Connection for Neon Postgres
DESCRIPTION: This snippet shows how to update the .env file in a Laravel project to establish a connection with a Neon Postgres database. It specifies the database driver, host, port, database name, username, and password, enabling Laravel to interact with the Neon instance.
SOURCE: https://github.com/neondatabase/website/blob/main/content/guides/laravel-overview.md#_snippet_0

LANGUAGE: env
CODE:

```
DB_CONNECTION=pgsql
DB_HOST=your-neon-hostname.neon.tech
DB_PORT=5432
DB_DATABASE=<your-database-name>
DB_USERNAME=<your-username>
DB_PASSWORD=<your-password>
```

---

TITLE: Installing Node-Postgres Dependencies (Shell)
DESCRIPTION: This command installs the `pg` package, which is the `node-postgres` client for PostgreSQL, and `dotenv` for managing environment variables. These are essential for connecting to Neon and securely handling credentials using the `node-postgres` client.
SOURCE: https://github.com/neondatabase/website/blob/main/content/docs/guides/express.md#_snippet_2

LANGUAGE: shell
CODE:

```
npm install pg dotenv
```
