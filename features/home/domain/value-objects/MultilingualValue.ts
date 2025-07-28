export class MultilingualValue {
  private readonly values: Map<string, string>;

  constructor(values: Record<string, string> | string, defaultLocale: string = 'fr') {
    this.values = new Map();
    
    if (typeof values === 'string') {
      this.values.set(defaultLocale, values);
    } else {
      Object.entries(values).forEach(([locale, value]) => {
        if (value && value.trim()) {
          this.values.set(locale, value);
        }
      });
    }
  }

  getLocalizedValue(locale: string, fallbackLocale: string = 'fr'): string | undefined {
    return this.values.get(locale) || 
           this.values.get(fallbackLocale) || 
           this.getFirstAvailableValue();
  }

  private getFirstAvailableValue(): string | undefined {
    return Array.from(this.values.values())[0];
  }

  hasLocale(locale: string): boolean {
    return this.values.has(locale);
  }

  getAvailableLocales(): string[] {
    return Array.from(this.values.keys());
  }

  isEmpty(): boolean {
    return this.values.size === 0;
  }

  toObject(): Record<string, string> {
    return Object.fromEntries(this.values);
  }
}