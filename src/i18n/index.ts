import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import zhTW from './locales/zh-TW.json';
import zhCN from './locales/zh-CN.json';
import en from './locales/en.json';
import id from './locales/id.json';
import fil from './locales/fil.json';
import th from './locales/th.json';
import hi from './locales/hi.json';

const i18n = new I18n({
  'zh-TW': zhTW,
  'zh-Hant': zhTW,
  'zh-HK': zhTW,
  'zh-CN': zhCN,
  'zh-Hans': zhCN,
  'zh': zhCN,
  'en': en,
  'en-US': en,
  'en-GB': en,
  'id': id,
  'fil': fil,
  'tl': fil,
  'th': th,
  'hi': hi,
});

i18n.defaultLocale = 'zh-TW';
i18n.enableFallback = true;

// Language options for settings
export const LANGUAGES = [
  { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文' },
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino (Tagalog)' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
];

const LANGUAGE_STORAGE_KEY = '@app_language';

// Map device locale to supported language
const mapDeviceLocaleToSupported = (deviceLocale: string): string => {
  // Handle Chinese variants
  if (deviceLocale.startsWith('zh-HK') || deviceLocale.startsWith('zh-Hant') || deviceLocale.startsWith('zh-TW')) {
    return 'zh-TW'; // Traditional Chinese
  }
  if (deviceLocale.startsWith('zh')) {
    return 'zh-CN'; // Simplified Chinese
  }
  
  // Handle English variants
  if (deviceLocale.startsWith('en')) {
    return 'en';
  }
  
  // Handle Indonesian variants
  if (deviceLocale.startsWith('id') || deviceLocale.startsWith('in')) {
    return 'id';
  }
  
  // Handle Filipino variants
  if (deviceLocale.startsWith('fil') || deviceLocale.startsWith('tl')) {
    return 'fil';
  }
  
  // Handle Thai
  if (deviceLocale.startsWith('th')) {
    return 'th';
  }
  
  // Handle Hindi
  if (deviceLocale.startsWith('hi')) {
    return 'hi';
  }
  
  // Default to Traditional Chinese for unsupported languages
  return 'zh-TW';
};

// Initialize language from storage or device locale
export const initializeLanguage = async (): Promise<string> => {
  try {
    // Check if user has saved language preference
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      i18n.locale = savedLanguage;
      return savedLanguage;
    }
    
    // Auto-detect device language
    const deviceLocale = Localization.getLocales()?.[0]?.languageTag || 'zh-TW';
    const mappedLocale = mapDeviceLocaleToSupported(deviceLocale);
    
    i18n.locale = mappedLocale;
    return mappedLocale;
  } catch (error) {
    console.error('Error initializing language:', error);
    i18n.locale = 'zh-TW';
    return 'zh-TW';
  }
};

// Change and save language
export const setLanguage = async (languageCode: string): Promise<void> => {
  try {
    i18n.locale = languageCode;
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

// Get current language
export const getCurrentLanguage = (): string => {
  return i18n.locale;
};

// Get app name based on current language
export const getAppName = (): string => {
  const locale = i18n.locale;
  if (locale === 'zh-TW' || locale === 'zh-HK' || locale === 'zh-Hant') {
    return '六合彩分析 八字版';
  }
  return 'Mark Six Analysis: Bazi Version';
};

export default i18n;
