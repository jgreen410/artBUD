import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const artBudFontMap = {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} as const;

const optionalArtBudFontMap = {
  ArtBudDisplay: require('@/assets/fonts/ArtBud-BorderWall.otf'),
  ArtBudEditorial: require('@/assets/fonts/ArtBud-Frenchpress.otf'),
  ArtBudScript: require('@/assets/fonts/ArtBud-MortalHeartImmortalMemory.ttf'),
} as const;

export function useArtBudFonts() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFonts = async () => {
      try {
        await Font.loadAsync(artBudFontMap);

        const optionalFontLoads = Object.entries(optionalArtBudFontMap).map(
          async ([fontFamily, source]) => {
            try {
              await Font.loadAsync(fontFamily, source);
            } catch (error) {
              console.warn(`Optional font "${fontFamily}" failed to load. Falling back to system rendering.`, error);
            }
          },
        );

        await Promise.all(optionalFontLoads);
      } catch (error) {
        console.error('Required app fonts failed to load.', error);
      } finally {
        if (isMounted) {
          setLoaded(true);
        }
      }
    };

    void loadFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  return [loaded] as const;
}
