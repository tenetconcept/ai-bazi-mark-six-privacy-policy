import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

export interface UserData {
  name: string;
  birthDate: Date;
  birthTime: number; // Hour (0-23)
  birthPlace: string;
  gender: 'male' | 'female';
}

export interface HistoryRecord {
  id: string;
  date: string;
  time: string;
  numbers: number[];
  specialNumber: number;
  location: string;
  locationAddress?: string;
  locationLat?: number;
  locationLng?: number;
  userName: string;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  plan: 'none' | 'monthly' | 'yearly';
  expiryDate?: string;
}

// User data functions
export const saveUserData = async (userData: UserData): Promise<void> => {
  try {
    const dataToSave = {
      ...userData,
      birthDate: userData.birthDate.toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(dataToSave));
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
};

export const loadUserData = async (): Promise<UserData | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        birthDate: new Date(parsed.birthDate),
      };
    }
    return null;
  } catch (error) {
    console.error('Error loading user data:', error);
    return null;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

// History functions
export const saveHistory = async (record: HistoryRecord): Promise<void> => {
  try {
    const existingHistory = await loadHistory();
    const newHistory = [record, ...existingHistory].slice(0, 100); // Keep last 100 records
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving history:', error);
    throw error;
  }
};

export const loadHistory = async (): Promise<HistoryRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    if (data) {
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Error loading history:', error);
    return [];
  }
};

export const clearHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
};

export const deleteHistoryItem = async (id: string): Promise<void> => {
  try {
    const history = await loadHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting history item:', error);
    throw error;
  }
};

// Subscription functions
export const saveSubscriptionStatus = async (status: SubscriptionStatus): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(status));
  } catch (error) {
    console.error('Error saving subscription status:', error);
    throw error;
  }
};

export const loadSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    if (data) {
      return JSON.parse(data);
    }
    return { isSubscribed: false, plan: 'none' };
  } catch (error) {
    console.error('Error loading subscription status:', error);
    return { isSubscribed: false, plan: 'none' };
  }
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format date for display
export const formatDate = (date: Date, locale: string = 'zh-TW'): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };
  
  if (locale.startsWith('zh')) {
    return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`;
  }
  
  return date.toLocaleDateString(locale, options);
};

// Format time for display
export const formatTime = (date: Date, locale: string = 'zh-TW'): string => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleTimeString(locale, options);
};
