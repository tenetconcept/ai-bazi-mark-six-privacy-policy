import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { getColors, BORDER_RADIUS, SPACING, FONTS } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface LotteryBallProps {
  number: number;
  isSpecial?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

const LotteryBall: React.FC<LotteryBallProps> = ({
  number,
  isSpecial = false,
  size = 'medium',
  style,
}) => {
  const { isDarkMode } = useApp();
  const COLORS = getColors(isDarkMode);

  // Mark Six official color classification (HKJC style)
  const getNumberColor = (num: number): string => {
    const redNumbers = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
    const blueNumbers = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];
    const greenNumbers = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49];

    if (redNumbers.includes(num)) {
      return '#E74C3C'; // HKJC Red
    } else if (blueNumbers.includes(num)) {
      return '#3498DB'; // HKJC Blue
    } else if (greenNumbers.includes(num)) {
      return '#27AE60'; // HKJC Green
    }
    return '#95A5A6'; // Fallback gray
  };

  const ballColor = isSpecial ? '#F39C12' : getNumberColor(number); // Gold for special

  const styles = StyleSheet.create({
    ball: {
      borderRadius: BORDER_RADIUS.round,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ballColor,
      borderWidth: 1.5,
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    number: {
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { width: 36, height: 36 },
          text: { fontSize: 14 },
        };
      case 'large':
        return {
          container: { width: 56, height: 56 },
          text: { fontSize: 22 },
        };
      default:
        return {
          container: { width: 46, height: 46 },
          text: { fontSize: 18 },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.ball,
        sizeStyles.container,
        style,
      ]}
    >
      <Text
        style={[
          styles.number,
          sizeStyles.text,
        ]}
      >
        {number.toString().padStart(2, '0')}
      </Text>
    </View>
  );
};

export default LotteryBall;
