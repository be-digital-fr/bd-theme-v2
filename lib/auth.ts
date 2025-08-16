import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Set to true in production with email service
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  // Social providers configuration
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      enabled: !!process.env.FACEBOOK_CLIENT_ID && !!process.env.FACEBOOK_CLIENT_SECRET,
    },
  },
  // Email verification would be configured here in production
  // emailVerification: {
  //   sendVerificationEmail: async ({ user, url }) => {
  //     // Send verification email using your preferred service
  //     console.log(`Send verification email to ${user.email}: ${url}`);
  //   },
  // },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001"
  ],
  plugins: [
    nextCookies(), // Essential for server actions - must be last plugin
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    fetchUser: true, // Ensures user data is fetched with session
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;