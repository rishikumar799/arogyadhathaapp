import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

export function FloatingBlob({ size = 260, color = "#13c84a", opacity = 0.25 }) {
  const move = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(move, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(move, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = move.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 10],
  });

  const translateX = move.interpolate({
    inputRange: [0, 1],
    outputRange: [6, -6],
  });

  return (
    <Animated.View
      style={{
        position: "absolute",
        opacity,
        transform: [{ translateY }, { translateX }],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Path
          fill={color}
          d="M46,-41.5C60.7,-31.3,74.4,-15.6,73.8,-0.7C73.1,14.3,58.1,28.7,43.4,39.1C28.7,49.5,14.3,56,-0.4,56.5C-15.2,56.9,-30.5,51.3,-41.9,40.9C-53.4,30.5,-61.2,15.2,-64.3,-3.1C-67.4,-21.5,-65.9,-42.9,-54.4,-53.1C-42.9,-63.3,-21.5,-62.2,-2.9,-59.3C15.6,-56.4,31.3,-51.7,46,-41.5Z"
          transform="translate(100 100)"
        />
      </Svg>
    </Animated.View>
  );
}
