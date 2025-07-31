import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SignUpForm />
    </Suspense>
  );
}

export const metadata = {
  title: "Inscription - BD Theme",
  description: "Créez votre compte BD Theme",
};