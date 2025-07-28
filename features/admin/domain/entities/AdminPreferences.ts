import { AdminPreferencesSchema, AdminPreferencesType } from '../schemas/AdminPreferencesSchema';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';

export class AdminPreferences {
  constructor(
    public readonly id: string,
    public readonly isMultilingual: boolean,
    public readonly supportedLanguages: LocaleCodeType[],
    public readonly defaultLanguage: LocaleCodeType
  ) {
    this.validate();
  }

  private validate(): void {
    AdminPreferencesSchema.parse({
      id: this.id,
      isMultilingual: this.isMultilingual,
      supportedLanguages: this.supportedLanguages,
      defaultLanguage: this.defaultLanguage,
    });
  }

  static fromData(data: AdminPreferencesType): AdminPreferences {
    return new AdminPreferences(
      data.id,
      data.isMultilingual,
      data.supportedLanguages,
      data.defaultLanguage
    );
  }

  toData(): AdminPreferencesType {
    return {
      id: this.id,
      isMultilingual: this.isMultilingual,
      supportedLanguages: this.supportedLanguages,
      defaultLanguage: this.defaultLanguage,
    };
  }

  isLanguageSupported(locale: string): boolean {
    return this.supportedLanguages.includes(locale as LocaleCodeType);
  }

  updateDefaultLanguage(locale: LocaleCodeType): AdminPreferences {
    if (!this.supportedLanguages.includes(locale)) {
      throw new Error('Cannot set unsupported language as default');
    }
    
    return new AdminPreferences(
      this.id,
      this.isMultilingual,
      this.supportedLanguages,
      locale
    );
  }

  toggleMultilingual(): AdminPreferences {
    const newSupportedLanguages = this.isMultilingual 
      ? [this.defaultLanguage] 
      : this.supportedLanguages;

    return new AdminPreferences(
      this.id,
      !this.isMultilingual,
      newSupportedLanguages,
      this.defaultLanguage
    );
  }
}