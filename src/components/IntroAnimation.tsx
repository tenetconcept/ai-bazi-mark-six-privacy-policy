import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Import the separated layer images
// Layer A: Outer Ring (Rotating)
// Layer B: Inner Content (Static)
const layerA = require('../../assets/layer_image/layer_a.png');
const layerB = require('../../assets/layer_image/layer_b.png');

// Background colors
const RED_DEEP = '#24060E';
const RED_VIBRANT = '#B01838';

type Props = {
  visible: boolean;
};

const IntroAnimation: React.FC<Props> = ({ visible }) => {
  const opacity = useSharedValue(1); // Start fully visible
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Hide native splash screen immediately when our animation is ready
      SplashScreen.hideAsync();
      
      // Start rotation animation for the outer ring (layer A)
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 4000, // 4 seconds per rotation - faster to be noticeable
          easing: Easing.linear,
        }),
        -1, // Infinite
        false
      );

      // Already visible (opacity = 1), just auto fade out after showing
      setTimeout(() => {
        opacity.value = withTiming(0, {
          duration: 500,
          easing: Easing.in(Easing.cubic),
        });
      }, 2000); 
    } else {
      opacity.value = 0;
      rotation.value = 0;
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  // Rotating style for inner disc
  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, containerStyle]} pointerEvents="none">
      <LinearGradient
        colors={[RED_DEEP, RED_VIBRANT]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.logoContainer}>
        {/* Layer A: Outer Ring (Rotating) */}
        <Animated.Image 
          source={layerA} 
          style={[styles.layerLarge, rotatingStyle]} 
          resizeMode="contain"
        />
        
        {/* Layer B: Inner Content (Static) */}
        <Image  
          source={layerB} 
          style={styles.layerLarge} 
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logoContainer: {
    width: 240,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
  },
  layer: {
    position: 'absolute',
    width: 240,
    height: 240,
  },
  layerLarge: {
    position: 'absolute',
    width: 320, // Increased size for Layer B
    height: 320,
    top: -40, // Centering: (240 - 320) / 2
    left: -40,
  },
});

export default IntroAnimation;
