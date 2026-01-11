import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, Animated } from 'react-native';

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

const AnimatedIcon = ({ name, color, size, animationType }: { name: any; color: string; size: number; animationType: 'pulse' | 'rotate' | 'bounce' }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous animation loop
    let animation: Animated.CompositeAnimation | undefined;

    if (animationType === 'pulse') {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      );
    } else if (animationType === 'rotate') {
      animatedValue.setValue(0);
      animation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000, // 3 seconds per rotation
          easing: (t) => t, // Linear
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'bounce') {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: -5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          })
        ])
      );
    }

    animation?.start();

    return () => {
      animation?.stop();
    };
  }, [animationType]);

  const getStyle = () => {
    if (animationType === 'pulse') {
      return { transform: [{ scale: animatedValue }] };
    } else if (animationType === 'rotate') {
      const rotate = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
      });
      return { transform: [{ rotate }] };
    } else if (animationType === 'bounce') {
      return { transform: [{ translateY: animatedValue }] };
    }
    return {};
  };

  return (
    <Animated.View style={getStyle()}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
};

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
          borderTopWidth: 2,
          borderTopColor: '#FFD700',
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
        tabBarActiveTintColor: '#FF0000', // Bright Red for active
        tabBarInactiveTintColor: '#B8860B', // Dark Gold for inactive
        tabBarLabelStyle: {
          fontSize: FONT_SIZES.xs,
          fontWeight: 'bold', // Made bold
          marginTop: Platform.OS === 'ios' ? 0 : 0,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;
          let animationType: 'pulse' | 'rotate' | 'bounce' = 'pulse';

          switch (route.name) {
            case 'LuckyNumbers':
              iconName = focused ? 'sparkles' : 'sparkles-outline';
              animationType = 'pulse';
              break;
            case 'BaziAnalysis':
              iconName = focused ? 'planet' : 'planet-outline';
              animationType = 'rotate';
              break;
            case 'History':
              iconName = focused ? 'albums' : 'albums-outline';
              animationType = 'bounce';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              animationType = 'rotate';
              break;
            default:
              iconName = 'ellipse-outline';
              animationType = 'pulse';
          }

          return <AnimatedIcon name={iconName} color={color} size={Platform.OS === 'ios' ? 24 : 22} animationType={animationType} />;
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
