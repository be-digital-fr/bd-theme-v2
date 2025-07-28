import { AdminPreferences } from '../entities/AdminPreferences';

export interface IAdminPreferencesRepository {
  get(): Promise<AdminPreferences>;
  update(preferences: AdminPreferences): Promise<AdminPreferences>;
}