import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

import {
  LuckyNumbersScreen,
  BaziAnalysisScreen,
  HistoryScreen,
  SettingsScreen,
} from '../screens';
import { getColors, FONTS, SPACING, getFontSizes } from '../constants/theme';
import i18n from '../i18n';
import { useApp } from '../context/AppContext';
import { useInterstitialAd } from '../components';
import { getAdUnitId } from '../constants/admob';

const Tab = createBottomTabNavigator();

interface TabNavigatorProps {
  shouldShowUserModal?: boolean;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ shouldShowUserModal = false }) => {
  const { language, isDarkMode, fontSize, generationCount, resetGenerationCount, isSubscribed } = useApp();
  const COLORS = getColors(isDarkMode);
  const FONT_SIZES = getFontSizes(fontSize);
  const insets = useSafeAreaInsets();
  const previousTabRef = useRef<string>('LuckyNumbers');
  
  // Initialize interstitial ad
  const { showAd } = useInterstitialAd({
    adUnitId: getAdUnitId('tabSwitchInterstitial'),
    onAdClosed: () => {
      resetGenerationCount();
    },
  });
  
  // Force re-render when language changes
  const getTabLabel = (key: string): string => {
    return i18n.t(`tabs.${key}`);
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tabBarBackground,
          borderTopWidth: 0,
          paddingTop: 0,
          paddingBottom: Platform.OS === 'ios' 
            ? (insets.bottom > 0 ? Math.max(insets.bottom - 24, 2) : 0)
            : (insets.bottom > 0 ? insets.bottom : SPACING.xs),
          height: Platform.OS === 'ios'
            ? 56 + (insets.bottom > 0 ? Math.max(insets.bottom - 24, 2) : 0)
            : 52 + (insets.bottom > 0 ? insets.bottom : 0),
        },
        tabBarItemStyle: {
          paddingTop: 0,
          paddingBottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarActiveTintColor: COLORS.tabBarActive,
        tabBarInactiveTintColor: COLORS.tabBarInactive,
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: '600',
          marginTop: Platform.OS === 'ios' ? 0 : 0,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'LuckyNumbers':
              iconName = focused ? 'sparkles' : 'sparkles-outline';
              break;
            case 'BaziAnalysis':
              iconName = focused ? 'planet' : 'planet-outline';
              break;
            case 'History':
              iconName = focused ? 'albums' : 'albums-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={Platform.OS === 'ios' ? 28 : 24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="LuckyNumbers"
        component={LuckyNumbersScreen}
        initialParams={{ shouldShowUserModal }}
        options={{
          tabBarLabel: getTabLabel('luckyNumbers'),
        }}
      />
      <Tab.Screen
        name="BaziAnalysis"
        component={BaziAnalysisScreen}
        options={{
          tabBarLabel: getTabLabel('baziAnalysis'),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarLabel: getTabLabel('history'),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: getTabLabel('settings'),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
