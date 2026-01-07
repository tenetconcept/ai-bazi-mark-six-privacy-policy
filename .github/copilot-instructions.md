# 六合彩分析 八字版 - Mark Six Analysis: Bazi Version

## Project Overview
This is an Expo React Native app for iOS and Android that combines Bazi (Chinese astrology) with Mark Six lottery number suggestions.

## Tech Stack
- Expo SDK 52+
- React Native with TypeScript
- React Navigation (Bottom Tabs)
- lunar-typescript for Bazi calculations
- i18n-js for multi-language support
- AsyncStorage for local data persistence
- SQLite for fortune analysis database
- Google Mobile Ads
- Expo In-App Purchases

## Languages Supported
- Traditional Chinese (香港繁體中文) - Default
- Simplified Chinese (简体中文)
- English
- Filipino (Tagalog)
- Thai (ไทย)
- Hindi (हिन्दी)

## App Structure
- Tab 1: Lucky Numbers - Input name, birthdate, birthtime, birthplace to get lottery suggestions
- Tab 2: Bazi Analysis - Fortune reading based on user's Bazi
- Tab 3: History - Past lottery number suggestions
- Tab 4: Settings - Subscriptions, language, privacy, disclaimers

## Monetization
- Google AdMob ads
- Subscription Plan A: HKD $8/month (ad-free)
- Subscription Plan B: HKD $80/year (ad-free)

## Design Theme
- Primary: Red (#C41E3A, #DC143C)
- Secondary: Gold (#FFD700, #FFA500)
- Modern 2026 futuristic UI inspired by HKJC Mark Six app

## Commands
- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
