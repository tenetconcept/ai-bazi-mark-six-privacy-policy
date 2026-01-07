import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getColors, SPACING } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getAdUnitId } from '../constants/admob';

// Try to import AdMob, fallback if not available (Expo Go)
let BannerAd: any = null;
let BannerAdSize: any = null;
try {
  const admob = require('react-native-google-mobile-ads');
  BannerAd = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
} catch (error) {
  console.log('AdMob not available in Expo Go. Run expo prebuild for native ads.');
}

interface AdBannerProps {
  position?: 'top' | 'bottom';
  adType: 'luckyNumbersBanner' | 'baziAnalysisBanner' | 'historyBanner';
}

const AdBanner: React.FC<AdBannerProps> = ({ position = 'bottom', adType }) => {
  const { isSubscribed, isDarkMode } = useApp();
  const COLORS = getColors(isDarkMode);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: COLORS.backgroundDark,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: SPACING.xs,
      paddingBottom: 0,
    },
    top: {
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    bottom: {
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
    },
    placeholder: {
      height: 50,
      backgroundColor: COLORS.backgroundDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderText: {
      color: COLORS.textSecondary,
      fontSize: 12,
    },
  });
  
  // Don't show ads for subscribed users
  if (isSubscribed) {
    return null;
  }

  return (
    <View style={[styles.container, position === 'top' ? styles.top : styles.bottom]}>
      {BannerAd && BannerAdSize ? (
        <BannerAd
          unitId={getAdUnitId(adType)}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Ad Space (需要 expo prebuild)</Text>
        </View>
      )}
    </View>
  );
};

export default AdBanner;
