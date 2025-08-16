# 🔐 Authentication Models (Better Auth)

## Vue d'ensemble

Ces modèles gèrent l'authentification et l'autorisation des utilisateurs via Better Auth.

## Modèles

### `users`
**Table principale des utilisateurs**
```prisma
model users {
  id            String     @id
  name          String?
  email         String     @unique
  emailVerified Boolean    @default(false)
  image         String?
  role          UserRole   @default(USER)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime
  accounts      accounts[]
  sessions      sessions[]
}
```

**Champs:**
- `email` - Email unique de l'utilisateur
- `emailVerified` - Statut de vérification de l'email
- `role` - Rôle de l'utilisateur (USER/EMPLOYEE/ADMIN)
- `image` - URL de l'avatar utilisateur

---

### `accounts`
**Comptes de connexion (OAuth, email/password)**
```prisma
model accounts {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime
  users                 users     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Fournisseurs supportés:**
- `credential` - Email/password
- `google` - OAuth Google  
- `facebook` - OAuth Facebook

---

### `sessions`
**Sessions utilisateur actives**
```prisma
model sessions {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  users     users    @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**Fonctionnalités:**
- Gestion automatique de l'expiration
- Tracking IP et User Agent
- Nettoyage automatique des sessions expirées

---

### `verifications`
**Tokens de vérification**
```prisma
model verifications {
  id         String   @id
  identifier String   // email ou user ID
  value      String   // token de vérification
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime
}
```

**Utilisations:**
- Vérification d'email lors de l'inscription
- Reset de mot de passe
- Changement d'email

---

### `UserRole` (Enum)
**Rôles utilisateur**
```prisma
enum UserRole {
  USER      // Utilisateur standard
  EMPLOYEE  // Employé (accès limité admin)
  ADMIN     // Administrateur complet
}
```

## Relations

- `users` ↔ `accounts` (1:N)
- `users` ↔ `sessions` (1:N)  
- `verifications` → standalone

## Sécurité

- Passwords hashés avec scrypt
- Sessions sécurisées côté serveur
- CSRF protection activée
- Tokens de vérification avec expiration