export type Theme = 'dark' | 'light';
export type Locale = 'es-ES';

export interface CreateUserSettingsData {
  theme?: Theme;
  locale?: Locale;
}

export interface UpdateUserSettingsData {
  theme?: Theme;
  locale?: Locale;
}

export class UserSettings {
  public readonly theme: Theme;
  public readonly locale: Locale;

  constructor(data: CreateUserSettingsData = {}) {
    this.theme = data.theme || 'dark';
    this.locale = data.locale || 'es-ES';
  }

  update(data: UpdateUserSettingsData): UserSettings {
    return new UserSettings({
      theme: data.theme ?? this.theme,
      locale: data.locale ?? this.locale,
    });
  }

  isDarkTheme(): boolean {
    return this.theme === 'dark';
  }

  isLightTheme(): boolean {
    return this.theme === 'light';
  }

  isSpanishLocale(): boolean {
    return this.locale === 'es-ES';
  }

  equals(other: UserSettings): boolean {
    return this.theme === other.theme && this.locale === other.locale;
  }

  toJSON() {
    return {
      theme: this.theme,
      locale: this.locale,
    };
  }

  static fromJSON(data: any): UserSettings {
    return new UserSettings({
      theme: data.theme,
      locale: data.locale,
    });
  }

  static getDefault(): UserSettings {
    return new UserSettings({
      theme: 'dark',
      locale: 'es-ES',
    });
  }
}
