import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Animated,
  Easing,
  Dimensions,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedBanner from '../components/AnimatedBanner';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

import { getColors, SPACING, BORDER_RADIUS, FONTS, SHADOWS, getFontSizes } from '../constants/theme';
import { BIRTH_PLACES, PURCHASE_LOCATIONS, getValidPurchaseTime } from '../constants/config';
import { LotteryBall, CustomButton, Card, AdBanner, RotatingLogo, CustomAlert } from '../components';
import { calculateBazi } from '../utils/baziCalculator';
import { fetchMarkSixDrawDates, getNextDrawDateFallback, getPreviousDrawDateFallback } from '../utils/markSixApi';
import { saveUserData, loadUserData, saveHistory, generateId, formatDate, formatDateWithWeekday, formatTime, UserData } from '../utils/storage';
import i18n from '../i18n';
import { useApp } from '../context/AppContext';
import { useRoute } from '@react-navigation/native';
import { useCustomAlert } from '../utils/useCustomAlert';

const GlowingIcon = () => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  return (
    <Animated.View style={{ opacity, marginRight: 8 }}>
      <Ionicons name="megaphone" size={16} color="#FFD700" />
    </Animated.View>
  );
};

const MarqueeText = ({ text, style }: { text: string; style?: any }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const containerWidth = Dimensions.get('window').width - 80;
  
  // Create repeated text with larger spacing
  const repeatedText = `${text}          ${text}          ${text}`;

  useEffect(() => {
    if (textWidth > 0) {
      // Calculate the distance for one complete cycle (one text + spacing)
      const singleTextWidth = textWidth / 3; // Since we have 3 copies
      animatedValue.setValue(containerWidth);
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: -singleTextWidth,
          duration: 12000 + (singleTextWidth * 25), // Slower speed (was 8000 + 15)
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [textWidth, text]);

  return (
    <View style={{ flex: 1, overflow: 'hidden', height: 30, justifyContent: 'center' }}>
      <Animated.Text 
        style={[
          style, 
          { 
            transform: [{ translateX: animatedValue }], 
            position: 'absolute',
            width: 2000 // Larger width to accommodate repeated text
          }
        ]}
        onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
        numberOfLines={1}
        ellipsizeMode="clip"
      >
        {repeatedText}
      </Animated.Text>
    </View>
  );
};

const LuckyNumbersScreen: React.FC = () => {
  const { language, isSubscribed, userDataVersion, triggerUserDataReload, isDarkMode, fontSize, incrementGenerationCount } = useApp();
  const route = useRoute();
  const routeParams = route.params as { shouldShowUserModal?: boolean } | undefined;
  const COLORS = getColors(isDarkMode);
  const FONT_SIZES = getFontSizes(fontSize);
  const { alertState, showAlert, hideAlert } = useCustomAlert();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    flex: {
      flex: 1,
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
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitleContainer: {
      alignItems: 'center',
    },
    editProfileButtonContainer: { // Deprecated but keeping for reference if needed, can remove
      marginTop: -20,
      marginBottom: SPACING.xl,
      alignSelf: 'center',
    },
    editProfileButton: {
      width: 'auto',
    },
    logoContainer: {
      marginRight: SPACING.md,
    },
    logoCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: COLORS.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      ...SHADOWS.medium,
    },
    logoNumber: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: 'bold',
      color: COLORS.primary,
    },
    headerTextContainer: {
      flex: 1,
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: SPACING.lg,
      paddingTop: SPACING.xxxl * 2,
      paddingBottom: 300,
      justifyContent: 'flex-start',
      flexGrow: 1,
    },
    formCard: {
      marginBottom: SPACING.lg,
      alignSelf: 'center',
      width: '100%',
      maxWidth: 600,
      backgroundColor: COLORS.primary,
      borderWidth: 2,
      borderColor: '#FFD700', // Gold Border
      shadowColor: '#C41E3A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      padding: SPACING.md,
    },
    inputGroup: {
      marginBottom: SPACING.md,
    },
    label: {
      fontSize: FONT_SIZES.md,
      fontWeight: 'bold',
      color: '#FFD700', // Gold Text
      marginBottom: SPACING.sm,
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    textInput: {
      backgroundColor: COLORS.cardInnerBackground,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      fontSize: FONT_SIZES.md,
      color: COLORS.textBrand,
      borderWidth: 1,
      borderColor: '#FFD700',
    },
    pickerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: COLORS.cardInnerBackground, // Cream/Light Gold
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      borderWidth: 1,
      borderColor: '#FFD700',
    },
    pickerText: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.textBrand,
    },
    confirmButton: {
      marginTop: SPACING.md,
      marginBottom: SPACING.md,
    },
    pickerContainer: {
      backgroundColor: COLORS.backgroundDark,
      borderRadius: BORDER_RADIUS.md,
      marginTop: -SPACING.sm,
      marginBottom: SPACING.md,
    },
    pickerWrapper: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: SPACING.md,
    },
    dateTimePicker: {
      width: '100%',
    },
    picker: {
      height: 150,
      width: '100%',
    },
    genderContainer: {
      flexDirection: 'row',
      gap: SPACING.md,
    },
    genderButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.sm,
      borderRadius: BORDER_RADIUS.lg,
      borderWidth: 2,
      gap: SPACING.xs,
    },
    genderButtonMale: {
      borderColor: '#4A90E2',
      backgroundColor: 'rgba(74, 144, 226, 0.1)',
    },
    genderButtonFemale: {
      borderColor: '#E91E63',
      backgroundColor: 'rgba(233, 30, 99, 0.1)',
    },
    genderButtonActive: {
      backgroundColor: COLORS.secondary,
      borderColor: COLORS.secondary,
    },
    genderButtonText: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
    },
    genderButtonTextMale: {
      color: '#4A90E2',
    },
    genderButtonTextFemale: {
      color: '#E91E63',
    },
    genderButtonTextActive: {
      color: COLORS.textPrimary,
    },
    generateButton: {
      marginTop: SPACING.md,
      marginBottom: 0,
    },
    resultsCard: {
      marginTop: 120,
      marginBottom: SPACING.lg,
      borderWidth: 2,
      borderColor: '#FFD700', // Gold Border
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    resultsTitle: {
      fontSize: FONT_SIZES.lg,
      // Removed fontWeight: 'bold' to ensure MaShanZheng renders correctly
      color: '#FFD700', // Gold
      textAlign: 'center',
      marginBottom: SPACING.lg,
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      letterSpacing: 1,
    },
    numbersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },
    specialContainer: {
      alignItems: 'center',
      marginBottom: SPACING.lg,
      paddingTop: SPACING.md,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.3)',
    },
    specialLabel: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textWhite,
      marginBottom: SPACING.sm,
    },
    locationContainer: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      marginBottom: SPACING.lg,
    },
    locationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACING.sm,
    },
    locationLabel: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textWhite,
      marginLeft: SPACING.xs,
    },
    locationText: {
      fontSize: FONT_SIZES.md,
      fontWeight: 'bold',
      color: COLORS.secondary,
      marginBottom: SPACING.xs,
    },
    locationAddress: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textWhite,
      opacity: 0.8,
      marginBottom: SPACING.sm,
    },
    purchaseTimeContainer: {
      backgroundColor: 'rgba(255,215,0,0.1)',
      borderRadius: BORDER_RADIUS.sm,
      padding: SPACING.sm,
      marginTop: SPACING.sm,
      marginBottom: SPACING.sm,
      borderWidth: 1,
      borderColor: COLORS.secondary,
    },
    purchaseTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: SPACING.xs,
    },
    purchaseTimeLabel: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.secondary,
      marginLeft: SPACING.xs,
      marginRight: SPACING.xs,
      fontWeight: '600',
    },
    purchaseTimeText: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textWhite,
      fontWeight: 'bold',
    },
    mapButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.primary,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.sm,
      marginTop: SPACING.xs,
    },
    mapButtonText: {
      color: '#fff',
      fontSize: FONT_SIZES.sm,
      fontWeight: '600',
      marginLeft: SPACING.xs,
    },
    addButton: {
      alignSelf: 'center',
    },
    bottomSpacer: {
      height: SPACING.xs,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.lg,
    },
    modalContent: {
      backgroundColor: COLORS.background,
      borderRadius: BORDER_RADIUS.xxl,
      width: '88%',
      maxWidth: 480,
      maxHeight: '70%',
      ...SHADOWS.large,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.backgroundDark,
    },
    modalTitle: {
      fontSize: FONT_SIZES.xl,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
    },
    modalBody: {
    },
    modalBodyContent: {
      padding: SPACING.md,
      paddingBottom: SPACING.md,
    },
    privacyNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.backgroundDark,
      padding: SPACING.sm,
      borderRadius: BORDER_RADIUS.md,
      marginBottom: SPACING.md,
      gap: SPACING.xs,
    },
    privacyText: {
      flex: 1,
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
      lineHeight: 20,
    },
    modalInputGroup: {
      marginBottom: SPACING.md,
    },
    modalField: {
      marginBottom: SPACING.lg,
    },
    modalLabel: {
      fontSize: FONT_SIZES.md,
      fontWeight: '600',
      color: COLORS.textPrimary,
      marginBottom: SPACING.sm,
    },
    modalValue: {
      fontSize: FONT_SIZES.lg,
      fontWeight: '600',
      color: COLORS.textPrimary,
    },
    modalTextInput: {
      backgroundColor: COLORS.backgroundDark,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      fontSize: FONT_SIZES.md,
      color: COLORS.textPrimary,
      borderWidth: 1,
      borderColor: COLORS.backgroundDark,
    },
    modalPickerButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: COLORS.backgroundDark,
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.md,
      borderWidth: 1,
      borderColor: COLORS.backgroundDark,
    },
    modalPickerText: {
      fontSize: FONT_SIZES.md,
      color: COLORS.textPrimary,
      fontWeight: '600',
    },
    inlinePicker: {
      width: '100%',
    },
    modalFooter: {
      flexDirection: 'row',
      padding: SPACING.md,
      paddingTop: SPACING.lg,
      paddingBottom: SPACING.ld,
      gap: SPACING.xs,
      borderTopWidth: 1,
      borderTopColor: COLORS.backgroundDark,
    },
    modalButton: {
      flex: 1,
    },
    modalButtonInner: {
      width: '100%',
      paddingHorizontal: 0,
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
    },
    pickerModalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.lg,
    },
    pickerModalTitle: {
      fontSize: FONT_SIZES.lg,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
    },
  });

  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [birthTime, setBirthTime] = useState(12);
  const [birthMinute, setBirthMinute] = useState(0);
  const [birthPlace, setBirthPlace] = useState('Asia/Hong_Kong');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [drawDate, setDrawDate] = useState(new Date()); // 攪珠日期
  const [drawTime] = useState(21.5); // 攪珠時間 21:30 (固定)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showMinutePicker, setShowMinutePicker] = useState(false);
  const [showDrawDatePicker, setShowDrawDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date(1990, 0, 1));
  const [tempTime, setTempTime] = useState(12);
  const [tempMinute, setTempMinute] = useState(0);
  const [tempPlace, setTempPlace] = useState('Asia/Hong_Kong');
  const [tempDrawDate, setTempDrawDate] = useState(new Date());
  const [showPlacePicker, setShowPlacePicker] = useState(false);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [specialNumber, setSpecialNumber] = useState<number>(0);
  const [suggestedLocation, setSuggestedLocation] = useState<{name: string; address: string; lat: number; lng: number} | null>(null);
  const [purchaseDateTime, setPurchaseDateTime] = useState<{date: Date; time: string} | null>(null);
  const [alternativePurchaseDateTime, setAlternativePurchaseDateTime] = useState<{date: Date; time: string} | null>(null);
  const [bettingTimeExceeded, setBettingTimeExceeded] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasDataSaved, setHasDataSaved] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [previousDrawDate, setPreviousDrawDate] = useState<Date | null>(null);
  const [nextDrawDate, setNextDrawDate] = useState<Date | null>(null);
  const [nextDrawNumber, setNextDrawNumber] = useState<string | null>(null);
  const [drawFetchFailed, setDrawFetchFailed] = useState(false);
  const [resultsCardY, setResultsCardY] = useState(0);
  const [resultsCardHeight, setResultsCardHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const buttonAnim = useRef(new Animated.Value(1)).current;

  // Blinking animation for Generate button
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Fetch Mark Six draw dates on mount
  useEffect(() => {
    const fetchDrawDates = async () => {
      try {
        setDrawFetchFailed(false);
        console.log('Starting to fetch draw dates from magayo...');
        const { previousDraw, nextDraw } = await fetchMarkSixDrawDates();
        console.log('Fetch result:', { previousDraw, nextDraw });
        
        if (previousDraw) {
          setPreviousDrawDate(previousDraw.drawDate);
        }
        
        if (nextDraw) {
          console.log('Setting nextDrawNumber to:', nextDraw.drawNumber);
          setNextDrawDate(nextDraw.drawDate);
          setNextDrawNumber(nextDraw.drawNumber);
          setDrawDate(nextDraw.drawDate); // Set as default draw date
          setTempDrawDate(nextDraw.drawDate);
        } else {
          // Fetch failed - use current date as fallback
          console.log('No nextDraw data, using current date');
          setDrawFetchFailed(true);
          const currentDate = new Date();
          setNextDrawDate(currentDate);
          setNextDrawNumber(null);
          setDrawDate(currentDate);
          setTempDrawDate(currentDate);
        }
      } catch (error) {
        console.error('Error fetching draw dates:', error);
        setDrawFetchFailed(true);
        // Use current date as fallback
        const currentDate = new Date();
        setNextDrawDate(currentDate);
        setNextDrawNumber(null);
        setDrawDate(currentDate);
        setTempDrawDate(currentDate);
      }
    };
    
    fetchDrawDates();
  }, []);

  // Load saved user data or reset when userDataVersion changes
  useEffect(() => {
    const loadData = async () => {
      const userData = await loadUserData();
      if (userData) {
        setBirthDate(userData.birthDate);
        setBirthTime(userData.birthTime);
        setTempTime(userData.birthTime); // Sync tempTime with birthTime
        
        // Migrate old code format to timezone format
        let migratedBirthPlace = userData.birthPlace;
        if (!userData.birthPlace.includes('/')) {
          // Old format (code), convert to timezone
          const codeToTimezone: { [key: string]: string } = {
            'hongKong': 'Asia/Hong_Kong',
            'macau': 'Asia/Macau',
            'china': 'Asia/Shanghai',
            'philippines': 'Asia/Manila',
            'indonesia': 'Asia/Jakarta',
            'india': 'Asia/Kolkata',
            'uk': 'Europe/London',
            'usa': 'America/New_York',
            'australia': 'Australia/Sydney',
            'thailand': 'Asia/Bangkok',
            'malaysia': 'Asia/Kuala_Lumpur',
            'singapore': 'Asia/Singapore',
            'japan': 'Asia/Tokyo',
            'korea': 'Asia/Seoul',
            'taiwan': 'Asia/Taipei',
            'europe': 'Europe/Paris',
            'middleEast': 'Asia/Dubai',
            'vietnam': 'Asia/Ho_Chi_Minh',
            'africa': 'Africa/Johannesburg',
          };
          migratedBirthPlace = codeToTimezone[userData.birthPlace] || 'Asia/Hong_Kong';
        }
        
        setBirthPlace(migratedBirthPlace);
        setTempPlace(migratedBirthPlace); // Sync tempPlace with birthPlace
        setGender(userData.gender || null);
        setHasDataSaved(true);
      } else {
        // Reset to defaults (use 18 years ago as default birth date for age restriction)
        const defaultDate = new Date();
        defaultDate.setFullYear(defaultDate.getFullYear() - 18);
        setBirthDate(defaultDate);
        setBirthTime(12);
        setTempTime(12);
        setBirthPlace('Asia/Hong_Kong');
        setTempPlace('Asia/Hong_Kong');
        setGender(null);
        setHasDataSaved(false);
        setHasGenerated(false);
        setLuckyNumbers([]);
        setSpecialNumber(0);
        setSuggestedLocation(null);
      }
    };
    loadData();
  }, [userDataVersion]);

  // Show user modal if coming from first launch
  useEffect(() => {
    if (routeParams?.shouldShowUserModal) {
      // Small delay to ensure UI is ready
      setTimeout(() => {
        setShowUserModal(true);
      }, 300);
    }
  }, [routeParams?.shouldShowUserModal]);

  // Auto-scroll to results when generated
  useEffect(() => {
    if (hasGenerated && resultsCardY > 0 && resultsCardHeight > 0 && scrollViewHeight > 0) {
      // Small delay to ensure layout is stable
      setTimeout(() => {
        // We want to center the card in the *available visual space* of the ScrollView.
        // The ScrollView takes up exactly the space between the Header and the Bottom (Ads/Tab).
        // So we just need to center the content in the ScrollView's viewport.
        
        // Calculate the target scroll position:
        // Center of Card relative to Content Top = resultsCardY + (resultsCardHeight / 2)
        // Center of Viewport = scrollViewHeight / 2
        // Scroll Position = (Center of Card) - (Center of Viewport)
        
        const targetScrollY = resultsCardY + (resultsCardHeight / 2) - (scrollViewHeight / 2);
        
        console.log('Auto-scroll debug:', {
          resultsCardY,
          resultsCardHeight,
          scrollViewHeight,
          targetScrollY,
          isSubscribed
        });
        
        scrollViewRef.current?.scrollTo({ y: Math.max(targetScrollY, 0), animated: true });
      }, 100);
    }
  }, [hasGenerated, resultsCardY, resultsCardHeight, scrollViewHeight]);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (selectedDate) {
        setBirthDate(selectedDate);
      }
    } else {
      // iOS - update temp date
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const confirmDateSelection = () => {
    setBirthDate(tempDate);
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setTempDate(birthDate);
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (selectedTime) {
        setBirthTime(selectedTime.getHours());
      }
    } else {
      // iOS - update temp time
      if (selectedTime) {
        setTempTime(selectedTime.getHours());
      }
    }
  };

  const confirmTimeSelection = () => {
    setBirthTime(tempTime);
    setShowTimePicker(false);
  };

  const cancelTimeSelection = () => {
    setTempTime(birthTime);
    setShowTimePicker(false);
  };

  const confirmPlaceSelection = () => {
    setBirthPlace(tempPlace);
    setShowPlacePicker(false);
  };

  const cancelPlaceSelection = () => {
    setTempPlace(birthPlace);
    setShowPlacePicker(false);
  };

  const handleDrawDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDrawDatePicker(false);
      if (selectedDate) {
        setDrawDate(selectedDate);
      }
    } else {
      // iOS - update temp date
      if (selectedDate) {
        setTempDrawDate(selectedDate);
      }
    }
  };

  const confirmDrawDateSelection = () => {
    setDrawDate(tempDrawDate);
    setShowDrawDatePicker(false);
  };

  const cancelDrawDateSelection = () => {
    setTempDrawDate(drawDate);
    setShowDrawDatePicker(false);
  };

  // Random generation function
  const generateRandomData = () => {
    const randomGender = Math.random() > 0.5 ? 'male' : 'female';
    
    // Random birth date (between 1960-2006)
    const randomYear = 1960 + Math.floor(Math.random() * 46);
    const randomMonth = Math.floor(Math.random() * 12);
    const randomDay = 1 + Math.floor(Math.random() * 28);
    const randomBirthDate = new Date(randomYear, randomMonth, randomDay);
    
    // Random birth time (0-23)
    const randomHour = Math.floor(Math.random() * 24);
    
    // Random birth place
    const places = BIRTH_PLACES.map(p => p.timezone);
    const randomPlace = places[Math.floor(Math.random() * places.length)];
    setBirthDate(randomBirthDate);
    setTempDate(randomBirthDate);
    setBirthTime(randomHour);
    setTempTime(randomHour);
    setBirthPlace(randomPlace);
    setTempPlace(randomPlace);
    setGender(randomGender);
  };

  // Reset user data (except name)
  const resetUserData = () => {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    
    // Direct reset without alert in edit modal context
    setBirthDate(defaultDate);
    setTempDate(defaultDate);
    setBirthTime(12);
    setTempTime(12);
    setTempMinute(0);
    setBirthMinute(0);
    setBirthPlace('Asia/Hong_Kong');
    setTempPlace('Asia/Hong_Kong');
    setGender(null);
    setHasGenerated(false);
    setLuckyNumbers([]);
    setSpecialNumber(0);
    setSuggestedLocation(null);
    setPurchaseDateTime(null);
    setAlternativePurchaseDateTime(null);
  };

  // Check if user has input any data (compared to reset values)
  const hasUserData = () => {
    const defaultDate = new Date();
    defaultDate.setFullYear(defaultDate.getFullYear() - 18);
    const isSameDate = birthDate.getFullYear() === defaultDate.getFullYear() &&
                       birthDate.getMonth() === defaultDate.getMonth() &&
                       birthDate.getDate() === defaultDate.getDate();
    
    return !isSameDate ||
           birthTime !== 12 ||
           birthMinute !== 0 ||
           birthPlace !== 'Asia/Hong_Kong' ||
           gender !== null;
  };

  // Confirm user data
  const confirmUserData = () => {
    if (!hasUserData()) {
      // No data, show random generation option
      generateRandomData();
    } else {
      // Has data, just close modal
      setShowUserModal(false);
    }
  };

  const generateNumbers = useCallback(() => {
    // Check if user has default data (birth date, time, place)
    if (!hasUserData()) {
      // Directly open modal without Alert
      setShowUserModal(true);
      return;
    }

    setIsLoading(true);

    // Simulate calculation delay for better UX
    setTimeout(async () => {
      const year = birthDate.getFullYear();
      const month = birthDate.getMonth() + 1;
      const day = birthDate.getDate();

      // Calculate Bazi with all factors
      const baziResult = calculateBazi(year, month, day, birthTime);

      // Gender influence
      const genderOffset = gender === 'male' ? 1 : 2;
      
      // Birth time influence (时辰五行)
      const timeInfluence = Math.floor(birthTime / 2); // 12 time periods in Chinese astrology
      
      // Birth place influence
      const placeIndex = BIRTH_PLACES.findIndex(p => p.timezone === birthPlace);
      const placeInfluence = (placeIndex + 1) * 3;
      
      // Birth date numerology
      const dateSum = year + month + day;
      const dateInfluence = dateSum % 49;
      
      // Draw date/time influence (重要因素)
      const drawYear = drawDate.getFullYear();
      const drawMonth = drawDate.getMonth() + 1;
      const drawDay = drawDate.getDate();
      const drawDateSum = drawYear + drawMonth + drawDay;
      const drawTimeInfluence = Math.floor(drawTime * 10); // 21.5 -> 215
      const drawInfluence = (drawDateSum + drawTimeInfluence) % 49;
      
      // Generate 7 numbers (6 regular + 1 special) using all factors consistently
      // Combine all factors: gender, birth time, birth place, draw date/time
      const allFactors = genderOffset + timeInfluence + placeInfluence + dateInfluence + drawInfluence + drawTimeInfluence;
      
      const generatedNumbers: number[] = [];
      const baseNumbers = baziResult.luckyNumbers; // 6 numbers from Bazi
      
      // Generate 7 unique numbers using consistent formula with all factors
      for (let i = 0; i < 7; i++) {
        let attempts = 0;
        let newNum: number;
        
        do {
          // Use base number from Bazi (if available) combined with all factors
          const baseNum = i < baseNumbers.length ? baseNumbers[i] : (i * 7);
          newNum = ((baseNum + allFactors + (i * 11) + (attempts * 13)) % 49) + 1;
          attempts++;
        } while (generatedNumbers.includes(newNum) && attempts < 100);
        
        if (!generatedNumbers.includes(newNum)) {
          generatedNumbers.push(newNum);
        }
      }
      
      // Ensure we have exactly 7 unique numbers
      while (generatedNumbers.length < 7) {
        const seed = allFactors + generatedNumbers.length * 17;
        const randomNum = ((seed * 19 + generatedNumbers.length * 23) % 49) + 1;
        if (!generatedNumbers.includes(randomNum)) {
          generatedNumbers.push(randomNum);
        }
      }
      
      // First 6 numbers are regular numbers (sorted), last one is special number
      const sortedNumbers = generatedNumbers.slice(0, 6).sort((a, b) => a - b);
      const specialNum = generatedNumbers[6];
      
      setLuckyNumbers(sortedNumbers);
      setSpecialNumber(specialNum);

      // Get suggested location based on Bazi lucky direction
      // Filter locations by direction first, then select one from the matching direction
      const luckyDirection = baziResult.luckyDirection; // '東', '南', '西', '北', or '中'
      const directionLocations = PURCHASE_LOCATIONS.filter(loc => loc.direction === luckyDirection);
      
      // If no locations match the direction (or property doesn't exist), fall back to all locations
      const availableLocations = directionLocations.length > 0 ? directionLocations : PURCHASE_LOCATIONS;
      
      const locationSeed = genderOffset + timeInfluence + placeInfluence + dateInfluence + drawInfluence;
      const locationIndex = Math.abs(locationSeed) % availableLocations.length;
      const location = availableLocations[locationIndex];
      setSuggestedLocation(location);
      
      // Calculate suggested purchase date and time
      // Must be between NOW and draw date/time (before 21:15 cutoff)
      const now = new Date();
      const drawCutoff = new Date(drawDate);
      drawCutoff.setHours(21, 15, 0, 0); // 截止時間 21:15
      
      // Calculate optimal days before draw (1-3 days, but must be after previous draw)
      const daysBeforeDraw = (locationSeed % 3) + 1; // 1, 2, or 3 days before
      let purchaseDate = new Date(drawDate);
      purchaseDate.setDate(purchaseDate.getDate() - daysBeforeDraw);
      
      // If suggested date is in the past, use tomorrow
      if (purchaseDate < now) {
        purchaseDate = new Date(now);
        purchaseDate.setDate(purchaseDate.getDate() + 1);
        purchaseDate.setHours(0, 0, 0, 0);
      }
      
      // If purchase date is after draw cutoff, move it earlier
      if (purchaseDate >= drawCutoff) {
        purchaseDate = new Date(drawCutoff);
        purchaseDate.setDate(purchaseDate.getDate() - 1);
      }
      
      // Calculate purchase time (based on factors, between 9:00-21:00)
      const timeSlots = ['09:00', '10:30', '12:00', '14:00', '16:00', '18:00', '19:30', '21:00'];
      const timeIndex = Math.abs(locationSeed + drawTimeInfluence) % timeSlots.length;
      let suggestedTime = timeSlots[timeIndex];
      
      // If purchase date is today, ensure time is in the future
      const purchaseDateOnly = new Date(purchaseDate);
      purchaseDateOnly.setHours(0, 0, 0, 0);
      const todayOnly = new Date(now);
      todayOnly.setHours(0, 0, 0, 0);
      
      if (purchaseDateOnly.getTime() === todayOnly.getTime()) {
        // Same day - ensure time is after current time
        const [suggestedHour, suggestedMin] = suggestedTime.split(':').map(Number);
        const suggestedDateTime = new Date(now);
        suggestedDateTime.setHours(suggestedHour, suggestedMin, 0, 0);
        
        if (suggestedDateTime <= now) {
          // Find next available time slot
          const currentHour = now.getHours();
          const availableSlots = timeSlots.filter(slot => {
            const [hour] = slot.split(':').map(Number);
            return hour > currentHour;
          });
          
          if (availableSlots.length > 0) {
            suggestedTime = availableSlots[0];
          } else {
            // No time slots left today, move to tomorrow
            purchaseDate.setDate(purchaseDate.getDate() + 1);
            suggestedTime = timeSlots[0]; // Start with earliest time
          }
        }
      }
      
      // If purchase date is same as draw date, ensure before cutoff (21:15)
      // Also avoid the blackout period 21:13 - 21:45
      const purchaseDateStr = purchaseDate.toDateString();
      const drawDateStr = drawDate.toDateString();
      if (purchaseDateStr === drawDateStr) {
        const [hour, min] = suggestedTime.split(':').map(Number);
        // Check if time is in blackout period (21:13 - 21:45)
        const isInBlackout = (hour === 21 && min >= 13) || (hour === 21 && min <= 45);
        
        if (hour > 21 || (hour === 21 && min >= 15) || isInBlackout) {
          // Too late on draw day or in blackout period, use earlier time
          suggestedTime = '19:30';
        }
      }
      
      // Validate and adjust time based on branch operating hours
      const validPurchaseTime = getValidPurchaseTime(purchaseDate, suggestedTime);
      
      setPurchaseDateTime({ date: purchaseDate, time: validPurchaseTime });
      
      // Check if optimal purchase time has already passed
      const optimalDateTime = new Date(purchaseDate);
      const [optimalHour, optimalMin] = validPurchaseTime.split(':').map(Number);
      optimalDateTime.setHours(optimalHour, optimalMin, 0, 0);
      
      if (optimalDateTime <= now) {
        // Check if we're past the draw cutoff time
        if (now >= drawCutoff) {
          // Betting time has exceeded
          setBettingTimeExceeded(true);
          setAlternativePurchaseDateTime(null);
        } else {
          // Calculate alternative purchase time (next available slot)
          setBettingTimeExceeded(false);
          let alternativeDate = new Date(now);
          let alternativeTime = '';
          
          // Check if there's a time slot available today
          const currentHour = now.getHours();
          const currentMin = now.getMinutes();
          const futureSlots = timeSlots.filter(slot => {
            const [hour, min] = slot.split(':').map(Number);
            // Must be at least current time or later
            return hour > currentHour || (hour === currentHour && min > currentMin);
          });
          
          if (futureSlots.length > 0 && alternativeDate.toDateString() !== drawDate.toDateString()) {
            // Use next available slot today (if not draw day)
            alternativeTime = futureSlots[0];
          } else if (futureSlots.length > 0 && alternativeDate.toDateString() === drawDate.toDateString()) {
            // Draw day - check if slot is before blackout period
            const validDrawDaySlots = futureSlots.filter(slot => {
              const [hour, min] = slot.split(':').map(Number);
              return hour < 21 || (hour === 21 && min < 13);
            });
            if (validDrawDaySlots.length > 0) {
              alternativeTime = validDrawDaySlots[0];
            } else {
              // No valid slots today, betting time exceeded
              setBettingTimeExceeded(true);
              setAlternativePurchaseDateTime(null);
              return;
            }
          } else {
            // No slots left today, check if tomorrow is before draw cutoff
            const tomorrowDate = new Date(now);
            tomorrowDate.setDate(tomorrowDate.getDate() + 1);
            tomorrowDate.setHours(0, 0, 0, 0);
            
            if (tomorrowDate >= drawCutoff) {
              // Tomorrow exceeds draw cutoff, betting time exceeded
              setBettingTimeExceeded(true);
              setAlternativePurchaseDateTime(null);
              return;
            } else {
              // Use tomorrow's first slot
              alternativeDate = tomorrowDate;
              alternativeTime = timeSlots[0];
            }
          }
          
          // Final check: ensure alternative time is not past draw cutoff
          const alternativeDateTime = new Date(alternativeDate);
          const [altHour, altMin] = alternativeTime.split(':').map(Number);
          alternativeDateTime.setHours(altHour, altMin, 0, 0);
          
          if (alternativeDateTime >= drawCutoff) {
            // Alternative time exceeds draw cutoff
            setBettingTimeExceeded(true);
            setAlternativePurchaseDateTime(null);
          } else {
            const validAlternativeTime = getValidPurchaseTime(alternativeDate, alternativeTime);
            setAlternativePurchaseDateTime({ date: alternativeDate, time: validAlternativeTime });
          }
        }
      } else {
        // Optimal time hasn't passed yet
        setBettingTimeExceeded(false);
        setAlternativePurchaseDateTime(null);
      }

      setHasGenerated(true);
      setIsLoading(false);
      
      // Scroll to center the results card while hiding Generate button area
      setTimeout(() => {
        if (scrollViewRef.current && resultsCardY > 0) {
          // Calculate scroll position to center the card vertically
          // Subtract some pixels so the card is centered, not at top
          const scrollTarget = resultsCardY - 100; // Leave 100px above the card for visual balance
          scrollViewRef.current.scrollTo({ 
            y: Math.max(scrollTarget, 0),
            animated: true 
          });
        }
      }, 150);
      
      // Increment generation count for interstitial ad tracking
      incrementGenerationCount();

      // Check if user data has changed or is new
      const userData = await loadUserData();
      const hasDataChanged = !userData || 
        userData.birthDate.getTime() !== birthDate.getTime() ||
        userData.birthTime !== birthTime ||
        userData.birthPlace !== birthPlace ||
        userData.gender !== gender;

      // Automatically save user data without asking
      if (hasDataChanged) {
        await saveUserData({
          birthDate,
          birthTime,
          birthPlace,
          gender,
        });
        setHasDataSaved(true);
        // Trigger reload to update Bazi Analysis screen
        triggerUserDataReload();
      } else {
        // Data hasn't changed, just trigger reload
        triggerUserDataReload();
      }
      
      // Get location display based on language
      const locationDisplay = getLocationDisplay(location);

      // Always save to history immediately
      try {
        await saveHistory({
          id: generateId(),
          date: formatDate(drawDate, language),
          time: '21:30',
          numbers: sortedNumbers,
          specialNumber: specialNum,
          location: locationDisplay.name,
          locationAddress: locationDisplay.address,
          locationLat: location.lat,
          locationLng: location.lng,
        });
        console.log('History saved successfully');
      } catch (error) {
        console.error('Error saving history:', error);
      }
    }, 1000);
  }, [birthDate, birthTime, birthPlace, gender, drawDate, language, hasDataSaved, triggerUserDataReload]);

  const getBirthPlaceName = (timezone: string): string => {
    const place = BIRTH_PLACES.find(p => p.timezone === timezone);
    return place ? i18n.t(place.labelKey) : timezone;
  };

  const formatBirthTime = (hour: number): string => {
    const h = hour.toString().padStart(2, '0');
    return `${h}:00`;
  };

  const getLocationDisplay = (location: any) => {
    // For Chinese languages, use Chinese name and address
    if (language === 'zh-TW' || language === 'zh-CN') {
      return {
        name: location.nameZh || location.name,
        address: location.address,
      };
    }
    // For other languages, use English name and address
    return {
      name: location.nameEn || location.name,
      address: location.addressEn || location.address,
    };
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {/* Header */}
        <AnimatedBanner
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.headerTitle, { 
                color: '#FFD700', // Shiny Gold
                // Reverted to default font as requested
                // fontFamily: Platform.select({ ios: 'STKaiti', android: 'serif' }),
                textShadowColor: '#B8860B',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
                letterSpacing: 1
              }]}>{i18n.t('luckyNumbers.title')}</Text>
              <Text style={[styles.headerSubtitle, { color: '#FFED4E', opacity: 0.95 }]}>{i18n.t('luckyNumbers.subtitle')}</Text>
            </View>
          </View>
          
          {/* Marquee / Notification Area */}
          <View style={{ 
            marginTop: SPACING.sm, 
            backgroundColor: 'rgba(0,0,0,0.2)', 
            borderRadius: BORDER_RADIUS.round,
            paddingVertical: SPACING.xxs,
            paddingHorizontal: SPACING.sm,
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: SPACING.sm,
            borderWidth: 1,
            borderColor: 'rgba(255, 215, 0, 0.3)'
          }}>
            <GlowingIcon />
            <MarqueeText 
              text={nextDrawDate ? `${i18n.t('luckyNumbers.nextDraw')}: ${nextDrawNumber || ''}   ${i18n.t('luckyNumbers.drawDate')}: ${formatDateWithWeekday(nextDrawDate, language)}  ✨ ${i18n.t('luckyNumbers.wishingSuccess')} ✨` : ''} 
              style={{ 
                color: '#FFFFFF', 
                fontSize: FONT_SIZES.sm, 
                fontWeight: '900',
                textShadowColor: '#FFD700',
                textShadowOffset: { width: 0, height: 0 },
                textShadowRadius: 8,
              }} 
            />
          </View>
        </AnimatedBanner>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
          contentContainerStyle={[
            styles.scrollContent, 
            !hasGenerated && { 
              justifyContent: 'center', 
              paddingTop: 0, 
              paddingBottom: SPACING.xl // Reduce bottom padding to center it properly
            },
            hasGenerated && { paddingTop: SPACING.md }
          ]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Input Form */}
          <Card style={styles.formCard}>
            
            {/* User Profile Summary (Mini Header inside Card) */}
            <TouchableOpacity 
              onPress={() => setShowUserModal(true)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: SPACING.lg,
                paddingVertical: SPACING.sm,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 215, 0, 0.5)', // Gold separator
              }}
            >
              <Ionicons name="person-circle" size={28} color="#FFD700" style={{ marginRight: SPACING.xs }} />
              <Text style={{ 
                fontSize: FONT_SIZES.lg, 
                color: '#FFD700', // Gold text
                fontFamily: language.startsWith('zh') ? 'MaShanZheng_400Regular' : undefined,
                fontWeight: language.startsWith('zh') ? 'normal' : 'bold',
              }}>
                {i18n.t('luckyNumbers.editProfile')}
              </Text>
              <Ionicons name="pencil" size={20} color="#FFD700" style={{ marginLeft: SPACING.xs }} />
            </TouchableOpacity>

            {/* Draw Date */}
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm }}>
                <Text style={styles.label}>{i18n.t('luckyNumbers.drawDate')}</Text>
                {drawFetchFailed && (
                  <Text style={[styles.label, { color: COLORS.error }]}>
                    {language.startsWith('zh') ? '攪珠日期下載失敗' : 'Draw Date Download Failed'}
                  </Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.pickerButton}
                onPress={() => setShowDrawDatePicker(true)}
              >
                <Text style={styles.pickerText}>
                  {formatDate(drawDate, language)}
                </Text>
                <Ionicons name="calendar-outline" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {/* Draw Time (Fixed at 21:30) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{i18n.t('luckyNumbers.drawTime')}</Text>
              <View style={styles.pickerButton}>
                <Text style={styles.pickerText}>21:30</Text>
                <Ionicons name="time-outline" size={20} color={COLORS.textLight} />
              </View>
            </View>

            {/* Generate Button */}
            <Animated.View style={{ opacity: buttonAnim }}>
              <CustomButton
                title={i18n.t('luckyNumbers.generateNumbers')}
                onPress={generateNumbers}
                variant="gold"
                size="large"
                loading={isLoading}
                style={styles.generateButton}
              />
            </Animated.View>
          </Card>

          {/* Results */}
          {hasGenerated && (
            <Card 
              variant="gradient" 
              style={styles.resultsCard}
              onLayout={(event) => {
                const { y, height } = event.nativeEvent.layout;
                setResultsCardY(y);
                setResultsCardHeight(height);
              }}
            >
              <Text style={styles.resultsTitle}>
                {i18n.t('luckyNumbers.yourLuckyNumbers')}
              </Text>
              
              {/* Lucky Numbers */}
              <View style={styles.numbersContainer}>
                {luckyNumbers.map((num, index) => (
                  <LotteryBall key={index} number={num} size="large" />
                ))}
              </View>

              {/* Special Number */}
              <View style={styles.specialContainer}>
                <Text style={styles.specialLabel}>
                  {i18n.t('luckyNumbers.specialNumber')}
                </Text>
                <LotteryBall number={specialNumber} isSpecial size="large" />
              </View>

              {/* Suggested Location */}
              <View style={styles.locationContainer}>
                <View style={styles.locationHeader}>
                  <Ionicons name="location" size={20} color={COLORS.secondary} />
                  <Text style={styles.locationLabel}>
                    {i18n.t('luckyNumbers.suggestedLocation')}:
                  </Text>
                </View>
                {suggestedLocation && (
                  <>
                    <Text style={styles.locationText}>{getLocationDisplay(suggestedLocation).name}</Text>
                    <Text style={styles.locationAddress}>{getLocationDisplay(suggestedLocation).address}</Text>
                    
                    {/* Purchase Date and Time */}
                    {purchaseDateTime && (
                      <View style={styles.purchaseTimeContainer}>
                        <View style={styles.purchaseTimeRow}>
                          <Ionicons name="calendar" size={18} color={COLORS.secondary} />
                          <Text style={styles.purchaseTimeLabel}>{i18n.t('luckyNumbers.purchaseDate')}:</Text>
                          <Text style={styles.purchaseTimeText}>{formatDate(purchaseDateTime.date, language)}</Text>
                        </View>
                        <View style={styles.purchaseTimeRow}>
                          <Ionicons name="time" size={18} color={COLORS.secondary} />
                          <Text style={styles.purchaseTimeLabel}>{i18n.t('luckyNumbers.purchaseTime')}:</Text>
                          <Text style={styles.purchaseTimeText}>{purchaseDateTime.time}</Text>
                        </View>
                        
                        {/* Alternative Purchase Time (if optimal time has passed) */}
                        {alternativePurchaseDateTime && (
                          <View style={{ marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                            <View style={styles.purchaseTimeRow}>
                              <Ionicons name="calendar-outline" size={18} color="#27AE60" />
                              <Text style={[styles.purchaseTimeLabel, { color: '#27AE60' }]}>{i18n.t('luckyNumbers.alternativeDate')}:</Text>
                              <Text style={[styles.purchaseTimeText, { color: '#27AE60' }]}>{formatDate(alternativePurchaseDateTime.date, language)}</Text>
                            </View>
                            <View style={styles.purchaseTimeRow}>
                              <Ionicons name="time-outline" size={18} color="#27AE60" />
                              <Text style={[styles.purchaseTimeLabel, { color: '#27AE60' }]}>{i18n.t('luckyNumbers.alternativeTime')}:</Text>
                              <Text style={[styles.purchaseTimeText, { color: '#27AE60' }]}>{alternativePurchaseDateTime.time}</Text>
                            </View>
                          </View>
                        )}
                        
                        {/* Betting Time Exceeded Message */}
                        {bettingTimeExceeded && (
                          <View style={{ marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border }}>
                            <View style={styles.purchaseTimeRow}>
                              <Ionicons name="alert-circle-outline" size={18} color="#27AE60" />
                              <Text style={[styles.purchaseTimeLabel, { color: '#27AE60', marginLeft: SPACING.xs }]}>
                                {language.startsWith('zh') ? '已超過投注時間' : 'Betting Time Exceeded'}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                    
                    <TouchableOpacity
                      style={styles.mapButton}
                      onPress={() => {
                        const locationDisplay = getLocationDisplay(suggestedLocation);
                        const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${suggestedLocation.lat},${suggestedLocation.lng}`;
                        const appleMapsUrl = `maps:0,0?q=${suggestedLocation.lat},${suggestedLocation.lng}`;
                        const androidMapsUrl = `geo:0,0?q=${suggestedLocation.lat},${suggestedLocation.lng}`;
                        
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
                          message: locationDisplay.address,
                          buttons: buttons,
                        });
                      }}
                    >
                      <Ionicons name="navigate" size={16} color="#fff" />
                      <Text style={styles.mapButtonText}>{i18n.t('luckyNumbers.openMap')}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* User Data Modal */}
      <Modal
        visible={showUserModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowUserModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{i18n.t('luckyNumbers.baziInfo')}</Text>
                <TouchableOpacity onPress={() => setShowUserModal(false)}>
                  <Ionicons name="close" size={28} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.modalBody} 
                contentContainerStyle={styles.modalBodyContent}
                showsVerticalScrollIndicator={true}
              >
                {/* Privacy Notice */}
                <View style={styles.privacyNotice}>
                  <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                  <Text style={styles.privacyText}>{i18n.t('luckyNumbers.privacyNotice')}</Text>
                </View>

                {/* Gender */}
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>{i18n.t('luckyNumbers.gender')}</Text>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        styles.genderButtonMale,
                        gender === 'male' && styles.genderButtonActive,
                      ]}
                      onPress={() => setGender('male')}
                    >
                      <Ionicons
                        name="male"
                        size={24}
                        color={gender === 'male' ? COLORS.textPrimary : '#4A90E2'}
                      />
                      <Text
                        style={[
                          styles.genderButtonText,
                          styles.genderButtonTextMale,
                          gender === 'male' && styles.genderButtonTextActive,
                        ]}
                      >
                        {i18n.t('luckyNumbers.male')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        styles.genderButtonFemale,
                        gender === 'female' && styles.genderButtonActive,
                      ]}
                      onPress={() => setGender('female')}
                    >
                      <Ionicons
                        name="female"
                        size={24}
                        color={gender === 'female' ? COLORS.textPrimary : '#E91E63'}
                      />
                      <Text
                        style={[
                          styles.genderButtonText,
                          styles.genderButtonTextFemale,
                          gender === 'female' && styles.genderButtonTextActive,
                        ]}
                      >
                        {i18n.t('luckyNumbers.female')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Birth Date */}
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>{i18n.t('luckyNumbers.birthDate')}</Text>
                  <TouchableOpacity
                    style={styles.modalPickerButton}
                    onPress={() => {
                      setTempDate(birthDate);
                      setShowDatePicker(true);
                    }}
                  >
                    <Text style={styles.modalPickerText}>
                      {birthDate.getFullYear()}-{(birthDate.getMonth() + 1).toString().padStart(2, '0')}-{birthDate.getDate().toString().padStart(2, '0')}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                {showDatePicker && Platform.OS === 'ios' && (
                  <Modal
                    visible={showDatePicker}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowDatePicker(false)}
                  >
                    <View style={styles.pickerModalOverlay}>
                      <View style={styles.pickerModalContent}>
                        <View style={styles.pickerModalHeader}>
                          <Text style={styles.pickerModalTitle}>{i18n.t('luckyNumbers.birthDate')}</Text>
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Ionicons name="close" size={28} color={COLORS.textPrimary} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.pickerWrapper}>
                          <DateTimePicker
                            key="edit-bazi-birthdate-picker"
                            value={tempDate}
                            mode="date"
                            display="spinner"
                            onChange={(event, selectedDate) => {
                              if (selectedDate) {
                                setTempDate(selectedDate);
                              }
                            }}
                            textColor={COLORS.textPrimary}
                            themeVariant={isDarkMode ? 'dark' : 'light'}
                            style={styles.dateTimePicker}
                            maximumDate={(() => {
                              const maxDate = new Date();
                              maxDate.setFullYear(maxDate.getFullYear() - 18);
                              return maxDate;
                            })()}
                            minimumDate={new Date(1900, 0, 1)}
                          />
                        </View>
                        <CustomButton
                          title={i18n.t('common.confirm')}
                          onPress={() => {
                            setBirthDate(tempDate);
                            setShowDatePicker(false);
                          }}
                          style={styles.confirmButton}
                        />
                      </View>
                    </View>
                  </Modal>
                )}
                {showDatePicker && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (event.type === 'set' && selectedDate) {
                        setBirthDate(selectedDate);
                      }
                    }}
                    maximumDate={(() => {
                      const maxDate = new Date();
                      maxDate.setFullYear(maxDate.getFullYear() - 18);
                      return maxDate;
                    })()}
                    minimumDate={new Date(1900, 0, 1)}
                  />
                )}

                {/* Birth Time */}
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>{i18n.t('luckyNumbers.birthTime')}</Text>
                  <TouchableOpacity
                    style={styles.modalPickerButton}
                    onPress={() => {
                      setTempTime(birthTime);
                      setTempMinute(birthMinute);
                      setShowTimePicker(true);
                    }}
                  >
                    <Text style={styles.modalPickerText}>
                      {birthTime.toString().padStart(2, '0')}:{birthMinute.toString().padStart(2, '0')}
                    </Text>
                    <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                {showTimePicker && Platform.OS === 'ios' && (
                  <Modal
                    visible={showTimePicker}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowTimePicker(false)}
                  >
                    <View style={styles.pickerModalOverlay}>
                      <View style={styles.pickerModalContent}>
                        <View style={styles.pickerModalHeader}>
                          <Text style={styles.pickerModalTitle}>{i18n.t('luckyNumbers.birthTime')}</Text>
                          <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                            <Ionicons name="close" size={28} color={COLORS.textPrimary} />
                          </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'center', marginBottom: SPACING.xs, color: COLORS.textPrimary, fontSize: FONT_SIZES.sm }}>{i18n.t('luckyNumbers.hour')}</Text>
                            <Picker
                              selectedValue={tempTime}
                              onValueChange={(value) => setTempTime(Number(value))}
                              style={styles.picker}
                              itemStyle={{ color: COLORS.textPrimary }}
                              dropdownIconColor={COLORS.textPrimary}
                              themeVariant={isDarkMode ? 'dark' : 'light'}
                            >
                              {Array.from({ length: 24 }, (_, i) => (
                                <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i} />
                              ))}
                            </Picker>
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={{ textAlign: 'center', marginBottom: SPACING.xs, color: COLORS.textPrimary, fontSize: FONT_SIZES.sm }}>{i18n.t('luckyNumbers.minute')}</Text>
                            <Picker
                              selectedValue={tempMinute}
                              onValueChange={(value) => setTempMinute(Number(value))}
                              style={styles.picker}
                              itemStyle={{ color: COLORS.textPrimary }}
                              dropdownIconColor={COLORS.textPrimary}
                              themeVariant={isDarkMode ? 'dark' : 'light'}
                            >
                              {Array.from({ length: 60 }, (_, i) => (
                                <Picker.Item key={i} label={i.toString().padStart(2, '0')} value={i} />
                              ))}
                            </Picker>
                          </View>
                        </View>
                        <CustomButton
                          title={i18n.t('common.confirm')}
                          onPress={() => {
                            setBirthTime(tempTime);
                            setBirthMinute(tempMinute);
                            setShowTimePicker(false);
                          }}
                          style={styles.confirmButton}
                        />
                      </View>
                    </View>
                  </Modal>
                )}
                {showTimePicker && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={new Date(0, 0, 0, birthTime, birthMinute)}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowTimePicker(false);
                      if (selectedTime) {
                        setBirthTime(selectedTime.getHours());
                        setBirthMinute(selectedTime.getMinutes());
                      }
                    }}
                  />
                )}

                {/* Birth Place */}
                <View style={styles.modalInputGroup}>
                  <Text style={styles.modalLabel}>{i18n.t('luckyNumbers.birthPlace')}</Text>
                  <TouchableOpacity
                    style={styles.modalPickerButton}
                    onPress={() => {
                      setTempPlace(birthPlace);
                      setShowPlacePicker(true);
                    }}
                  >
                    <Text style={styles.modalPickerText}>{getBirthPlaceName(birthPlace)}</Text>
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>

                {showPlacePicker && (
                  <Modal
                    visible={showPlacePicker}
                    animationType="fade"
                    transparent={true}
                    onRequestClose={() => setShowPlacePicker(false)}
                  >
                    <View style={styles.pickerModalOverlay}>
                      <View style={styles.pickerModalContent}>
                        <View style={styles.pickerModalHeader}>
                          <Text style={styles.pickerModalTitle}>{i18n.t('luckyNumbers.birthPlace')}</Text>
                          <TouchableOpacity onPress={() => setShowPlacePicker(false)}>
                            <Ionicons name="close" size={28} color={COLORS.textPrimary} />
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.pickerWrapper, Platform.OS === 'android' && { height: 300 }]}>
                          {Platform.OS === 'ios' ? (
                            <Picker
                              selectedValue={tempPlace}
                              onValueChange={(value) => setTempPlace(value)}
                              style={styles.picker}
                              itemStyle={{ color: COLORS.textPrimary }}
                              dropdownIconColor={COLORS.textPrimary}
                              themeVariant={isDarkMode ? 'dark' : 'light'}
                            >
                              {BIRTH_PLACES.map((place) => (
                                <Picker.Item
                                  key={place.timezone}
                                  label={i18n.t(place.labelKey)}
                                  value={place.timezone}
                                />
                              ))}
                            </Picker>
                          ) : (
                            <FlatList
                              data={BIRTH_PLACES}
                              keyExtractor={(item: { timezone: string }) => item.timezone}
                              renderItem={({ item }: { item: { timezone: string; labelKey: string } }) => (
                                <TouchableOpacity
                                  style={{
                                    paddingVertical: 12,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'rgba(0,0,0,0.1)',
                                    backgroundColor: tempPlace === item.timezone ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                                    paddingHorizontal: SPACING.md,
                                  }}
                                  onPress={() => setTempPlace(item.timezone)}
                                >
                                  <Text style={{ 
                                    fontSize: FONT_SIZES.md, 
                                    textAlign: 'center',
                                    color: COLORS.textPrimary,
                                    fontWeight: tempPlace === item.timezone ? 'bold' : 'normal'
                                  }}>
                                    {i18n.t(item.labelKey)}
                                  </Text>
                                </TouchableOpacity>
                              )}
                              style={{ width: '100%' }}
                            />
                          )}
                        </View>
                        <CustomButton
                          title={i18n.t('common.confirm')}
                          onPress={() => {
                            setBirthPlace(tempPlace);
                            setShowPlacePicker(false);
                          }}
                          style={styles.confirmButton}
                        />
                      </View>
                    </View>
                  </Modal>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <View style={styles.modalButton}>
                  <CustomButton
                    title={i18n.t('luckyNumbers.reset')}
                    onPress={resetUserData}
                    variant="outlineGold"
                    size="medium"
                    style={styles.modalButtonInner}
                  />
                </View>
                <View style={styles.modalButton}>
                  <CustomButton
                    title={hasUserData() ? i18n.t('common.confirm') : i18n.t('luckyNumbers.random')}
                    onPress={confirmUserData}
                    variant="gold"
                    size="medium"
                    style={styles.modalButtonInner}
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      
      {/* Draw Date Picker Modal */}
      {showDrawDatePicker && Platform.OS === 'ios' && (
        <Modal
          visible={showDrawDatePicker}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowDrawDatePicker(false)}
        >
          <View style={styles.pickerModalOverlay}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerModalHeader}>
                <Text style={styles.pickerModalTitle}>{i18n.t('luckyNumbers.drawDate')}</Text>
                <TouchableOpacity onPress={cancelDrawDateSelection}>
                  <Ionicons name="close" size={28} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={tempDrawDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDrawDateChange}
                  minimumDate={new Date()}
                  maximumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
                  style={{ width: '100%' }}
                  textColor={COLORS.textPrimary}
                  themeVariant={isDarkMode ? 'dark' : 'light'}
                />
              </View>
              <CustomButton
                title={i18n.t('common.confirm')}
                onPress={confirmDrawDateSelection}
                style={styles.confirmButton}
              />
            </View>
          </View>
        </Modal>
      )}
      {showDrawDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={drawDate}
          mode="date"
          display="default"
          onChange={handleDrawDateChange}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
        />
      )}
      
      {/* Ad Banner */}
      {!isSubscribed && <AdBanner position="bottom" adType="luckyNumbersBanner" />}
      
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

export default LuckyNumbersScreen;
