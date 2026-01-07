import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n, { initializeLanguage, setLanguage, LANGUAGES } from '../i18n';
import { loadSubscriptionStatus, SubscriptionStatus } from '../utils/storage';

const THEME_STORAGE_KEY = '@app_theme';
const FONT_SIZE_STORAGE_KEY = '@app_font_size';
const GENERATION_COUNT_KEY = '@generation_count';

export type FontSize = 'small' | 'medium' | 'large';

interface AppContextType {
  language: string;
  changeLanguage: (code: string) => Promise<void>;
  isSubscribed: boolean;
  subscriptionPlan: 'none' | 'monthly' | 'yearly';
  updateSubscription: (status: SubscriptionStatus) => void;
  isLoading: boolean;
  userDataVersion: number;
  triggerUserDataReload: () => void;
  isDarkMode: boolean;
  toggleTheme: () => Promise<void>;
  fontSize: FontSize;
  changeFontSize: (size: FontSize) => Promise<void>;
  generationCount: number;
  incrementGenerationCount: () => void;
  resetGenerationCount: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<string>('zh-TW');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<'none' | 'monthly' | 'yearly'>('none');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userDataVersion, setUserDataVersion] = useState<number>(0);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<FontSize>('medium');
  const [generationCount, setGenerationCount] = useState<number>(0);

  useEffect(() => {
    const init = async () => {
      try {
        // Initialize language
        const savedLanguage = await initializeLanguage();
        setLanguageState(savedLanguage);
        
        // Load subscription status
        const subscription = await loadSubscriptionStatus();
        setIsSubscribed(subscription.isSubscribed);
        setSubscriptionPlan(subscription.plan);
        
        // Load theme preference
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
        }
        
        // Load font size preference
        const savedFontSize = await AsyncStorage.getItem(FONT_SIZE_STORAGE_KEY);
        if (savedFontSize && ['small', 'medium', 'large'].includes(savedFontSize)) {
          setFontSize(savedFontSize as FontSize);
        }
        
        // Load generation count
        const savedCount = await AsyncStorage.getItem(GENERATION_COUNT_KEY);
        if (savedCount) {
          setGenerationCount(parseInt(savedCount, 10));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);

  const changeLanguage = async (code: string) => {
    await setLanguage(code);
    setLanguageState(code);
  };

  const updateSubscription = (status: SubscriptionStatus) => {
    setIsSubscribed(status.isSubscribed);
    setSubscriptionPlan(status.plan);
  };

  const triggerUserDataReload = () => {
    setUserDataVersion(prev => prev + 1);
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme ? 'dark' : 'light');
  };

  const changeFontSize = async (size: FontSize) => {
    setFontSize(size);
    await AsyncStorage.setItem(FONT_SIZE_STORAGE_KEY, size);
  };

  const incrementGenerationCount = async () => {
    const newCount = generationCount + 1;
    setGenerationCount(newCount);
    await AsyncStorage.setItem(GENERATION_COUNT_KEY, newCount.toString());
  };

  const resetGenerationCount = async () => {
    setGenerationCount(0);
    await AsyncStorage.setItem(GENERATION_COUNT_KEY, '0');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        changeLanguage,
        isSubscribed,
        subscriptionPlan,
        updateSubscription,
        isLoading,
        userDataVersion,
        triggerUserDataReload,
        isDarkMode,
        toggleTheme,
        fontSize,
        changeFontSize,
        generationCount,
        incrementGenerationCount,
        resetGenerationCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
