export class AdminPreferences {
  constructor(
    public readonly id: string,
    public readonly isMultilingual: boolean,
    public readonly supportedLanguages: string[],
    public readonly defaultLanguage: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id) {
      throw new Error('AdminPreferences ID is required');
    }
    if (!this.defaultLanguage) {
      throw new Error('Default language is required');
    }
    if (!this.supportedLanguages.includes(this.defaultLanguage)) {
      throw new Error('Default language must be included in supported languages');
    }
  }

  isLanguageSupported(locale: string): boolean {
    return this.supportedLanguages.includes(locale);
  }

  updateDefaultLanguage(locale: string): AdminPreferences {
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