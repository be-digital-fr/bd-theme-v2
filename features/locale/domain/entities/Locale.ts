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
    if (!this.code || this.code.length !== 2) {
      throw new Error('Locale code must be exactly 2 characters');
    }
    if (!this.name || !this.nativeName) {
      throw new Error('Locale name and native name are required');
    }
  }

  equals(other: Locale): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}