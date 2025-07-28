import { LocaleSchema, LocaleType } from '../schemas/LocaleSchema';

export class Locale {
  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly nativeName: string,
    public readonly flag: string
  ) {
    this.validate();
  }

  private validate(): void {
    LocaleSchema.parse({
      code: this.code,
      name: this.name,
      nativeName: this.nativeName,
      flag: this.flag,
    });
  }

  static fromData(data: LocaleType): Locale {
    return new Locale(data.code, data.name, data.nativeName, data.flag);
  }

  toData(): LocaleType {
    return {
      code: this.code,
      name: this.name,
      nativeName: this.nativeName,
      flag: this.flag,
    };
  }

  equals(other: Locale): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}