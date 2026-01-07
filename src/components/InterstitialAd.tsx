import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

// Try to import AdMob, fallback if not available (Expo Go)
let InterstitialAd: any = null;
let AdEventType: any = null;
try {
  const admob = require('react-native-google-mobile-ads');
  InterstitialAd = admob.InterstitialAd;
  AdEventType = admob.AdEventType;
} catch (error) {
  console.log('AdMob not available in Expo Go. Run expo prebuild for native ads.');
}

interface InterstitialAdConfig {
  adUnitId: string;
  onAdClosed?: () => void;
}

export const useInterstitialAd = (config: InterstitialAdConfig) => {
  const { isSubscribed } = useApp();
  const adLoadedRef = useRef(false);
  const interstitialRef = useRef<any | null>(null);

  useEffect(() => {
    // Don't load ads for subscribed users or if AdMob not available
    if (isSubscribed || !InterstitialAd || !AdEventType) {
      return;
    }

    // Create interstitial ad instance
    const interstitial = InterstitialAd.createForAdRequest(config.adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
    
    interstitialRef.current = interstitial;

    // Ad loaded listener
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      adLoadedRef.current = true;
      console.log('Interstitial ad loaded');
    });

    // Ad closed listener
    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      adLoadedRef.current = false;
      config.onAdClosed?.();
      // Preload next ad
      interstitial.load();
      console.log('Interstitial ad closed');
    });

    // Ad failed to load listener
    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
      console.log('Interstitial ad failed to load:', error);
      adLoadedRef.current = false;
    });

    // Load the ad
    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, [isSubscribed, config.adUnitId]);

  const showAd = () => {
    if (isSubscribed || !InterstitialAd) {
      console.log('Ad not shown: subscribed or AdMob not available');
      return;
    }

    if (adLoadedRef.current && interstitialRef.current) {
      interstitialRef.current.show();
      console.log('Showing interstitial ad');
    } else {
      console.log('Interstitial ad not ready yet (需要 expo prebuild)');
    }
  };

  return { showAd };
};

export default useInterstitialAd;
