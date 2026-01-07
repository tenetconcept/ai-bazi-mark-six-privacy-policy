import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, ActivityIndicator, Modal, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppProvider, useApp } from './src/context/AppContext';
import { TabNavigator } from './src/navigation';
import { COLORS, SPACING, FONTS, BORDER_RADIUS } from './src/constants/theme';
import i18n from './src/i18n';
import { loadUserData } from './src/utils/storage';

const DISCLAIMER_KEY = '@disclaimer_accepted';

const LoadingScreen: React.FC = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);

const AppContent: React.FC = () => {
  const [isCheckingDisclaimer, setIsCheckingDisclaimer] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [shouldShowUserModal, setShouldShowUserModal] = useState(false);

  useEffect(() => {
    checkDisclaimer();
  }, []);

  const checkDisclaimer = async () => {
    try {
      const accepted = await AsyncStorage.getItem(DISCLAIMER_KEY);
      if (!accepted) {
        setShowDisclaimer(true);
      }
    } catch (error) {
      console.error('Error checking disclaimer:', error);
    } finally {
      setIsCheckingDisclaimer(false);
    }
  };

  const handleAcceptDisclaimer = async () => {
    if (!disclaimerChecked) {
      Alert.alert(
        i18n.t('disclaimer.firstLaunchTitle'),
        i18n.t('disclaimer.mustAgree')
      );
      return;
    }
    try {
      await AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
      setShowDisclaimer(false);
      
      // Check if user data exists, if not, flag to show user modal
      const userData = await loadUserData();
      if (!userData) {
        setShouldShowUserModal(true);
      }
    } catch (error) {
      console.error('Error saving disclaimer:', error);
    }
  };

  if (isCheckingDisclaimer) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      {showDisclaimer ? (
        <Modal
          visible={true}
          animationType="fade"
          transparent={true}
          statusBarTranslucent={false}
          onRequestClose={() => {}}
        >
          <View style={styles.disclaimerOverlay}>
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerTitle}>
                {i18n.t('disclaimer.firstLaunchTitle')}
              </Text>
              
              <ScrollView style={styles.disclaimerScroll} showsVerticalScrollIndicator={true}>
                <Text style={styles.disclaimerContent}>
                  {i18n.t('disclaimer.firstLaunchContent')}
                </Text>
              </ScrollView>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setDisclaimerChecked(!disclaimerChecked)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, disclaimerChecked && styles.checkboxChecked]}>
                  {disclaimerChecked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  {i18n.t('disclaimer.agree')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.acceptButton, !disclaimerChecked && styles.acceptButtonDisabled]}
                onPress={handleAcceptDisclaimer}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptButtonText}>
                  {i18n.t('common.confirm')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        <NavigationContainer>
          <TabNavigator shouldShowUserModal={shouldShowUserModal} />
        </NavigationContainer>
      )}
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  disclaimerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  disclaimerContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xxl,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disclaimerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C41E3A',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontFamily: FONTS.bold,
  },
  disclaimerScroll: {
    maxHeight: 400,
    marginBottom: SPACING.lg,
  },
  disclaimerContent: {
    fontSize: 15,
    lineHeight: 24,
    color: '#1A1A1A',
    fontFamily: FONTS.regular,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#C41E3A',
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#C41E3A',
    borderColor: '#C41E3A',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontFamily: FONTS.medium,
  },
  acceptButton: {
    backgroundColor: '#C41E3A',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
});
