import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { getColors, SPACING, BORDER_RADIUS, FONTS, SHADOWS, getFontSizes } from '../constants/theme';
import { Card, CustomButton, AdBanner } from '../components';
import { APP_VERSION, SUBSCRIPTION_PRODUCTS } from '../constants/config';
import { clearUserData, saveSubscriptionStatus } from '../utils/storage';
import i18n, { LANGUAGES, setLanguage } from '../i18n';
import { useApp } from '../context/AppContext';
import { FontSize } from '../context/AppContext';

const SettingsScreen: React.FC = () => {
  const { language, changeLanguage, isSubscribed, subscriptionPlan, updateSubscription, triggerUserDataReload, isDarkMode, toggleTheme, fontSize, changeFontSize } = useApp();
  const COLORS = getColors(isDarkMode);
  const FONT_SIZES = getFontSizes(fontSize);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      paddingTop: 60,
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: SPACING.lg,
    },
    subscriptionCard: {
      marginBottom: SPACING.lg,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      marginBottom: SPACING.md,
    },
    currentPlanContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.borderLight,
      marginBottom: SPACING.md,
    },
    currentPlanLabel: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textSecondary,
    },
    currentPlanValue: {
      fontSize: FONT_SIZES.md,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    planOption: {
      marginBottom: SPACING.md,
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
    },
    planGradient: {
      padding: SPACING.lg,
    },
    planContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    planTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.textWhite,
    },
    planPrice: {
      fontSize: FONT_SIZES.lg,
      fontWeight: 'bold',
      color: COLORS.textWhite,
    },
    planSaveText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textWhite,
      opacity: 0.9,
      marginTop: SPACING.xs,
    },
    planDescription: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textWhite,
      opacity: 0.9,
      marginTop: SPACING.xs,
    },
    bottomSpacer: {
      height: SPACING.lg,
    },
    restoreButton: {
      marginTop: SPACING.md,
      alignItems: 'center',
      padding: SPACING.md,
    },
    restoreText: {
      fontSize: FONT_SIZES.md,
      color: COLORS.primary,
    },
    settingsCard: {
      marginBottom: SPACING.lg,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.borderLight,
    },
    settingIcon: {
      width: 32,
      height: 32,
      borderRadius: BORDER_RADIUS.sm,
      backgroundColor: COLORS.backgroundDark,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.md,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.textPrimary,
    },
    settingSubtitle: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      marginTop: SPACING.xs,
    },
    appVersionText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
      textAlign: 'center',
      marginTop: SPACING.xl,
      marginBottom: SPACING.lg,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      maxHeight: '70%',
      backgroundColor: COLORS.backgroundCard,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
    },
    infoModalContent: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: COLORS.backgroundCard,
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.lg,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.borderLight,
    },
    modalTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
    },
    languageOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.sm,
    },
    languageOptionActive: {
      backgroundColor: COLORS.backgroundDark,
    },
    languageText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.textPrimary,
    },
    languageTextActive: {
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    infoScrollView: {
      maxHeight: 400,
    },
    infoText: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textPrimary,
      lineHeight: 24,
    },
  });

  const SettingItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    rightComponent?: React.ReactNode;
  }> = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon as any} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightComponent}
      {showArrow && !rightComponent && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
      )}
    </TouchableOpacity>
  );

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    // In production, implement actual in-app purchase
    Alert.alert(
      i18n.t('settings.subscribe'),
      `${plan === 'monthly' ? i18n.t('settings.monthlyPlan') : i18n.t('settings.yearlyPlan')}`,
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('settings.subscribe'),
          onPress: async () => {
            // Simulate subscription success
            await saveSubscriptionStatus({
              isSubscribed: true,
              plan,
              expiryDate: new Date(Date.now() + (plan === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString(),
            });
            updateSubscription({ isSubscribed: true, plan });
            Alert.alert('', i18n.t('settings.purchaseStatus') + ': ' + (plan === 'monthly' ? i18n.t('settings.monthlyPlan') : i18n.t('settings.yearlyPlan')));
          },
        },
      ]
    );
  };

  const handleRestorePurchase = async () => {
    // In production, implement actual restore purchase
    Alert.alert(
      i18n.t('settings.restorePurchase'),
      'Checking for previous purchases...',
      [{ text: i18n.t('common.ok') }]
    );
  };

  const handleLanguageChange = async (code: string) => {
    await changeLanguage(code);
    setShowLanguageModal(false);
  };

  const handleResetData = () => {
    Alert.alert(
      i18n.t('settings.resetAllData'),
      i18n.t('settings.resetAllDataConfirm'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('common.confirm'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all user data from AsyncStorage
              const AsyncStorage = require('@react-native-async-storage/async-storage').default;
              await AsyncStorage.clear();
              
              // Trigger data reload first
              triggerUserDataReload();
              
              // Show success message
              Alert.alert(
                i18n.t('common.success'),
                i18n.t('settings.resetComplete')
              );
            } catch (error) {
              console.error('Reset error:', error);
              Alert.alert(i18n.t('common.error'), i18n.t('settings.resetError'));
            }
          },
        },
      ]
    );
  };

  const getCurrentLanguageName = (): string => {
    const lang = LANGUAGES.find((l) => l.code === language);
    return lang ? lang.nativeName : 'English';
  };

  const getInfoContent = (type: string): { title: string; content: string } => {
    switch (type) {
      case 'disclaimer':
        return { title: i18n.t('disclaimer.title'), content: i18n.t('disclaimer.content') };
      case 'privacy':
        return { title: i18n.t('privacy.title'), content: i18n.t('privacy.content') };
      case 'terms':
        return { title: i18n.t('terms.title'), content: i18n.t('terms.content') };
      case 'howToPlay':
        return { title: i18n.t('howToPlay.title'), content: i18n.t('howToPlay.content') };
      default:
        return { title: '', content: '' };
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{i18n.t('settings.title')}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Section */}
        <Card style={styles.subscriptionCard}>
          <Text style={styles.sectionTitle}>{i18n.t('settings.subscription')}</Text>
          
          <View style={styles.currentPlanContainer}>
            <Text style={styles.currentPlanLabel}>{i18n.t('settings.currentPlan')}:</Text>
            <Text style={styles.currentPlanValue}>
              {isSubscribed
                ? subscriptionPlan === 'monthly'
                  ? i18n.t('settings.monthlyPlan')
                  : i18n.t('settings.yearlyPlan')
                : i18n.t('settings.freePlan')}
            </Text>
          </View>

          {!isSubscribed && (
            <>
              <TouchableOpacity
                style={styles.planOption}
                onPress={() => handleSubscribe('monthly')}
              >
                <LinearGradient
                  colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                  style={styles.planGradient}
                >
                  <View style={styles.planContent}>
                    <Text style={styles.planTitle}>{i18n.t('settings.monthlyPlan')}</Text>
                    <Text style={styles.planPrice}>HK$8</Text>
                  </View>
                  <Text style={styles.planDescription}>{i18n.t('ads.removeAds')}</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.planOption}
                onPress={() => handleSubscribe('yearly')}
              >
                <LinearGradient
                  colors={[COLORS.goldGradientStart, COLORS.goldGradientEnd]}
                  style={styles.planGradient}
                >
                  <View style={styles.planContent}>
                    <Text style={[styles.planTitle, { color: COLORS.textPrimary }]}>
                      {i18n.t('settings.yearlyPlan')}
                    </Text>
                    <Text style={[styles.planPrice, { color: COLORS.textPrimary }]}>HK$80</Text>
                  </View>
                  <Text style={[styles.planDescription, { color: COLORS.textPrimary }]}>
                    {i18n.t('ads.removeAds')} (Save 17%)
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchase}>
            <Text style={styles.restoreText}>{i18n.t('settings.restorePurchase')}</Text>
          </TouchableOpacity>
        </Card>

        {/* Settings List */}
        <Card style={styles.settingsCard}>
          <SettingItem
            icon="moon-outline"
            title={i18n.t('settings.darkMode')}
            onPress={toggleTheme}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: COLORS.textLight, true: COLORS.primary }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                ios_backgroundColor={COLORS.textLight}
              />
            }
          />
          <SettingItem
            icon="language-outline"
            title={i18n.t('settings.language')}
            subtitle={getCurrentLanguageName()}
            onPress={() => setShowLanguageModal(true)}
          />
          <SettingItem
            icon="text-outline"
            title={i18n.t('settings.fontSize')}
            subtitle={i18n.t(`settings.fontSize${fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}`)}
            onPress={() => setShowFontSizeModal(true)}
          />
          <SettingItem
            icon="refresh-outline"
            title={i18n.t('settings.resetAllData')}
            onPress={handleResetData}
          />
        </Card>

        <Card style={styles.settingsCard}>
          <SettingItem
            icon="warning-outline"
            title={i18n.t('settings.disclaimer')}
            onPress={() => setShowInfoModal('disclaimer')}
          />
          <SettingItem
            icon="document-text-outline"
            title={i18n.t('settings.termsOfUse')}
            onPress={() => setShowInfoModal('terms')}
          />
          <SettingItem
            icon="shield-outline"
            title={i18n.t('settings.privacyPolicy')}
            onPress={() => setShowInfoModal('privacy')}
          />
          <SettingItem
            icon="help-circle-outline"
            title={i18n.t('settings.howToPlay')}
            onPress={() => setShowInfoModal('howToPlay')}
          />
        </Card>

        <Card style={styles.settingsCard}>
          <SettingItem
            icon="information-circle-outline"
            title={i18n.t('settings.appVersion')}
            subtitle={APP_VERSION}
            onPress={() => {}}
            showArrow={false}
          />
        </Card>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{i18n.t('settings.language')}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.languageOptionActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text
                  style={[
                    styles.languageText,
                    language === lang.code && styles.languageTextActive,
                  ]}
                >
                  {lang.nativeName}
                </Text>
                {language === lang.code && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Font Size Modal */}
      <Modal
        visible={showFontSizeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFontSizeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{i18n.t('settings.fontSize')}</Text>
              <TouchableOpacity onPress={() => setShowFontSizeModal(false)}>
                <Ionicons name="close" size={28} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            {(['large', 'medium', 'small'] as FontSize[]).map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.languageOption,
                  fontSize === size && styles.languageOptionActive,
                ]}
                onPress={async () => {
                  await changeFontSize(size);
                  setShowFontSizeModal(false);
                }}
              >
                <Text
                  style={[
                    styles.languageText,
                    fontSize === size && styles.languageTextActive,
                  ]}
                >
                  {i18n.t(`settings.fontSize${size.charAt(0).toUpperCase() + size.slice(1)}`)}
                </Text>
                {fontSize === size && (
                  <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowInfoModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {showInfoModal ? getInfoContent(showInfoModal).title : ''}
              </Text>
              <TouchableOpacity onPress={() => setShowInfoModal(null)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.infoScrollView}>
              <Text style={styles.infoText}>
                {showInfoModal ? getInfoContent(showInfoModal).content : ''}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Ad Banner */}
      {!isSubscribed && <AdBanner position="bottom" adType="historyBanner" />}
    </SafeAreaView>
  );
};

export default SettingsScreen;
