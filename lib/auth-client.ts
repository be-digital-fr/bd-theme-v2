"use client";

import { createAuthClient } from "better-auth/react";

// Determine the base URL based on environment
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return window.location.origin;
  }
  // Server-side: use environment variable
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
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