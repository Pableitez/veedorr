import { UserSettings, UpdateUserSettingsData } from '../../domain/entities';
import { AppState } from '../types';

export class SettingsSlice {
  private state: AppState;
  private eventBus: any;

  constructor(state: AppState, eventBus: any) {
    this.state = state;
    this.eventBus = eventBus;
  }

  // Acciones
  updateSettings(data: UpdateUserSettingsData): UserSettings {
    const updatedSettings = this.state.settings.update(data);
    this.state.settings = updatedSettings;
    this.emitChange();
    return updatedSettings;
  }

  setTheme(theme: 'dark' | 'light'): void {
    this.updateSettings({ theme });
  }

  setLocale(locale: 'es-ES'): void {
    this.updateSettings({ locale });
  }

  // Getters
  getSettings(): UserSettings {
    return this.state.settings;
  }

  getTheme(): 'dark' | 'light' {
    return this.state.settings.theme;
  }

  getLocale(): 'es-ES' {
    return this.state.settings.locale;
  }

  isDarkTheme(): boolean {
    return this.state.settings.isDarkTheme();
  }

  isLightTheme(): boolean {
    return this.state.settings.isLightTheme();
  }

  isSpanishLocale(): boolean {
    return this.state.settings.isSpanishLocale();
  }

  // Métodos privados
  private emitChange(): void {
    this.eventBus.emit('settings/changed', {
      settings: this.state.settings
    });
  }
}
