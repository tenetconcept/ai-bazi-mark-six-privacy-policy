import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getColors, SPACING, BORDER_RADIUS, FONTS, SHADOWS, getFontSizes } from '../constants/theme';
import { LotteryBall, Card, CustomButton, AdBanner } from '../components';
import { loadHistory, clearHistory, deleteHistoryItem, HistoryRecord } from '../utils/storage';
import i18n from '../i18n';
import { useApp } from '../context/AppContext';

const HistoryScreen: React.FC = () => {
  const { language, isSubscribed, isDarkMode, fontSize } = useApp();
  const COLORS = getColors(isDarkMode);
  const FONT_SIZES = getFontSizes(fontSize);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: SPACING.xl,
      paddingHorizontal: SPACING.lg,
      borderBottomLeftRadius: BORDER_RADIUS.xxl,
      borderBottomRightRadius: BORDER_RADIUS.xxl,
    },
    headerTitle: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: 'bold',
      color: COLORS.textWhite,
      flex: 1,
      textAlign: 'center',
    },
    clearButton: {
      padding: SPACING.sm,
    },
    listContent: {
      padding: SPACING.lg,
      flexGrow: 1,
    },
    historyCard: {
      marginBottom: SPACING.md,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.borderLight,
    },
    dateTimeContainer: {},
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateText: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.primary,
      marginLeft: SPACING.xs,
    },
    timeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.xs,
    },
    timeText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textSecondary,
      marginLeft: SPACING.xs,
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    userName: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textSecondary,
      marginBottom: SPACING.xs,
    },
    deleteButton: {
      padding: SPACING.xs,
      marginTop: SPACING.xs,
    },
    numbersRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: SPACING.xs,
      marginBottom: SPACING.md,
    },
    plusSign: {
      width: 20,
      alignItems: 'center',
    },
    plusText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.textSecondary,
      fontWeight: 'bold',
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: SPACING.md,
    },
    locationInfo: {
      flex: 1,
      marginLeft: SPACING.xs,
    },
    locationText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textPrimary,
      fontWeight: '500',
    },
    locationAddress: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textSecondary,
      marginTop: SPACING.xs,
    },
    mapLink: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.xs,
    },
    mapLinkText: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.primary,
      marginLeft: SPACING.xs,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: SPACING.xxxl,
    },
    emptyText: {
      fontSize: FONT_SIZES.lg,
      color: COLORS.textSecondary,
      marginTop: SPACING.lg,
    },
  });

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistoryData();
    }, [])
  );

  const loadHistoryData = async () => {
    setIsLoading(true);
    const data = await loadHistory();
    setHistory(data);
    setIsLoading(false);
  };

  const handleClearHistory = () => {
    Alert.alert(
      i18n.t('history.clearHistory'),
      i18n.t('history.clearConfirm'),
      [
        {
          text: i18n.t('history.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('history.confirm'),
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const handleDeleteItem = (id: string, userName: string) => {
    Alert.alert(
      i18n.t('history.deleteItem'),
      `${i18n.t('history.deleteConfirm')} (${userName})`,
      [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.ok'),
          style: 'destructive',
          onPress: async () => {
            await deleteHistoryItem(id);
            await loadHistoryData();
          },
        },
      ]
    );
  };

  const renderHistoryItem = ({ item }: { item: HistoryRecord }) => (
    <Card style={styles.historyCard}>
      <View style={styles.historyHeader}>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.userName}>{item.userName}</Text>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteItem(item.id, item.userName)}
          >
            <Ionicons name="trash-outline" size={18} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.numbersRow}>
        {item.numbers.map((num, index) => (
          <LotteryBall key={index} number={num} size="small" />
        ))}
        <View style={styles.plusSign}>
          <Text style={styles.plusText}>+</Text>
        </View>
        <LotteryBall number={item.specialNumber} isSpecial size="small" />
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
        <View style={styles.locationInfo}>
          <Text style={styles.locationText}>{item.location}</Text>
          {item.locationAddress && (
            <Text style={styles.locationAddress}>{item.locationAddress}</Text>
          )}
          {item.locationLat && item.locationLng && (
            <TouchableOpacity
              style={styles.mapLink}
              onPress={() => {
                const url = `https://www.google.com/maps/search/?api=1&query=${item.locationLat},${item.locationLng}`;
                Alert.alert(
                  i18n.t('luckyNumbers.openMap'),
                  item.locationAddress || item.location,
                  [
                    { text: i18n.t('common.cancel'), style: 'cancel' },
                    {
                      text: i18n.t('common.ok'),
                      onPress: () => {
                        const mapUrl = Platform.OS === 'ios'
                          ? `maps:0,0?q=${item.locationLat},${item.locationLng}`
                          : `geo:0,0?q=${item.locationLat},${item.locationLng}`;
                        require('react-native').Linking.openURL(mapUrl).catch(() => {
                          require('react-native').Linking.openURL(url);
                        });
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="navigate" size={14} color={COLORS.primary} />
              <Text style={styles.mapLinkText}>{i18n.t('luckyNumbers.openMap')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={60} color={COLORS.textLight} />
      <Text style={styles.emptyText}>{i18n.t('history.noRecords')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>{i18n.t('history.title')}</Text>
        {history.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
            <Ionicons name="trash-outline" size={20} color={COLORS.textWhite} />
          </TouchableOpacity>
        )}
      </LinearGradient>

      <FlatList
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />

      {/* Ad Banner */}
      {!isSubscribed && <AdBanner position="bottom" adType="historyBanner" />}
    </SafeAreaView>
  );
};

export default HistoryScreen;
