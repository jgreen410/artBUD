import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

import { authShowcaseItems } from '@/lib/authShowcase';

const ROTATION_MS = 5600;

interface AuthVideoHeroProps {
  onIndexChange?: (index: number) => void;
}

export function AuthVideoHero({ onIndexChange }: AuthVideoHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const layerOpacities = useRef(
    authShowcaseItems.map((_, index) => new Animated.Value(index === 0 ? 1 : 0)),
  ).current;

  useEffect(() => {
    if (authShowcaseItems.length < 2) {
      return () => undefined;
    }

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % authShowcaseItems.length);
    }, ROTATION_MS);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    onIndexChange?.(activeIndex);

    Animated.parallel(
      layerOpacities.map((opacity, index) =>
        Animated.timing(opacity, {
          duration: 520,
          toValue: index === activeIndex ? 1 : 0,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [activeIndex, layerOpacities, onIndexChange]);

  return (
    <View style={styles.shell}>
      {authShowcaseItems.map((item, index) => (
        <Animated.View
          key={item.id}
          pointerEvents="none"
          style={[styles.mediaLayer, { opacity: layerOpacities[index] }]}
        >
          <HeroMedia item={item} />
        </Animated.View>
      ))}

      <View style={styles.overlay} />
    </View>
  );
}

function HeroMedia({ item }: { item: (typeof authShowcaseItems)[number] }) {
  const player = useVideoPlayer(item.source, (instance) => {
    instance.loop = true;
    instance.muted = true;

    if (item.source) {
      instance.play();
    }
  });

  if (item.source) {
    return (
      <VideoView
        allowsFullscreen={false}
        contentFit="cover"
        nativeControls={false}
        player={player}
        style={styles.video}
      />
    );
  }

  return (
    <View style={[styles.placeholder, { backgroundColor: item.placeholderColor }]}>
      <View style={styles.placeholderOrbPrimary} />
      <View style={styles.placeholderOrbSecondary} />
      <View style={styles.placeholderBrushStroke} />
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#18120D',
    overflow: 'hidden',
  },
  mediaLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    height: '100%',
    width: '100%',
  },
  placeholder: {
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  placeholderOrbPrimary: {
    backgroundColor: 'rgba(245, 237, 224, 0.14)',
    borderRadius: 999,
    height: 180,
    position: 'absolute',
    right: -28,
    top: -16,
    width: 180,
  },
  placeholderOrbSecondary: {
    backgroundColor: 'rgba(245, 237, 224, 0.12)',
    borderRadius: 999,
    bottom: -46,
    height: 160,
    left: -22,
    position: 'absolute',
    width: 160,
  },
  placeholderBrushStroke: {
    backgroundColor: 'rgba(245, 237, 224, 0.18)',
    borderRadius: 999,
    height: 18,
    left: 28,
    position: 'absolute',
    top: 110,
    transform: [{ rotate: '-18deg' }],
    width: 220,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 18, 13, 0.38)',
  },
});
