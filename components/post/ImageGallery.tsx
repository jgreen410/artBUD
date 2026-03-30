import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { theme } from '@/lib/theme';

const DEFAULT_BLURHASH = '|rF?hV%2WCj[ayj[jt7j[ayj[ayj[ayj[ayj[ayfQfQfQfQfQfQ';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const galleryImages = useMemo(() => (images.length > 0 ? images : [null]), [images]);
  const galleryHeight = Math.min(width * 1.08, 500);

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(Math.max(0, Math.min(nextIndex, galleryImages.length - 1)));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        decelerationRate="fast"
        horizontal
        onMomentumScrollEnd={handleMomentumEnd}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {galleryImages.map((uri, index) => (
          <View
            key={uri ?? `fallback-${index}`}
            style={[
              styles.slide,
              {
                width,
                height: galleryHeight,
              },
            ]}
          >
            {uri ? (
              <Image
                accessibilityLabel={`${title} image ${index + 1}`}
                cachePolicy="memory-disk"
                contentFit="contain"
                placeholder={{ blurhash: DEFAULT_BLURHASH }}
                source={uri}
                style={styles.image}
                transition={180}
              />
            ) : (
              <View style={styles.fallback}>
                <Text style={styles.fallbackCopy}>Artwork gallery</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {images.length > 1 ? (
        <>
          <View style={styles.counter}>
            <Text style={styles.counterCopy}>
              {activeIndex + 1} / {images.length}
            </Text>
          </View>
          <View style={styles.dots}>
            {images.map((image, index) => (
              <View
                key={`${image}-${index}`}
                style={[styles.dot, index === activeIndex && styles.dotActive]}
              />
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.surface,
    position: 'relative',
  },
  slide: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.surface,
    justifyContent: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  fallback: {
    alignItems: 'center',
    backgroundColor: theme.colors.background.elevated,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  fallbackCopy: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.editorial,
    fontSize: 22,
  },
  counter: {
    backgroundColor: theme.colors.overlay.strong,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    right: theme.spacing[2],
    top: theme.spacing[3],
  },
  counterCopy: {
    color: theme.colors.text.inverse,
    fontFamily: theme.typography.fontFamily.bodyBold,
    fontSize: theme.typography.size.caption,
  },
  dots: {
    alignItems: 'center',
    bottom: theme.spacing[2],
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  dot: {
    backgroundColor: 'rgba(245, 237, 224, 0.55)',
    borderRadius: theme.radius.round,
    height: 8,
    width: 8,
  },
  dotActive: {
    backgroundColor: theme.colors.text.inverse,
    width: 18,
  },
});
