import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  cancelAnimation,
  withSequence,
} from 'react-native-reanimated';

interface AnimatedBannerProps {
  children: React.ReactNode;
  style?: any;
  colors: string[];
}

const NUM_PARTICLES = 12;

// Individual Particle Component for better performance
const Particle = ({ index }: { index: number }) => {
  // Randomize initial properties
  const randomX = React.useMemo(() => Math.random() * 100, []); // % position
  const randomSize = React.useMemo(() => Math.random() * 6 + 2, []); // size 2-8
  const randomDuration = React.useMemo(() => Math.random() * 3000 + 4000, []); // 4-7s duration
  const randomDelay = React.useMemo(() => Math.random() * 2000, []); // 0-2s delay
  const randomOpacity = React.useMemo(() => Math.random() * 0.3 + 0.1, []); // 0.1-0.4 opacity

  const translateY = useSharedValue(100); // Start below the visible area (percentage)
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Reset position
    translateY.value = 100;
    opacity.value = 0;

    // Start Animation Loop
    translateY.value = withDelay(
      randomDelay,
      withRepeat(
        withTiming(-20, { // Move up to -20% (off top)
          duration: randomDuration,
          easing: Easing.linear,
        }),
        -1, // Infinite loop
        false
      )
    );

    opacity.value = withDelay(
      randomDelay,
      withRepeat(
        withSequence(
          withTiming(randomOpacity, { duration: randomDuration * 0.2 }), // Fade in
          withTiming(randomOpacity, { duration: randomDuration * 0.5 }), // Stay visible
          withTiming(0, { duration: randomDuration * 0.3 }) // Fade out at top
        ),
        -1,
        false
      )
    );

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(opacity);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: `${translateY.value}%`,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: `${randomX}%`,
          width: randomSize,
          height: randomSize,
          borderRadius: randomSize / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const AnimatedBanner: React.FC<AnimatedBannerProps> = ({ children, style, colors }) => {
  // Clean style from padding/margin/shadow/elevation/borderRadius for the container wrapper
  // We want to apply those to the inner/outer layout correctly to match the original
  // BUT: The original LinearGradient had styles like padding and border radius.
  // We need to apply the BACKGROUND gradient to fill the container, and applying style to the wrapper is cleanest.
  
  // Extract border styles to apply to the wrapper view to maintain round corners clipping
  const { borderBottomLeftRadius, borderBottomRightRadius, borderRadius, borderBottomWidth, borderBottomColor } = style || {};

  return (
    <View style={[style, { overflow: 'hidden', padding: 0 }]}> 
      {/* Background Layer */}
      <View style={StyleSheet.absoluteFill}>
         <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      </View>

      {/* Particle Layer - Renders multiple particles */}
      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </View>

      {/* Content Layer - We need to apply the padding here that was on the original LinearGradient */}
      {/* And reset the background color so we see through to the particles */}
      <View style={[style, { 
        backgroundColor: 'transparent', 
        margin: 0, 
        marginTop: 0, 
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        // Remove fixed width/height so it grows with content
        minHeight: style?.minHeight || undefined,
        shadowColor: 'transparent', 
        elevation: 0,
        borderBottomWidth: 0, // Avoid double border
        borderRadius: 0, // Avoid double radius
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        position: 'relative'
      }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    backgroundColor: '#FFD700', // Gold particles
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  banner: {
    overflow: 'hidden', // Important to contain the shimmer effect
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '-50%', // Start from off-screen to the left
    height: '100%',
  },
});

export default AnimatedBanner;
