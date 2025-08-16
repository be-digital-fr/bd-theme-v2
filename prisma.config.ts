import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma',
  // Ensure environment variables are loaded
  envFile: '.env'
})