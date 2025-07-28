import { MultilingualValueSchema, MultilingualValueType } from '../schemas/HomeContentSchema';
import { LocaleCodeType } from '../../../locale/domain/schemas/LocaleSchema';

export class MultilingualValue {
  private readonly values: Map<string, string>;

  constructor(values: MultilingualValueType, defaultLocale: LocaleCodeType = 'fr') {
    // Validate input with Zod
    const validatedValues = MultilingualValueSchema.parse(values);
    
    this.values = new Map();
    
    if (typeof validatedValues === 'string') {
      this.values.set(defaultLocale, validatedValues);
    } else {
      Object.entries(validatedValues).forEach(([locale, value]) => {
        if (value && value.trim()) {
          this.values.set(locale, value);
        }
      });
    }
  }

  static fromData(data: MultilingualValueType, defaultLocale: LocaleCodeType = 'fr'): MultilingualValue {
    return new MultilingualValue(data, defaultLocale);
  }

  getLocalizedValue(locale: string, fallbackLocale: LocaleCodeType = 'fr'): string | undefined {
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

  toData(): MultilingualValueType {
    const obj = this.toObject();
    return Object.keys(obj).length === 1 && obj[Object.keys(obj)[0]] 
      ? Object.values(obj)[0] 
      : obj;
  }
}