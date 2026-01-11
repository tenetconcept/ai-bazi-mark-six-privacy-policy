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
import AnimatedBanner from '../components/AnimatedBanner';
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
      paddingTop: 30,
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.sm,
      borderBottomLeftRadius: BORDER_RADIUS.xxl,
      borderBottomRightRadius: BORDER_RADIUS.xxl,
      borderBottomWidth: 3,
      borderBottomColor: 'rgba(255, 215, 0, 0.3)',
      shadowColor: '#FFD700',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    headerTitle: {
      fontSize: FONT_SIZES.xxxl,
      color: '#FFD700', // Shiny Gold
      textAlign: 'center',
      fontFamily: 'MaShanZheng_400Regular',
      textShadowColor: '#B8860B',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
      letterSpacing: 1,
    },
    headerSubtitle: {
      fontSize: FONT_SIZES.lg,
      color: '#FFED4E', // Light shiny gold
      opacity: 0.95,
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
      backgroundColor: COLORS.primary, // Festive Red (or Dark Red)
      borderWidth: 1,
      borderColor: '#FFD700', // Gold Border
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md, // Reduced padding to let inner cream box fit well
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    baziCardContent: {
      backgroundColor: COLORS.cardInnerBackground, // Cream or Dark Grey
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
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
      color: COLORS.textBrand, // Dark Red or Gold
      marginBottom: SPACING.sm,
      fontWeight: 'bold',
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
      backgroundColor: COLORS.primary,
      borderWidth: 1,
      borderColor: '#FFD700', // Gold Border
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    elementsCardContent: {
      backgroundColor: COLORS.cardInnerBackground,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
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
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    elementChar: {
       fontSize: FONT_SIZES.md,
       fontWeight: 'bold',
       color: COLORS.textWhite,
    },
    elementName: {
      width: 40,
      fontSize: FONT_SIZES.sm,
      color: COLORS.textBrand,
      marginLeft: SPACING.sm,
      fontWeight: 'bold',
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
      color: COLORS.textBrand,
      textAlign: 'right',
    },
    fortuneCard: {
      marginBottom: SPACING.lg,
      backgroundColor: COLORS.primary,
      borderWidth: 1,
      borderColor: '#FFD700', // Gold Border
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    fortuneCardContent: {
      backgroundColor: COLORS.cardInnerBackground,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
    },
    fortuneItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.s,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(218, 165, 32, 0.3)', // GoldenRod
    },
    fortuneLabel: {
      flex: 1,
      fontSize: FONT_SIZES.md,
      color: COLORS.textBrand,
      marginLeft: SPACING.md,
      fontWeight: 'bold',
    },
    fortuneStars: {
      fontSize: FONT_SIZES.md,
    },
    luckyCard: {
      marginBottom: SPACING.lg,
      backgroundColor: COLORS.primary,
      borderWidth: 1,
      borderColor: '#FFD700', // Gold Border
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    luckyCardContent: {
      backgroundColor: COLORS.cardInnerBackground,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
    },
    luckyItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.sm,
    },
    luckyLabel: {
      flex: 1,
      fontSize: FONT_SIZES.md,
      color: COLORS.textBrand,
      marginLeft: SPACING.md,
      fontWeight: '600',
    },
    luckyValue: {
      fontSize: FONT_SIZES.lg,
      fontWeight: 'bold',
      color: COLORS.primary, // Or textBrand
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
      th: {
        green: 'เขียว', blue: 'น้ำเงิน', red: 'แดง', orange: 'ส้ม',
        purple: 'ม่วง', yellow: 'เหลือง', brown: 'น้ำตาล', beige: 'เบจ',
        white: 'ขาว', gold: 'ทอง', silver: 'เงิน', black: 'ดำ', grey: 'เทา',
      },
      fil: {
        green: 'Berde', blue: 'Asul', red: 'Pula', orange: 'Kahel',
        purple: 'Lila', yellow: 'Dilaw', brown: 'Kayumanggi', beige: 'Beige',
        white: 'Puti', gold: 'Ginto', silver: 'Pilak', black: 'Itim', grey: 'Abo',
      },
      id: {
        green: 'Hijau', blue: 'Biru', red: 'Merah', orange: 'Oranye',
        purple: 'Ungu', yellow: 'Kuning', brown: 'Cokelat', beige: 'Krem',
        white: 'Putih', gold: 'Emas', silver: 'Perak', black: 'Hitam', grey: 'Abu-abu',
      },
      hi: {
        green: 'हरा', blue: 'नीला', red: 'लाल', orange: 'नारंगी',
        purple: 'बैंगनी', yellow: 'पीला', brown: 'भूरा', beige: 'बेज',
        white: 'सफेद', gold: 'सुनहरा', silver: 'चांदी', black: 'काला', grey: 'धूसर',
      },
    };

    // Use specific language or fallback to English, but handle Chinese variants correctly
    const locale = (language in colorMap) ? language : (language.startsWith('zh') ? (language === 'zh-CN' ? 'zh-CN' : 'zh-TW') : 'en');
    return colorMap[locale]?.[color] || colorMap['en'][color] || color;
  };

  const getBirthPlaceName = (code: string): string => {
    return i18n.t(`birthPlaces.${code}`);
  };

  const getLuckyTextColor = (color: string): string => {
    const colorMap: Record<string, string> = {
      green: '#00AA00',   // Vivid Green
      blue: '#0066FF',    // Bright Blue
      red: '#FF0000',     // Bright Red
      orange: '#FF5500',  // Bright Orange
      purple: '#9932CC',  // Dark Orchid (Vibrant)
      yellow: '#D4AF37',  // Metallic Gold (Readable)
      brown: '#8B4513',   // Saddle Brown
      beige: '#B8860B',   // Dark Goldenrod (Readable version of beige)
      white: '#708090',   // Slate Gray (Readable version of white)
      gold: '#DAA520',    // Goldenrod
      silver: '#778899',  // Light Slate Gray
      black: '#000000',
      grey: '#696969',
    };
    return colorMap[color] || '#C41E3A';
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
      <AnimatedBanner
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{i18n.t('baziAnalysis.title')}</Text>
        <Text style={styles.headerSubtitle}>{i18n.t('baziAnalysis.subtitle')}</Text>
      </AnimatedBanner>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Bazi Pillars */}
        <View style={styles.baziCard}>
           <View style={{ marginBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#FFD700', paddingBottom: SPACING.xs }}>
              <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: '#FFD700' }}>
                {i18n.t('baziAnalysis.yourBazi')}
              </Text>
           </View>
          <View style={styles.baziCardContent}>
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
          </View>
        </View>

        {/* Five Elements */}
        <View style={styles.elementsCard}>
          <View style={{ marginBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#FFD700', paddingBottom: SPACING.xs }}>
             <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: '#FFD700' }}>
                {i18n.t('baziAnalysis.fiveElements')}
             </Text>
          </View>
          <View style={styles.elementsCardContent}>
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
          </View>
        </View>

        {/* Fortune Analysis */}
        <View style={styles.fortuneCard}>
          <View style={{ marginBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#FFD700', paddingBottom: SPACING.xs }}>
             <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: '#FFD700' }}>
                {i18n.t('baziAnalysis.fortuneAnalysis')}
             </Text>
          </View>
          <View style={styles.fortuneCardContent}>
            <View style={styles.fortuneItem}>
              <Ionicons name="briefcase-outline" size={24} color={'#4169E1'} />
              <Text style={styles.fortuneLabel}>{i18n.t('baziAnalysis.career')}</Text>
              <Text style={[styles.fortuneStars, { color: '#B8860B' }]}>
                {getFortuneLevel(baziResult.elements['金']).text}
              </Text>
            </View>
            <View style={styles.fortuneItem}>
              <Ionicons name="cash-outline" size={24} color={'#DAA520'} />
              <Text style={styles.fortuneLabel}>{i18n.t('baziAnalysis.wealth')}</Text>
              <Text style={[styles.fortuneStars, { color: '#B8860B' }]}>
                {getFortuneLevel(baziResult.elements['水']).text}
              </Text>
            </View>
            <View style={styles.fortuneItem}>
              <Ionicons name="heart-outline" size={24} color={'#2E8B57'} />
              <Text style={styles.fortuneLabel}>{i18n.t('baziAnalysis.health')}</Text>
              <Text style={[styles.fortuneStars, { color: '#B8860B' }]}>
                {getFortuneLevel(baziResult.elements['土']).text}
              </Text>
            </View>
            <View style={styles.fortuneItem}>
              <Ionicons name="people-outline" size={24} color={'#FF69B4'} />
              <Text style={styles.fortuneLabel}>{i18n.t('baziAnalysis.relationship')}</Text>
              <Text style={[styles.fortuneStars, { color: '#B8860B' }]}>
                {getFortuneLevel(baziResult.elements['火']).text}
              </Text>
            </View>
          </View>
        </View>

        {/* Lucky Direction */}
        <View style={styles.luckyCard}>
           <View style={{ marginBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#FFD700', paddingBottom: SPACING.xs }}>
             <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: '#FFD700' }}>
                {i18n.t('baziAnalysis.luckyDirection')} 
             </Text>
           </View>
           <View style={styles.luckyCardContent}>
              <View style={styles.luckyItem}>
                <Ionicons name="compass-outline" size={24} color={'#DAA520'} />
                <Text style={styles.luckyLabel}>{i18n.t('baziAnalysis.luckyDirection')}</Text>
                <Text style={[styles.luckyValue, { color: '#C41E3A' }]}>{getDirectionName(baziResult.luckyDirection)}</Text>
              </View>
           </View>
        </View>

        {/* Lucky Colors */}
        <View style={styles.luckyCard}>
           <View style={{ marginBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#FFD700', paddingBottom: SPACING.xs }}>
             <Text style={{ fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: '#FFD700' }}>
                {i18n.t('baziAnalysis.luckyColors')}
             </Text>
           </View>
           <View style={styles.luckyCardContent}>
              <View style={styles.luckyItem}>
                <Ionicons name="color-palette-outline" size={24} color={'#FF4500'} />
                <Text style={styles.luckyLabel}>{i18n.t('baziAnalysis.luckyColors')}</Text>
                <View style={{ gap: 4 }}>
                  {(baziResult.luckyColors || []).map((color: string, index: number) => (
                    <Text key={index} style={[styles.luckyValue, { color: getLuckyTextColor(color) }]}>
                      {getColorName(color)}
                    </Text>
                  ))}
                </View>
              </View>
           </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Ad Banner */}
      {!isSubscribed && <AdBanner position="bottom" adType="baziAnalysisBanner" />}
    </SafeAreaView>
  );
};

export default BaziAnalysisScreen;
