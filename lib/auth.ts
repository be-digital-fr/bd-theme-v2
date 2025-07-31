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
    "http://localhost:3001"
  ],
  plugins: [
    nextCookies(), // Essential for server actions - must be last plugin
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});

export type Session = typeof auth.$Infer.Session;