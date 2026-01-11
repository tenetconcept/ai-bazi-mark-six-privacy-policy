# 六合彩分析 八字版 - Mark Six Analysis: Bazi Version

一個結合八字命理的六合彩號碼建議應用程式，支持 iOS 和 Android。

## 功能特色

### 🎯 幸運號碼
- 輸入出生日期、出生時間、出生地點
- 結合八字命理計算個人幸運號碼
- 建議購買地點
- 可儲存個人資料

### 📊 命理分析
- 顯示個人八字四柱（年柱、月柱、日柱、時柱）
- 五行分析
- 運勢分析（事業、財運、健康、感情）
- 幸運方位、顏色、數字

### 📜 歷史記錄
- 查看過去的號碼建議
- 包含日期、時間、號碼、購買地點

### ⚙️ 設定
- 訂閱方案管理
- 多語言支持（繁中/簡中/英文/菲律賓文/泰文/印度文）
- 個人資料重置
- 免責聲明、使用政策、私隱條款、玩法說明

## 技術架構

- **框架**: Expo SDK 52+ / React Native
- **語言**: TypeScript
- **導航**: React Navigation (Bottom Tabs)
- **八字計算**: lunar-typescript
- **多語言**: i18n-js + expo-localization
- **本地儲存**: AsyncStorage
- **廣告**: Google Mobile Ads
- **訂閱**: Expo In-App Purchases

## 開發指令

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm start

# 運行 Android
npm run android

# 運行 iOS
npm run ios

# 運行 Web
npm run web
```

## 使用 Expo Go 測試

1. 安裝 Expo Go app 到你的手機
2. 運行 `npm start`
3. 掃描 QR code 即可在手機上測試

## 構建發布版本

```bash
# 安裝 EAS CLI
npm install -g eas-cli

# 登入 Expo
eas login

# 構建 Android APK
eas build --platform android --profile preview

# 構建 iOS
eas build --platform ios --profile preview
```

## 盈利模式

1. **Google AdMob 廣告** - 底部橫幅廣告
2. **訂閱方案**:
   - 方案 A: HK$8/月 (免廣告)
   - 方案 B: HK$80/年 (免廣告)

## 設計風格

- 主色調: 紅色 (#C41E3A, #DC143C)
- 副色調: 金色 (#FFD700, #FFA500)
- 參考香港賽馬會六合彩 APP 2026 版設計

## 支持語言

| 語言 | 代碼 |
|------|------|
| 繁體中文 | zh-TW |
| 簡體中文 | zh-CN |
| English | en |
| Filipino | fil |
| ไทย | th |
| हिन्दी | hi |

## 目錄結構

```
bazi_app/
├── App.tsx                    # 應用入口
├── app.json                   # Expo 配置
├── package.json
├── src/
│   ├── components/            # 可重用組件
│   │   ├── AdBanner.tsx
│   │   ├── Card.tsx
│   │   ├── CustomButton.tsx
│   │   └── LotteryBall.tsx
│   ├── constants/             # 常量配置
│   │   ├── config.ts
│   │   └── theme.ts
│   ├── context/               # React Context
│   │   └── AppContext.tsx
│   ├── i18n/                  # 多語言
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── zh-TW.json
│   │       ├── zh-CN.json
│   │       ├── en.json
│   │       ├── fil.json
│   │       ├── th.json
│   │       └── hi.json
│   ├── navigation/            # 導航
│   │   └── TabNavigator.tsx
│   ├── screens/               # 頁面
│   │   ├── LuckyNumbersScreen.tsx
│   │   ├── BaziAnalysisScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── SettingsScreen.tsx
│   └── utils/                 # 工具函數
│       ├── baziCalculator.ts
│       └── storage.ts
└── assets/                    # 靜態資源
```

## 免責聲明

本應用程式僅供娛樂用途。所提供的號碼建議基於八字命理計算，不保證中獎。請理性投注。本應用與香港賽馬會無任何關聯。

## 授權

MIT License
