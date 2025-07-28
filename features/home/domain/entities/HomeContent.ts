import { MultilingualValue } from '../value-objects/MultilingualValue';

export class HomeContent {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly welcoming?: MultilingualValue,
    public readonly subtitle?: MultilingualValue,
    public readonly description?: MultilingualValue,
    public readonly content?: string
  ) {
    if (!id) {
      throw new Error('HomeContent ID is required');
    }
  }

  getLocalizedWelcoming(locale: string): string | undefined {
    return this.welcoming?.getLocalizedValue(locale);
  }

  getLocalizedSubtitle(locale: string): string | undefined {
    return this.subtitle?.getLocalizedValue(locale);
  }

  getLocalizedDescription(locale: string): string | undefined {
    return this.description?.getLocalizedValue(locale);
  }

  toLocalizedObject(locale: string) {
    return {
      id: this.id,
      title: this.title,
      welcoming: this.getLocalizedWelcoming(locale),
      subtitle: this.getLocalizedSubtitle(locale),
      description: this.getLocalizedDescription(locale),
      content: this.content,
    };
  }
}