import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { theme } from '@/lib/theme';

interface HandwrittenWordmarkProps {
  style?: StyleProp<ViewStyle>;
}

export function HandwrittenWordmark({ style }: HandwrittenWordmarkProps) {
  const artProgress = useRef(new Animated.Value(0)).current;
  const cursorOpacity = useRef(new Animated.Value(0)).current;
  const budOpacity = useRef(new Animated.Value(0)).current;
  const budTranslate = useRef(new Animated.Value(8)).current;
  const [artWidth, setArtWidth] = useState(0);

  useEffect(() => {
    if (!artWidth) {
      return;
    }

    artProgress.setValue(0);
    cursorOpacity.setValue(0);
    budOpacity.setValue(0);
    budTranslate.setValue(8);

    Animated.sequence([
      Animated.delay(180),
      Animated.parallel([
        Animated.timing(artProgress, {
          duration: 2100,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            duration: 100,
            toValue: 1,
            useNativeDriver: false,
          }),
          Animated.delay(1550),
          Animated.timing(cursorOpacity, {
            duration: 220,
            toValue: 0,
            useNativeDriver: false,
          }),
        ]),
      ]),
      Animated.parallel([
        Animated.timing(budOpacity, {
          duration: 260,
          easing: Easing.out(Easing.quad),
          toValue: 1,
          useNativeDriver: false,
        }),
        Animated.timing(budTranslate, {
          duration: 260,
          easing: Easing.out(Easing.quad),
          toValue: 0,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  }, [artProgress, artWidth, budOpacity, budTranslate, cursorOpacity]);

  const revealWidth = useMemo(
    () =>
      artProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, artWidth || 1],
      }),
    [artProgress, artWidth],
  );

  const cursorTranslate = useMemo(
    () =>
      artProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, Math.max(artWidth - 8, 0)],
      }),
    [artProgress, artWidth],
  );

  return (
    <View style={style}>
      <View onLayout={(event) => setArtWidth(event.nativeEvent.layout.width)} style={styles.measureWrap}>
        <Text style={styles.artText}>ART</Text>
      </View>

      {artWidth ? (
        <View style={styles.wordmarkRow}>
          <View style={styles.artFrame}>
            <Text style={styles.artShadow}>ART</Text>
            <Animated.View style={[styles.artRevealMask, { width: revealWidth }]}>
              <Text style={styles.artText}>ART</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.cursor,
                {
                  opacity: cursorOpacity,
                  transform: [{ translateX: cursorTranslate }],
                },
              ]}
            />
          </View>
          <Animated.Text
            style={[
              styles.budText,
              {
                opacity: budOpacity,
                transform: [{ translateY: budTranslate }],
              },
            ]}
          >
            bud
          </Animated.Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  measureWrap: {
    alignSelf: 'flex-start',
    opacity: 0,
    position: 'absolute',
  },
  wordmarkRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    minHeight: 84,
    overflow: 'visible',
    paddingBottom: 4,
    paddingTop: 8,
  },
  artFrame: {
    minHeight: 72,
    minWidth: 124,
    overflow: 'visible',
    position: 'relative',
  },
  artText: {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.script,
    fontSize: 56,
    lineHeight: 64,
  },
  artShadow: {
    color: 'rgba(42, 31, 20, 0.12)',
    fontFamily: theme.typography.fontFamily.script,
    fontSize: 56,
    left: 0,
    lineHeight: 64,
    position: 'absolute',
    top: 0,
  },
  artRevealMask: {
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
  },
  budText: {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.display,
    fontSize: 42,
    lineHeight: 42,
    marginBottom: 8,
  },
  cursor: {
    backgroundColor: theme.colors.action.secondary,
    borderRadius: 999,
    bottom: 14,
    height: 8,
    position: 'absolute',
    width: 8,
  },
});
