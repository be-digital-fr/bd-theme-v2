-- CreateTable
CREATE TABLE "admin_preferences" (
    "id" TEXT NOT NULL,
    "isMultilingual" BOOLEAN NOT NULL DEFAULT false,
    "supportedLanguages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultLanguage" TEXT NOT NULL DEFAULT 'fr',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_preferences_pkey" PRIMARY KEY ("id")
);
