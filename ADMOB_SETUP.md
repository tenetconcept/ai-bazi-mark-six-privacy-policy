# Google AdMob 設置指南

## 📋 Ad Unit Names 建議

在 Google AdMob Console 創建以下 Ad Units：

### Banner Ads (橫幅廣告)
1. **BaziMarkSix_LuckyNumbers_Banner**
   - 格式: Banner
   - 位置: 幸運號碼頁面底部
   - Partner bidding: 不勾選

2. **BaziMarkSix_BaziAnalysis_Banner**
   - 格式: Banner
   - 位置: 命理分析頁面底部
   - Partner bidding: 不勾選

3. **BaziMarkSix_History_Banner**
   - 格式: Banner
   - 位置: 歷史記錄頁面底部
   - Partner bidding: 不勾選

### Interstitial Ad (插頁廣告)
4. **BaziMarkSix_TabSwitch_Interstitial**
   - 格式: Interstitial
   - 觸發: 生成號碼3次後切換到命理分析或歷史記錄
   - Partner bidding: 不勾選

---

## 🔧 更新 Ad Unit IDs

創建完 Ad Units 後，更新 `src/constants/admob.ts`:

```typescript
export const ADMOB_UNIT_IDS = {
  ios: {
    luckyNumbersBanner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    baziAnalysisBanner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    historyBanner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    tabSwitchInterstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  },
  android: {
    luckyNumbersBanner: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ',
    baziAnalysisBanner: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ',
    historyBanner: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ',
    tabSwitchInterstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ',
  },
};
```

---

## 📱 廣告顯示邏輯

### Banner 廣告
- **幸運號碼**: 生成結果下方
- **命理分析**: 分析內容下方
- **歷史記錄**: 列表底部
- **條件**: 非訂閱用戶才顯示

### Interstitial 廣告
- **觸發條件**: 
  1. 生成號碼 ≥ 3 次
  2. 從幸運號碼頁切換到命理分析或歷史記錄
  3. 非訂閱用戶
- **重置**: 廣告關閉後計數器歸零

---

## ✅ 已完成設置

- ✅ AdBanner 組件 (react-native-google-mobile-ads)
- ✅ InterstitialAd Hook (react-native-google-mobile-ads)
- ✅ 3個 Banner 位置已加入
- ✅ Tab 切換時觸發 Interstitial
- ✅ 訂閱用戶隱藏廣告
- ✅ 生成計數追蹤
- ✅ 測試 Ad Unit IDs (需替換)

---

## 🚀 測試步驟

1. **安裝依賴** (已安裝):
   ```bash
   npm install react-native-google-mobile-ads
   ```

2. **測試 Banner 廣告**:
   - 打開幸運號碼、命理分析、歷史記錄頁面
   - 檢查底部是否顯示測試廣告

3. **測試 Interstitial 廣告**:
   - 生成號碼 3 次
   - 切換到命理分析或歷史記錄
   - 應該彈出全屏廣告

4. **測試訂閱**:
   - 購買訂閱後所有廣告應隱藏

---

## 📝 注意事項

- 測試時使用測試 Ad Unit IDs (已預設)
- 正式發布前必須替換成真實 Ad Unit IDs
- 避免自己點擊廣告 (會違反 AdMob 政策)
- 首次加載可能需要幾分鐘
