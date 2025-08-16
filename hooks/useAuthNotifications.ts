// Hook simplifié qui utilise le nouveau système de traductions Prisma
export function useAuthNotifications() {
  return {
    notifications: {
      signinSuccess: 'Connexion réussie ! Bienvenue.',
      signupSuccess: 'Compte créé avec succès ! Bienvenue.',
      signoutSuccess: 'Déconnexion réussie. À bientôt !',
      forgotSent: 'Lien de réinitialisation envoyé par e-mail.',
      passwordReset: 'Mot de passe réinitialisé avec succès.',
    },
    isLoading: false
  };
}