"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});

// Export commonly used methods for convenience
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  resetPassword,
  sendVerificationEmail,
} = authClient;

// OAuth helper functions
export const signInWithGoogle = () => {
  return authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard", // Redirect after successful login
  });
};

export const signInWithFacebook = () => {
  return authClient.signIn.social({
    provider: "facebook",
    callbackURL: "/dashboard", // Redirect after successful login
  });
};