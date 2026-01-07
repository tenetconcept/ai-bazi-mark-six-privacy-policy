import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, Text } from 'react-native';
import { getColors } from '../constants/theme';
import { useApp } from '../context/AppContext';

interface RotatingLogoProps {
  size?: number;
  duration?: number;
}

export const RotatingLogo: React.FC<RotatingLogoProps> = ({ 
  size = 80, 
  duration = 8000 
}) => {
  const { isDarkMode } = useApp();
  const COLORS = getColors(isDarkMode);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoCircle: {
      backgroundColor: COLORS.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: COLORS.secondary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 10,
      elevation: 8,
    },
    logoText: {
      color: COLORS.primary,
      fontWeight: '900',
      textShadowColor: 'rgba(0,0,0,0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  });

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startRotation = () => {
      rotateAnim.setValue(0);
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startRotation();
  }, [rotateAnim, duration]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.logoCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ rotate }],
          },
        ]}
      >
        <Text style={[styles.logoText, { fontSize: size * 0.5 }]}>8</Text>
      </Animated.View>
    </View>
  );
};

export default RotatingLogo;
