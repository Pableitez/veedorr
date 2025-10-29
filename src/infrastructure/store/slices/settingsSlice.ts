import { Settings, StoreState } from '../../../shared/types';

export interface SettingsSlice {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetSettings: () => void;
}

export const createSettingsSlice = (store: { getState: () => StoreState; setState: (state: StoreState) => void }): SettingsSlice => {
  const updateSettings = (updates: Partial<Settings>) => {
    const state = store.getState();
    const updatedSettings = {
      ...state.settings,
      ...updates,
    };
    
    store.setState({
      ...state,
      settings: updatedSettings,
    });
  };

  const resetSettings = () => {
    const state = store.getState();
    const defaultSettings: Settings = {
      currency: 'EUR',
      dateFormat: 'dd/mm/yyyy',
      theme: 'dark',
      language: 'es-ES',
    };
    
    store.setState({
      ...state,
      settings: defaultSettings,
    });
  };

  return {
    settings: store.getState().settings,
    updateSettings,
    resetSettings,
  };
};
