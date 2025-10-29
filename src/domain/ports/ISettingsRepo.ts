import { UserSettings, UpdateUserSettingsData } from '../entities/UserSettings';

export interface ISettingsRepo {
  get(): Promise<UserSettings>;
  update(data: UpdateUserSettingsData): Promise<UserSettings>;
  reset(): Promise<UserSettings>;
}
