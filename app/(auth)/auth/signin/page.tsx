import { Suspense } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = {
  title: "Connexion - BD Theme",
  description: "Connectez-vous à votre compte BD Theme",
};


export default function SignInPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SignInForm />
    </Suspense>
  );
}

