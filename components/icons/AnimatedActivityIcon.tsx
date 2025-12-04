import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import Icon from './Icon';

export default function AnimatedActivityIcon({ size = 20, color }: { size?: number; color?: string }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Icon name="refresh" size={size} color={color} />
    </Animated.View>
  );
}
