import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { getColors, SPACING, BORDER_RADIUS, FONTS, SHADOWS, getFontSizes } from '../constants/theme';
import { BIRTH_PLACES } from '../constants/config';
import { Card, AdBanner } from '../components';
import {
  calculateBazi,
  BaziResult,
  FIVE_ELEMENTS,
  ELEMENT_COLORS,
  ELEMENT_DIRECTIONS,
} from '../utils/baziCalculator';
import { loadUserData, UserData } from '../utils/storage';
import i18n from '../i18n';
import { useApp } from '../context/AppContext';

const BaziAnalysisScreen: React.FC = () => {
  const { language, isSubscribed, userDataVersion, isDarkMode, fontSize } = useApp();
  const COLORS = getColors(isDarkMode);
  const FONT_SIZES = getFontSizes(fontSize);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.xl,
      borderBottomLeftRadius: BORDER_RADIUS.xxl,
      borderBottomRightRadius: BORDER_RADIUS.xxl,
    },
    headerTitle: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: 'bold',
      color: COLORS.textWhite,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textWhite,
      opacity: 0.9,
      textAlign: 'center',
      marginTop: SPACING.xs,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.textSecondary,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xl,
    },
    emptyText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.textSecondary,
      textAlign: 'center',
      marginTop: SPACING.lg,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: SPACING.lg,
    },
    userCard: {
      marginBottom: SPACING.lg,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userDetails: {
      marginLeft: SPACING.md,
      flex: 1,
    },
    userName: {
      fontSize: FONT_SIZES.lg,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      marginBottom: SPACING.xs,
    },
    userMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.xs,
    },
    userMeta: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      marginLeft: SPACING.xs,
    },
    userBirth: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
    },
    baziCard: {
      marginBottom: SPACING.lg,
    },
    pillarsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    pillar: {
      alignItems: 'center',
    },
    pillarLabel: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textSecondary,
      marginBottom: SPACING.sm,
    },
    pillarChars: {
      alignItems: 'center',
    },
    stemChar: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: 'bold',
      marginBottom: SPACING.xs,
    },
    branchChar: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: 'bold',
    },
    elementsCard: {
      marginBottom: SPACING.lg,
    },
    elementsContainer: {},
    elementItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.md,
    },
    elementCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    elementChar: {
      fontSize: FONT_SIZES.md,
      fontWeight: 'bold',
      color: COLORS.textWhite,
    },
    elementName: {
      width: 40,
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      marginLeft: SPACING.sm,
    },
    elementBar: {
      flex: 1,
      height: 8,
      backgroundColor: COLORS.backgroundDark,
      borderRadius: 4,
      marginHorizontal: SPACING.md,
    },
    elementBarFill: {
      height: '100%',
      borderRadius: 4,
    },
    elementCount: {
      width: 20,
      fontSize: FONT_SIZES.md,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      textAlign: 'right',
    },
    fortuneCard: {
      marginBottom: SPACING.lg,
    },
    fortuneItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.borderLight,
    },
    fortuneLabel: {
      flex: 1,
      fontSize: FONT_SIZES.md,
      color: COLORS.textPrimary,
      marginLeft: SPACING.md,
    },
    fortuneStars: {
      fontSize: FONT_SIZES.md,
    },
    luckyCard: {
      marginBottom: SPACING.lg,
    },
    luckyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
    },
    luckyLabel: {
      flex: 1,
      fontSize: FONT_SIZES.md,
      color: COLORS.textPrimary,
      marginLeft: SPACING.md,
    },
    luckyValue: {
      fontSize: FONT_SIZES.lg,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    bottomSpacer: {
      height: SPACING.xxl,
    },
  });

  const [userData, setUserData] = useState<UserData | null>(null);
  const [baziResult, setBaziResult] = useState<BaziResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userDataVersion]);

  const loadData = async () => {
    setIsLoading(true);
    const data = await loadUserData();
    if (data) {
      setUserData(data);
      const year = data.birthDate.getFullYear();
      const month = data.birthDate.getMonth() + 1;
      const day = data.birthDate.getDate();
      const result = calculateBazi(year, month, day, data.birthTime);
      setBaziResult(result);
    }
    setIsLoading(false);
  };

  const getElementColor = (element: string): string => {
    switch (element) {
      case '木': return '#228B22';
      case '火': return '#DC143C';
      case '土': return '#DAA520';
      case '金': return '#C0C0C0';
      case '水': return '#4169E1';
      default: return COLORS.textPrimary;
    }
  };

  const getFortuneLevel = (count: number): { text: string; color: string } => {
    if (count >= 3) return { text: '★★★★★', color: COLORS.secondary };
    if (count >= 2) return { text: '★★★★☆', color: COLORS.secondary };
    if (count >= 1) return { text: '★★★☆☆', color: COLORS.secondaryDark };
    return { text: '★★☆☆☆', color: COLORS.textLight };
  };

  const getDirectionName = (direction: string): string => {
    switch (direction) {
      case '東': return language.startsWith('zh') ? '東方' : 'East';
      case '南': return language.startsWith('zh') ? '南方' : 'South';
      case '西': return language.startsWith('zh') ? '西方' : 'West';
      case '北': return language.startsWith('zh') ? '北方' : 'North';
      case '中': return language.startsWith('zh') ? '中央' : 'Center';
      default: return direction;
    }
  };

  const getColorName = (color: string): string => {
    const colorMap: Record<string, Record<string, string>> = {
      'zh-TW': {
        green: '綠色', blue: '藍色', red: '紅色', orange: '橙色',
        purple: '紫色', yellow: '黃色', brown: '棕色', beige: '米色',
        white: '白色', gold: '金色', silver: '銀色', black: '黑色', grey: '灰色',
      },
      'zh-CN': {
        green: '绿色', blue: '蓝色', red: '红色', orange: '橙色',
        purple: '紫色', yellow: '黄色', brown: '棕色', beige: '米色',
        white: '白色', gold: '金色', silver: '银色', black: '黑色', grey: '灰色',
      },
      en: {
        green: 'Green', blue: 'Blue', red: 'Red', orange: 'Orange',
        purple: 'Purple', yellow: 'Yellow', brown: 'Brown', beige: 'Beige',
        white: 'White', gold: 'Gold', silver: 'Silver', black: 'Black', grey: 'Grey',
      },
    };

    const locale = language.startsWith('zh') ? (language === 'zh-CN' ? 'zh-CN' : 'zh-TW') : 'en';
    return colorMap[locale][color] || color;
  };

  const getBirthPlaceName = (code: string): string => {
    return i18n.t(`birthPlaces.${code}`);
  };

  const formatBirthTime = (hour: number): string => {
    const h = hour.toString().padStart(2, '0');
    return `${h}:00`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>{i18n.t('baziAnalysis.title')}</Text>
          <Text style={styles.headerSubtitle}>{i18n.t('baziAnalysis.subtitle')}</Text>
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{i18n.t('common.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData || !baziResult) {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>{i18n.t('baziAnalysis.title')}</Text>
          <Text style={styles.headerSubtitle}>{i18n.t('baziAnalysis.subtitle')}</Text>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={60} color={COLORS.textLight} />
          <Text style={styles.emptyText}>{i18n.t('baziAnalysis.enterInfoFirst')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{i18n.t('baziAnalysis.title')}</Text>
        <Text style={styles.headerSubtitle}>{i18n.t('baziAnalysis.subtitle')}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bazi Pillars */}
        <Card title={i18n.t('baziAnalysis.yourBazi')} style={styles.baziCard}>
          <View style={styles.pillarsContainer}>
            {/* Year Pillar */}
            <View style={styles.pillar}>
              <Text style={styles.pillarLabel}>{i18n.t('baziAnalysis.yearPillar')}</Text>
              <View style={styles.pillarChars}>
                <Text style={[styles.stemChar, { color: getElementColor(FIVE_ELEMENTS[baziResult.yearPillar.stem as keyof typeof FIVE_ELEMENTS]) }]}>
                  {baziResult.yearPillar.stem}
                </Text>
                <Text style={[styles.branchChar, { color: getElementColor(FIVE_ELEMENTS[baziResult.yearPillar.branch as keyof typeof FIVE_ELEMENTS]) }]}>
                  {baziResult.yearPillar.branch}
                </Text>
              </View>
            </View>

            {/* Month Pillar */}
            <View style={styles.pillar}>
              <Text style={styles.pillarLabel}>{i18n.t('baziAnalysis.monthPillar')}</Text>
              <View style={styles.pillarChars}>
                <Text style={[styles.stemChar, { color: getElementColor(FIVE_ELEMENTS[baziResult.monthPillar.stem as keyof typeof FIVE_ELEMENTS]) }]}>
                  {baziResult.monthPillar.stem}
                </Text>
                <Text style={[styles.branchChar, { color: getElementColor(FIVE_ELEMENTS[baziResult.monthPillar.branch as keyof typeof FIVE_ELEMENTS]) }]}>
                  {baziResult.monthPillar.branch}
                </Text>
              </View>
            </View>

            {/* Day Pillar */}
            <View style={styles.pillar}>
              <Text style={styles.pillarLabel}>{i18n.t('baziAnalysis.dayPillar')}</Text>
              <View style={styles.pillarChars}>
                <Text style={[styles.stemChar, { color: getElementColor(FIVE_ELEMENTS[baziResult.dayPillar.stem as keyof typeof FIVE_ELEMENTS]) }]}>
                  {baziResult.dayPillar.stem}
                </Text>
                <Text style={[styles.branchChar, { color: getElementColor(FIVE_ELEMENTS[baziResult.dayPillar.branch as keyof typeof FIVE_ELEMENTS]) }]}>
                  {baziResult.dayPillar.branch}
                </Text>
              </View>
            </View>

            {/* Hour Pillar */}
            <View style={styles.pillar}>
              <Text style={styles.pillarLabel}>{i18n.t('baziAnalysis.hourPillar')}</Text>
              <View style={styles.pillarChars}>
                <Text style={[styles.stemChar, { color: getElementColor(FIVE_ELEMENTS[baziResult.hourPillar.stem as keyof typeof FIVE_ELEMENTS]) }]}>
                  {baziResult.hourPillar.stem}
                </Text>
                <Text style={[styles.branchChar, { color: getElementColor(FIVE_ELEMENTS[baziResult.hourPillar.branch as keyof typeof FIVE_ELEMENTS]) }]}>
                  {baziResult.hourPillar.branch}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Five Elements */}
        <Card title={i18n.t('baziAnalysis.fiveElements')} style={styles.elementsCard}>
          <View style={styles.elementsContainer}>
            {Object.entries(baziResult.elements).map(([element, count]) => (
              <View key={element} style={styles.elementItem}>
                <View style={[styles.elementCircle, { backgroundColor: getElementColor(element) }]}>
                  <Text style={styles.elementChar}>{element}</Text>
                </View>
                <Text style={styles.elementName}>
                  {i18n.t(`baziAnalysis.${element === '木' ? 'wood' : element === '火' ? 'fire' : element === '土' ? 'earth' : element === '金' ? 'metal' : 'water'}`)}
                </Text>
                <View style={styles.elementBar}>
                  <View style={[styles.elementBarFill, { width: `${(count / 8) * 100}%`, backgroundColor: getElementColor(element) }]} />
                </View>
                <Text style={styles.elementCount}>{count}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Fortune Analysis */}
        <Card title={i18n.t('baziAnalysis.fortuneAnalysis')} style={styles.fortuneCard}>
          <View style={styles.fortuneItem}>
            <Ionicons name="briefcase-outline" size={24} color={COLORS.primary} />
            <Text style={styles.fortuneLabel}>{i18n.t('baziAnalysis.career')}</Text>
            <Text style={[styles.fortuneStars, { color: getFortuneLevel(baziResult.elements['金']).color }]}>
              {getFortuneLevel(baziResult.elements['金']).text}
            </Text>
          </View>
          <View style={styles.fortuneItem}>
            <Ionicons name="cash-outline" size={24} color={COLORS.secondary} />
            <Text style={styles.fortuneLabel}>{i18n.t('baziAnalysis.wealth')}</Text>
            <Text style={[styles.fortuneStars, { color: getFortuneLevel(baziResult.elements['水']).color }]}>
              {getFortuneLevel(baziResult.elements['水']).text}
            </Text>
          </View>
          <View style={styles.fortuneItem}>
            <Ionicons name="heart-outline" size={24} color={COLORS.error} />
            <Text style={styles.fortuneLabel}>{i18n.t('baziAnalysis.health')}</Text>
            <Text style={[styles.fortuneStars, { color: getFortuneLevel(baziResult.elements['土']).color }]}>
              {getFortuneLevel(baziResult.elements['土']).text}
            </Text>
          </View>
          <View style={styles.fortuneItem}>
            <Ionicons name="people-outline" size={24} color={COLORS.info} />
            <Text style={styles.fortuneLabel}>{i18n.t('baziAnalysis.relationship')}</Text>
            <Text style={[styles.fortuneStars, { color: getFortuneLevel(baziResult.elements['火']).color }]}>
              {getFortuneLevel(baziResult.elements['火']).text}
            </Text>
          </View>
        </Card>

        {/* Lucky Info */}
        <Card variant="gold" style={styles.luckyCard}>
          <View style={styles.luckyItem}>
            <Ionicons name="compass-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.luckyLabel}>{i18n.t('baziAnalysis.luckyDirection')}</Text>
            <Text style={styles.luckyValue}>{getDirectionName(baziResult.luckyDirection)}</Text>
          </View>
          <View style={styles.luckyItem}>
            <Ionicons name="color-palette-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.luckyLabel}>{i18n.t('baziAnalysis.luckyColor')}</Text>
            <Text style={styles.luckyValue}>{getColorName(baziResult.luckyColor)}</Text>
          </View>
          <View style={styles.luckyItem}>
            <Ionicons name="star-outline" size={24} color={COLORS.textPrimary} />
            <Text style={styles.luckyLabel}>{i18n.t('baziAnalysis.luckyNumber')}</Text>
            <Text style={styles.luckyValue}>{baziResult.luckyNumbers[0]}</Text>
          </View>
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Ad Banner */}
      {!isSubscribed && <AdBanner position="bottom" adType="baziAnalysisBanner" />}
    </SafeAreaView>
  );
};

export default BaziAnalysisScreen;
