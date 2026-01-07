import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getColors, SPACING, BORDER_RADIUS, SHADOWS, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'gradient' | 'gold';
  style?: ViewStyle;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  variant = 'default',
  style,
}) => {
  const { isDarkMode } = useApp();
  const COLORS = getColors(isDarkMode);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.backgroundCard,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      ...SHADOWS.medium,
    },
    gradientCard: {
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      ...SHADOWS.medium,
    },
    title: {
      fontSize: FONTS.sizes.lg,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      marginBottom: SPACING.md,
    },
    gradientTitle: {
      fontSize: FONTS.sizes.lg,
      fontWeight: 'bold',
      color: COLORS.textWhite,
      marginBottom: SPACING.md,
    },
    goldTitle: {
      fontSize: FONTS.sizes.lg,
      fontWeight: 'bold',
      color: COLORS.textPrimary,
      marginBottom: SPACING.md,
    },
  });

  if (variant === 'gradient') {
    return (
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientCard, style]}
      >
        {title && <Text style={styles.gradientTitle}>{title}</Text>}
        {children}
      </LinearGradient>
    );
  }

  if (variant === 'gold') {
    return (
      <LinearGradient
        colors={[COLORS.goldGradientStart, COLORS.goldGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradientCard, style]}
      >
        {title && <Text style={styles.goldTitle}>{title}</Text>}
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
};

export default Card;
