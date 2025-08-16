import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-actions';
import { SiteSettingsPage } from '@/components/admin/site-settings/SiteSettingsPage';

export const metadata: Metadata = {
  title: 'Réglages du site | Administration',
  description: 'Configurez les paramètres généraux, le header, les langues et la navigation de votre site',
};

export default async function AdminSiteSettingsPage() {
  await requireAdmin();

  return <SiteSettingsPage />;
}