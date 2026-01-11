import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedBanner from '../components/AnimatedBanner';
import { Ionicons } from '@expo/vector-icons';

import { getColors, SPACING, BORDER_RADIUS, FONTS, SHADOWS, getFontSizes } from '../constants/theme';
import { Card, CustomButton, AdBanner, CustomAlert } from '../components';
import { APP_VERSION, SUBSCRIPTION_PRODUCTS } from '../constants/config';
import { clearUserData, saveSubscriptionStatus } from '../utils/storage';
import i18n, { LANGUAGES, setLanguage } from '../i18n';
import { useApp } from '../context/AppContext';
import { FontSize } from '../context/AppContext';
import { useCustomAlert } from '../utils/useCustomAlert';

const SettingsScreen: React.FC = () => {
  const { language, changeLanguage, isSubscribed, subscriptionPlan, updateSubscription, triggerUserDataReload, isDarkMode, toggleTheme, fontSize, changeFontSize } = useApp();
  const COLORS = getColors(isDarkMode);
  const FONT_SIZES = getFontSizes(fontSize);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState<string | null>(null);
  const { alertState, showAlert, hideAlert } = useCustomAlert();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      paddingTop: 30,
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
      fontSize: FONT_SIZES.xxl,
      fontWeight: 'bold',
      color: '#FFD700', // Shiny Gold
      textAlign: 'center',
      textShadowColor: '#B8860B',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: SPACING.lg,
    },
    subscriptionCard: {
      marginBottom: SPACING.lg,
      backgroundColor: COLORS.cardInnerBackground,
      borderWidth: 1,
      borderColor: '#FFD700',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: 'bold',
      color: COLORS.textBrand,
      marginBottom: SPACING.md,
    },
    currentPlanContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 215, 0, 0.3)',
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
      backgroundColor: COLORS.cardInnerBackground,
      borderWidth: 1,
      borderColor: '#FFD700',
      borderRadius: BORDER_RADIUS.lg,
      overflow: 'hidden',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 215, 0, 0.3)',
    },
    settingIcon: {
      width: 32,
      height: 32,
      borderRadius: BORDER_RADIUS.sm,
      backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.15)' : 'rgba(212, 175, 55, 0.15)',
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
      color: COLORS.textBrand,
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
      backgroundColor: COLORS.cardInnerBackground,
      borderRadius: BORDER_RADIUS.xl,
      borderWidth: 1,
      borderColor: '#FFD700',
      padding: SPACING.lg,
    },
    infoModalContent: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: COLORS.cardInnerBackground,
      borderRadius: BORDER_RADIUS.xl,
      borderWidth: 1,
      borderColor: '#FFD700',
      padding: SPACING.lg,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.lg,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 215, 0, 0.3)',
    },
    modalTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: 'bold',
      color: COLORS.textBrand,
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
      backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(212, 175, 55, 0.2)',
    },
    languageText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.textBrand,
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
      color: COLORS.textBrand,
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
    showAlert({
      title: i18n.t('settings.subscribe'),
      message: `${plan === 'monthly' ? i18n.t('settings.monthlyPlan') : i18n.t('settings.yearlyPlan')}`,
      buttons: [
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
            showAlert({
              message: i18n.t('settings.purchaseStatus') + ': ' + (plan === 'monthly' ? i18n.t('settings.monthlyPlan') : i18n.t('settings.yearlyPlan')),
            });
          },
        },
      ],
    });
  };

  const handleRestorePurchase = async () => {
    // In production, implement actual restore purchase
    showAlert({
      title: i18n.t('settings.restorePurchase'),
      message: 'Checking for previous purchases...',
    });
  };

  const handleThemeToggleDelayed = () => {
    // Small delay to allow the switch animation to complete smoothly before the theme swap
    requestAnimationFrame(() => {
      setTimeout(() => {
        toggleTheme();
      }, 50); // 50ms is enough to let the native switch start moving
    });
  };

  const handleLanguageChange = async (code: string) => {
    await changeLanguage(code);
    setShowLanguageModal(false);
  };

  const handleResetData = () => {
    showAlert({
      title: i18n.t('settings.resetAllData'),
      message: i18n.t('settings.resetAllDataConfirm'),
      buttons: [
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
              
              // Delay showing success message to avoid flickering
              setTimeout(() => {
                showAlert({
                  title: i18n.t('common.success'),
                  message: i18n.t('settings.resetComplete'),
                });
              }, 400); // Wait for previous alert to fully dismiss
            } catch (error) {
              console.error('Reset error:', error);
              setTimeout(() => {
                showAlert({
                  title: i18n.t('common.error'),
                  message: i18n.t('settings.resetError'),
                });
              }, 400);
            }
          },
        },
      ],
    });
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
      <AnimatedBanner
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{i18n.t('settings.title')}</Text>
      </AnimatedBanner>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Subscription Section */}
        <View style={styles.subscriptionCard}>
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

          {!isSubscribed && (
            <TouchableOpacity style={styles.restoreButton} onPress={handleRestorePurchase}>
              <Text style={styles.restoreText}>{i18n.t('settings.restorePurchase')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings List */}
        <View style={styles.settingsCard}>
          <SettingItem
            icon="moon-outline"
            title={i18n.t('settings.darkMode')}
            onPress={() => {}}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggleDelayed}
                trackColor={{ false: '#767577', true: '#C41E3A' }}
                thumbColor={Platform.OS === 'ios' ? undefined : '#FFFFFF'}
                ios_backgroundColor="#767577"
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
        </View>

        <View style={styles.settingsCard}>
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
        </View>

        <View style={styles.settingsCard}>
          <SettingItem
            icon="information-circle-outline"
            title={i18n.t('settings.appVersion')}
            subtitle={APP_VERSION}
            onPress={() => {}}
            showArrow={false}
          />
        </View>

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
      
      {/* Custom Alert */}
      <CustomAlert
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        buttons={alertState.buttons}
        onDismiss={hideAlert}
        isDarkMode={isDarkMode}
        fontSize={fontSize}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
