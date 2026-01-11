# Expo Cloud Build 指南 (EAS Build)

## 前置條件

1. 確保已登入 Expo 帳戶：
   ```bash
   npx eas login
   ```

2. 確保 `eas.json` 已正確配置

## 建置前檢查

每次建置前，執行以下命令檢查項目狀態：

```bash
npx expo-doctor
```

如果出現 `android/` 或 `ios/` 資料夾衝突錯誤，刪除這些資料夾：

```bash
# Windows PowerShell
Remove-Item -Recurse -Force android
Remove-Item -Recurse -Force ios

# macOS / Linux
rm -rf android ios
```

## 建置命令

### Android 預覽版 (APK)
```bash
npx eas build --platform android --profile preview
```

### Android 正式版 (AAB - 用於 Google Play)
```bash
npx eas build --platform android --profile production
```

### iOS 預覽版 (用於 TestFlight)
```bash
npx eas build --platform ios --profile preview
```

### iOS 正式版 (用於 App Store)
```bash
npx eas build --platform ios --profile production
```

### 同時建置 Android 和 iOS
```bash
npx eas build --platform all --profile production
```

## 下載建置檔案

建置完成後，可以：

1. **從終端下載**：建置完成會顯示下載連結
2. **從 Expo 網站下載**：
   - 前往 https://expo.dev
   - 登入後找到你的項目
   - 在 Builds 頁面下載 APK/AAB/IPA

## 常見問題解決

### 問題：Command "expo doctor" failed

**解決方案**：
```bash
# 刪除本地 native 資料夾
Remove-Item -Recurse -Force android   # Windows
rm -rf android                         # macOS/Linux

# 重新運行 doctor
npx expo-doctor
```

### 問題：版本號衝突

如果看到 `android.versionCode is ignored` 警告，可以在 `eas.json` 中設定：
```json
{
  "cli": {
    "appVersionSource": "remote"
  }
}
```

### 問題：建置失敗

查看詳細日誌：
```bash
npx eas build:list
npx eas build:view [BUILD_ID]
```

## 提交到商店

### Android (Google Play)
```bash
npx eas submit --platform android
```

### iOS (App Store)
```bash
npx eas submit --platform ios
```

## 建置 Profiles 說明

| Profile | 用途 | 輸出格式 |
|---------|------|----------|
| development | 開發測試 | APK (debug) |
| preview | 內部測試 | APK |
| production | 正式發布 | AAB (Android) / IPA (iOS) |

## 注意事項

1. **不要提交 android/ 和 ios/ 資料夾到 Git**（如果使用 EAS Build）
2. 每次建置前確保 `npx expo-doctor` 通過
3. 正式發布前測試 preview 版本
