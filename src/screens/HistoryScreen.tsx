import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Modal, // Added Modal for iOS picker
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import AnimatedBanner from '../components/AnimatedBanner';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { getColors, SPACING, BORDER_RADIUS, FONTS, SHADOWS, getFontSizes } from '../constants/theme';
import { LotteryBall, Card, CustomButton, AdBanner, CustomAlert } from '../components';
import { loadHistory, clearHistory, deleteHistoryItem, formatDate, HistoryRecord } from '../utils/storage';
import i18n from '../i18n';
import { useApp } from '../context/AppContext';
import { useCustomAlert } from '../utils/useCustomAlert';

const HistoryScreen: React.FC = () => {
  const { language, isSubscribed, isDarkMode, fontSize } = useApp();
  const COLORS = getColors(isDarkMode);
  const FONT_SIZES = getFontSizes(fontSize);
  const { alertState, showAlert, hideAlert } = useCustomAlert();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    header: {
      paddingTop: 30,
      paddingBottom: SPACING.sm,
      paddingHorizontal: SPACING.lg,
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
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    headerTitle: {
      fontSize: FONT_SIZES.xxl,
      color: '#FFD700', // Shiny Gold
      textAlign: 'center',
      fontWeight: 'bold',
      textShadowColor: '#B8860B',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 4,
      letterSpacing: 1,
    },
    headerButtons: {
      position: 'absolute',
      right: 0,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      padding: SPACING.sm,
      marginLeft: SPACING.xs,
      alignItems: 'center',
    },
    filterBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.cardInnerBackground,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 215, 0, 0.3)',
    },
    filterText: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textBrand,
      fontWeight: '600',
    },
    clearFilterText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.primary,
      fontWeight: '600',
    },
    pickerModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.lg,
    },
    pickerModalContent: {
      backgroundColor: COLORS.background,
      borderRadius: BORDER_RADIUS.xxl,
      padding: SPACING.lg,
      width: '90%',
      maxWidth: 400,
      alignItems: 'center',
    },
    pickerModalHeader: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    pickerModalTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: 'bold',
      color: COLORS.textBrand,
    },
    controlBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLORS.cardInnerBackground,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.sm,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 215, 0, 0.3)',
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.background,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 1,
      borderColor: '#FFD700',
    },
    controlButtonText: {
      marginLeft: SPACING.xs,
      color: COLORS.textBrand,
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
    },
    confirmButton: {
      marginTop: SPACING.md,
      width: '100%',
    },
    listContent: {
      padding: SPACING.lg,
      flexGrow: 1,
    },
    historyCard: {
      marginBottom: SPACING.md,
      backgroundColor: COLORS.cardInnerBackground,
      borderWidth: 1,
      borderColor: '#FFD700',
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.md,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
      paddingBottom: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: '#FFD700', // Gold
    },
    dateTimeContainer: {},
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateText: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.textBrand,
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
    },
    locationInfo: {
      flex: 1,
      marginLeft: SPACING.xs,
    },
    locationText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textBrand,
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
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#FFD700',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: SPACING.sm,
    },
    checkboxChecked: {
      backgroundColor: '#FFD700',
    },
  });

  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempFilterDate, setTempFilterDate] = useState(new Date());
  const [datePickerKey, setDatePickerKey] = useState(0);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      loadHistoryData();
    }, [])
  );

  useEffect(() => {
    if (filterDate) {
      // Format the filter date using the same format as stored records
      const filterDateStr = formatDate(filterDate, language);
      const filtered = history.filter(item => {
        try {
          // Compare the formatted date strings directly
          return item.date === filterDateStr;
        } catch (e) {
          return false;
        }
      });
      setFilteredHistory(filtered);
    } else {
      setFilteredHistory(history);
    }
    // Reset selection mode when filter changes
    setIsSelectionMode(false);
    setSelectedRecords(new Set());
  }, [history, filterDate, language]);

  const loadHistoryData = async () => {
    setIsLoading(true);
    const data = await loadHistory();
    setHistory(data);
    setFilteredHistory(data);
    setIsLoading(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        setFilterDate(selectedDate);
      }
    } else {
      // iOS
      if (selectedDate) {
        setTempFilterDate(selectedDate);
      }
    }
  };

  const confirmDateSelection = () => {
    setFilterDate(tempFilterDate);
    setShowDatePicker(false);
  };

  const clearFilter = () => {
    setFilterDate(null);
  };

  const handleClearHistory = () => {
    if (!isSelectionMode) {
      // Enter selection mode
      setIsSelectionMode(true);
      return;
    }

    if (selectedRecords.size > 0) {
      // Delete selected records
      showAlert({
        title: language.startsWith('zh') ? '刪除選中記錄' : 'Delete Selected Records',
        message: language.startsWith('zh') 
          ? `確定要刪除 ${selectedRecords.size} 條記錄嗎？`
          : `Are you sure you want to delete ${selectedRecords.size} record(s)?`,
        buttons: [
          {
            text: i18n.t('history.cancel'),
            style: 'cancel',
          },
          {
            text: i18n.t('history.confirm'),
            style: 'destructive',
            onPress: async () => {
              // Delete each selected record
              for (const id of selectedRecords) {
                await deleteHistoryItem(id);
              }
              // Update state
              const newHistory = history.filter(item => !selectedRecords.has(item.id));
              setHistory(newHistory);
              setSelectedRecords(new Set());
              setIsSelectionMode(false);
            },
          },
        ],
      });
    } else {
      // Clear all records in current view
      const recordsToDelete = filterDate ? filteredHistory : history;
      const confirmMessage = filterDate
        ? (language.startsWith('zh') 
            ? `確定要清除 ${formatDate(filterDate, language)} 的全部記錄嗎？`
            : `Are you sure you want to clear all records for ${formatDate(filterDate, language)}?`)
        : i18n.t('history.clearConfirm');
      
      showAlert({
        title: language.startsWith('zh') ? '清除全部記錄' : 'Clear All Records',
        message: confirmMessage,
        buttons: [
          {
            text: i18n.t('history.cancel'),
            style: 'cancel',
          },
          {
            text: i18n.t('history.confirm'),
            style: 'destructive',
            onPress: async () => {
              if (filterDate) {
                // Delete records for this date
                for (const record of recordsToDelete) {
                  await deleteHistoryItem(record.id);
                }
                const filterDateStr = formatDate(filterDate, language);
                const recordsToKeep = history.filter(item => item.date !== filterDateStr);
                setHistory(recordsToKeep);
                setFilteredHistory([]);
              } else {
                // Clear all records
                await clearHistory();
                setHistory([]);
              }
              setIsSelectionMode(false);
            },
          },
        ],
      });
    }
  };



  const toggleRecordSelection = (id: string) => {
    const newSelected = new Set(selectedRecords);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRecords(newSelected);
  };

  const handleDeleteItem = (id: string) => {
    showAlert({
      title: i18n.t('history.deleteTitle'),
      message: i18n.t('history.deleteConfirm'),
      buttons: [
        {
          text: i18n.t('common.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('common.ok'),
          style: 'destructive',
          onPress: async () => {
            await deleteHistoryItem(id);
            // Updating local state directly instead of full reload to avoid screen flicker or reset
            const newHistory = history.filter(item => item.id !== id);
            setHistory(newHistory);
            
            // Re-apply filter if active
            if (filterDate) {
              // Same logic as useEffect - compare formatted date strings
              const filterDateStr = formatDate(filterDate, language);
              const filtered = newHistory.filter(item => {
                try {
                  return item.date === filterDateStr;
                } catch (e) {
                  return false;
                }
              });
              setFilteredHistory(filtered);
            } else {
              setFilteredHistory(newHistory);
            }
          },
        },
      ],
    });
  };

  const renderHistoryItem = ({ item }: { item: HistoryRecord }) => (
    <TouchableOpacity 
      style={styles.historyCard}
      onPress={() => isSelectionMode && toggleRecordSelection(item.id)}
      disabled={!isSelectionMode}
      activeOpacity={isSelectionMode ? 0.7 : 1}
    >
      <View style={styles.historyHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          {isSelectionMode && (
            <TouchableOpacity 
              style={[
                styles.checkbox,
                selectedRecords.has(item.id) && styles.checkboxChecked
              ]}
              onPress={() => toggleRecordSelection(item.id)}
            >
              {selectedRecords.has(item.id) && (
                <Ionicons name="checkmark" size={16} color={COLORS.background} />
              )}
            </TouchableOpacity>
          )}
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
        </View>
        {!isSelectionMode && (
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}
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
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${item.locationLat},${item.locationLng}`;
                const appleMapsUrl = `maps:0,0?q=${item.locationLat},${item.locationLng}`;
                const androidMapsUrl = `geo:0,0?q=${item.locationLat},${item.locationLng}`;
                
                // Prepare button options based on platform
                const buttons: any[] = [
                  { 
                    text: 'Google Maps',
                    onPress: () => {
                      require('react-native').Linking.openURL(googleMapsUrl).catch(() => {
                        showAlert({
                          title: language.startsWith('zh') ? '錯誤' : 'Error',
                          message: language.startsWith('zh') ? '無法打開地圖' : 'Cannot open map',
                        });
                      });
                    }
                  },
                ];
                
                // Add Apple Maps option for iOS
                if (Platform.OS === 'ios') {
                  buttons.push({
                    text: 'Apple Maps',
                    onPress: () => {
                      require('react-native').Linking.openURL(appleMapsUrl).catch(() => {
                        showAlert({
                          title: language.startsWith('zh') ? '錯誤' : 'Error',
                          message: language.startsWith('zh') ? '無法打開地圖' : 'Cannot open map',
                        });
                      });
                    }
                  });
                }
                
                // Add cancel button
                buttons.push({ text: i18n.t('common.cancel'), style: 'cancel' });
                
                showAlert({
                  title: i18n.t('luckyNumbers.openMap'),
                  message: item.locationAddress || item.location,
                  buttons: buttons,
                });
              }}
            >
              <Ionicons name="navigate" size={14} color={COLORS.primary} />
              <Text style={[styles.mapLinkText, { color: COLORS.primary }]}>{i18n.t('luckyNumbers.openMap')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
      <AnimatedBanner
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{i18n.t('history.title')}</Text>
        </View>
      </AnimatedBanner>

      <View style={styles.controlBar}>
        <TouchableOpacity 
          onPress={() => {
            // Initialize tempFilterDate to filterDate or today
            const now = new Date();
            const dateToUse = filterDate instanceof Date && !isNaN(filterDate.getTime()) 
              ? new Date(filterDate.getTime()) 
              : new Date(now.getFullYear(), now.getMonth(), now.getDate());
            setTempFilterDate(dateToUse);
            setDatePickerKey(prev => prev + 1); // Force re-render only when opening
            setShowDatePicker(true);
          }}
          style={styles.controlButton}
        >
          <Ionicons name="calendar-outline" size={18} color={COLORS.textBrand} />
          <Text style={styles.controlButtonText}>
            {filterDate ? formatDate(filterDate, language) : (language.startsWith('zh') ? '選擇日期' : 'Select Date')}
          </Text>
          {filterDate && (
             <TouchableOpacity onPress={clearFilter} style={{ marginLeft: SPACING.sm }}>
                <Ionicons name="close-circle" size={18} color={COLORS.textSecondary} />
             </TouchableOpacity>
          )}
        </TouchableOpacity>

        {(history.length > 0 || filteredHistory.length > 0) && (
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            {isSelectionMode && (
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={() => {
                  setIsSelectionMode(false);
                  setSelectedRecords(new Set());
                }}
              >
                <Ionicons name="close" size={18} color={COLORS.textBrand} />
                <Text style={styles.controlButtonText}>
                  {language.startsWith('zh') ? '取消' : 'Cancel'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={handleClearHistory}
            >
              <Ionicons name="trash-outline" size={18} color={COLORS.error} />
              <Text style={[styles.controlButtonText, { color: COLORS.error }]}>
                {isSelectionMode && selectedRecords.size > 0
                  ? `${language.startsWith('zh') ? '刪除選中' : 'Delete Selected'} (${selectedRecords.size})`
                  : isSelectionMode && selectedRecords.size === 0
                  ? (language.startsWith('zh') ? '清除全部' : 'Clear All')
                  : (language.startsWith('zh') ? '清除記錄' : 'Clear Records')
                }
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />

      {/* Date Picker Modal for iOS */}
      {showDatePicker && Platform.OS === 'ios' && (
        <Modal
          visible={showDatePicker}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowDatePicker(false)}
        >
          <TouchableOpacity 
            style={styles.pickerModalOverlay} 
            activeOpacity={1} 
            onPress={() => setShowDatePicker(false)}
          >
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.pickerModalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.pickerModalHeader}>
                 <Text style={styles.pickerModalTitle}>
                   {language.startsWith('zh') ? '選擇日期' : 'Select Date'}
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Ionicons name="close" size={28} color={COLORS.textBrand} />
                </TouchableOpacity>
              </View>
              <View style={{ width: '100%', alignItems: 'center' }}>
                <DateTimePicker
                  key={`history-filter-${datePickerKey}`}
                  value={tempFilterDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  textColor={COLORS.textBrand}
                  themeVariant={isDarkMode ? 'dark' : 'light'}
                  style={{ height: 200, width: '100%' }}
                  maximumDate={(() => {
                    const maxDate = new Date();
                    maxDate.setDate(maxDate.getDate() + 7);
                    return maxDate;
                  })()}
                  minimumDate={new Date(2020, 0, 1)}
                />
              </View>
              <CustomButton
                title={i18n.t('common.confirm')}
                onPress={confirmDateSelection}
                variant="gold"
                style={styles.confirmButton}
              />
              <CustomButton
                title={language.startsWith('zh') ? '顯示所有記錄' : 'Show All Records'}
                onPress={() => {
                  clearFilter();
                  setShowDatePicker(false);
                }}
                variant="outline"
                style={{ marginTop: SPACING.md, width: '100%' }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Date Picker for Android */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={filterDate || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

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

export default HistoryScreen;
