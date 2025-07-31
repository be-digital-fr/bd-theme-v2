"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server action to get the current session
 */
export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

/**
 * Server action to require authentication
 * Redirects to signin if not authenticated
 */
export async function requireAuth() {
  const session = await getCurrentSession();
  
  if (!session) {
    redirect("/auth/signin");
  }
  
  return session;
}

/**
 * Server action to require admin role
 * Redirects to signin if not authenticated or not admin
 */
export async function requireAdmin() {
  const session = await requireAuth();
  
  // You can add admin role check here when implementing roles
  // if (!session.user.isAdmin) {
  //   redirect("/unauthorized");
  // }
  
  return session;
}

/**
 * Server action to update user profile
 */
export async function updateUserProfile(formData: FormData) {
  const session = await requireAuth();
  
  const name = formData.get("name") as string;
  
  if (!name || name.trim().length < 2) {
    throw new Error("Le nom doit contenir au moins 2 caractères");
  }
  
  try {
    await auth.api.updateUser({
      body: {
        name: name.trim(),
      },
      query: {
        userId: session.user.id,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error("Erreur lors de la mise à jour du profil");
  }
}

/**
 * Server action to sign out
 */
export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    redirect("/");
  } catch (error) {
    console.error("Error signing out:", error);
    redirect("/");
  }
}