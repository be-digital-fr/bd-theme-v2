import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-actions';
import { SettingsEditor } from '@/components/admin/SettingsEditor';

export const metadata: Metadata = {
  title: 'Paramètres du site | Gestion de contenu',
  description: 'Modifiez les paramètres généraux, header, langues et navigation du site',
};

export default async function SettingsPage() {
  await requireAdmin();

  return <SettingsEditor />;
}