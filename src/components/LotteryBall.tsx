import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

  // Generate gradient colors based on base color
  const getGradientColors = (baseColor: string): [string, string] => {
    // Simple logic to make a lighter version for the top-left highlight
    return [baseColor, baseColor]; // For now just solid but ready for gradient logic if needed, 
    // actually let's do a proper 3D effect
  };
  
  // Hardcoded gradient pairs for 3D effect
  const getBallGradient = (num: number): [string, string] => {
    const redNumbers = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46];
    const blueNumbers = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48];
    const greenNumbers = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49];

    if (isSpecial) return ['#F1C40F', '#D35400']; // Gold Gradient
    if (redNumbers.includes(num)) return ['#FF7675', '#C0392B']; // Lighter Red -> Dark Red
    if (blueNumbers.includes(num)) return ['#74B9FF', '#2980B9']; // Lighter Blue -> Dark Blue
    if (greenNumbers.includes(num)) return ['#55EFC4', '#009432']; // Lighter Green -> Dark Green
    return ['#BDC3C7', '#7F8C8D']; // Gray Gradient
  }

  const styles = StyleSheet.create({
    ball: {
      borderRadius: BORDER_RADIUS.round,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: ballColor, // Removed, using gradient
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      overflow: 'hidden',
      
      // Shadow for 3D effect
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 2,
      elevation: 4,
    },
    gradient: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    number: {
      fontWeight: 'bold',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.4)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    highlight: {
      position: 'absolute',
      top: '15%',
      left: '20%',
      width: '30%',
      height: '30%',
      borderRadius: 100,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      transform: [{ rotate: '-45deg' }],
    },
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'small': return { width: 28, height: 28, fontSize: 12 };
      case 'large': return { width: 44, height: 44, fontSize: 20 };
      default: return { width: 36, height: 36, fontSize: 16 };
    }
  };

  const { width, height, fontSize } = getSizeStyles();

  return (
    <View style={[styles.ball, { width, height }, style]}>
      <LinearGradient
        colors={getBallGradient(number)}
        style={styles.gradient}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
      >
        <View style={styles.highlight} />
        <Text style={[styles.number, { fontSize }]}>
          {number}
        </Text>
      </LinearGradient>
    </View>
  );
};

export default LotteryBall;
