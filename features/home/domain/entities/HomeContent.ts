import { MultilingualValue } from '../value-objects/MultilingualValue';
import { HomeContentSchema, HomeContentType, LocalizedHomeContentType } from '../schemas/HomeContentSchema';

export class HomeContent {
  constructor(
    public readonly id: string,
    public readonly title?: string,
    public readonly welcoming?: MultilingualValue,
    public readonly subtitle?: MultilingualValue,
    public readonly description?: MultilingualValue,
    public readonly content?: string
  ) {
    this.validate();
  }

  private validate(): void {
    HomeContentSchema.parse({
      id: this.id,
      title: this.title,
      welcoming: this.welcoming?.toData(),
      subtitle: this.subtitle?.toData(),
      description: this.description?.toData(),
      content: this.content,
    });
  }

  static fromData(data: HomeContentType): HomeContent {
    return new HomeContent(
      data.id,
      data.title,
      data.welcoming ? MultilingualValue.fromData(data.welcoming) : undefined,
      data.subtitle ? MultilingualValue.fromData(data.subtitle) : undefined,
      data.description ? MultilingualValue.fromData(data.description) : undefined,
      data.content
    );
  }

  toData(): HomeContentType {
    return {
      id: this.id,
      title: this.title,
      welcoming: this.welcoming?.toData(),
      subtitle: this.subtitle?.toData(),
      description: this.description?.toData(),
      content: this.content,
    };
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

  toLocalizedObject(locale: string): LocalizedHomeContentType {
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