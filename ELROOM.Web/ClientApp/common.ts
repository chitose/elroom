import * as React from 'react';

import { ProfileInfo } from './model/profileInfo';

export const LANGUAGE_MODULES = ['common', 'security', 'validation', 'group', 'post'];

export interface DictionaryType<T> {
  [key: string]: T;
}

export interface AppSettings {
  passwordOptions: {
    requireDigit: boolean;
    requiredLength: number;
    requireLowercase: boolean;
    requireNonAlphanumeric: boolean;
    requireUppercase: boolean;
  };
}

export interface ServerInfos {
  language: string;
  userProfile: ProfileInfo;
  resources: I18next.ResourceStore;
  settings: AppSettings;
}