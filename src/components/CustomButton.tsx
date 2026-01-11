import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getColors, BORDER_RADIUS, SPACING, FONTS, SHADOWS } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'outlineRed';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { isDarkMode } = useApp();
  const COLORS = getColors(isDarkMode);

  const styles = StyleSheet.create({
    gradientButton: {
      borderRadius: BORDER_RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      ...SHADOWS.medium,
      width: '100%',
    },
    gradientText: {
      color: '#FFFFFF', // Reverted to White
      fontWeight: 'bold', // Reverted to bold
      // Removed custom Chinese font
      letterSpacing: 0.5,
      // Removed text shadow for normal style
    },
    goldText: {
      color: '#8B0000', // Deep Dark Red for better contrast on Gold
      fontWeight: 'bold',
    },
    outlineButton: {
      borderRadius: BORDER_RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: COLORS.primary,
      backgroundColor: 'transparent',
    },
    outlineText: {
      color: COLORS.primary,
      fontWeight: 'bold',
    },
    outlineRedButton: {
      borderRadius: BORDER_RADIUS.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: COLORS.primary,
      backgroundColor: COLORS.backgroundCard,
    },
    outlineRedText: {
      color: COLORS.primary,
      fontWeight: 'bold',
    },
    disabledButton: {
      borderColor: COLORS.border,
    },
    disabledText: {
      color: COLORS.textLight,
    },
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
          fontSize: FONTS.sizes.sm,
        };
      case 'large':
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xxl,
          fontSize: FONTS.sizes.lg,
        };
      default:
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xl,
          fontSize: FONTS.sizes.md,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const getGradientColors = (): [string, string] => {
    if (disabled) {
      return ['#CCCCCC', '#AAAAAA'];
    }
    switch (variant) {
      case 'secondary':
        return [COLORS.secondary, COLORS.secondaryDark];
      case 'gold':
        return [COLORS.goldGradientStart, COLORS.goldGradientEnd];
      default:
        return [COLORS.gradientStart, COLORS.gradientEnd];
    }
  };

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        style={[
          styles.outlineButton,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
          },
          disabled && styles.disabledButton,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text
            style={[
              styles.outlineText,
              { fontSize: sizeStyles.fontSize },
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'outlineRed') {
    return (
      <TouchableOpacity
        style={[
          styles.outlineRedButton,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
          },
          disabled && styles.disabledButton,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primary} />
        ) : (
          <Text
            style={[
              styles.outlineRedText,
              { fontSize: sizeStyles.fontSize },
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={style}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[
          styles.gradientButton,
          {
            paddingVertical: sizeStyles.paddingVertical,
            paddingHorizontal: sizeStyles.paddingHorizontal,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.textWhite} />
        ) : (
          <Text
            style={[
              styles.gradientText,
              { fontSize: sizeStyles.fontSize },
              variant === 'gold' && styles.goldText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomButton;
