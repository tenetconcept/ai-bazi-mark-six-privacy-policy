import { Platform } from 'react-native';

// AdMob Ad Unit IDs
// Replace with your actual Ad Unit IDs from Google AdMob console

export const ADMOB_UNIT_IDS = {
  ios: {
    // Banner Ads - iOS版本需要在AdMob控制台創建iOS ad units
    luckyNumbersBanner: 'ca-app-pub-2314269403508483/3693629505', // 暫用Android ID，請創建iOS版本
    baziAnalysisBanner: 'ca-app-pub-2314269403508483/3222856215', // 暫用Android ID，請創建iOS版本
    historyBanner: 'ca-app-pub-2314269403508483/1067466160', // 暫用Android ID，請創建iOS版本
    
    // Interstitial Ad
    tabSwitchInterstitial: 'ca-app-pub-2314269403508483/7441302824', // 暫用Android ID，請創建iOS版本
  },
  android: {
    // Banner Ads - BaziMarkSix_LuckyNumbers_Banner
    luckyNumbersBanner: 'ca-app-pub-2314269403508483/3693629505',
    // BaziMarkSix_BaziAnalysis_Banner
    baziAnalysisBanner: 'ca-app-pub-2314269403508483/3222856215',
    // BaziMarkSix_History_Banner
    historyBanner: 'ca-app-pub-2314269403508483/1067466160',
    
    // Interstitial Ad - BaziMarkSix_TabSwitch_Interstitial
    tabSwitchInterstitial: 'ca-app-pub-2314269403508483/7441302824',
  },
};

// Helper function to get ad unit ID
export const getAdUnitId = (adType: keyof typeof ADMOB_UNIT_IDS.ios): string => {
  return Platform.OS === 'ios' 
    ? ADMOB_UNIT_IDS.ios[adType]
    : ADMOB_UNIT_IDS.android[adType];
};
