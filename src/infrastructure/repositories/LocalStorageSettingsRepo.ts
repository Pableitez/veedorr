import { ISettingsRepo } from '../../domain/ports/ISettingsRepo';
import { UserSettings, UpdateUserSettingsData } from '../../domain/entities/UserSettings';

export class LocalStorageSettingsRepo implements ISettingsRepo {
  private readonly storageKey = 'vedor.settings';

  private getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        return UserSettings.getDefault();
      }
      
      const parsed = JSON.parse(data);
      return UserSettings.fromJSON(parsed);
    } catch (error) {
      console.error('Error al cargar configuración desde LocalStorage:', error);
      return UserSettings.getDefault();
    }
  }

  private saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings.toJSON()));
    } catch (error) {
      console.error('Error al guardar configuración en LocalStorage:', error);
      throw new Error('No se pudo guardar la configuración');
    }
  }

  async get(): Promise<UserSettings> {
    return this.getSettings();
  }

  async update(data: UpdateUserSettingsData): Promise<UserSettings> {
    const currentSettings = this.getSettings();
    const updatedSettings = currentSettings.update(data);
    
    this.saveSettings(updatedSettings);
    return updatedSettings;
  }

  async reset(): Promise<UserSettings> {
    const defaultSettings = UserSettings.getDefault();
    this.saveSettings(defaultSettings);
    return defaultSettings;
  }
}
