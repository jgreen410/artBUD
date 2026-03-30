import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { useFonts } from 'expo-font';

export const artBudFontMap = {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  ArtBudDisplay: require('@/assets/fonts/ArtBud-BorderWall.otf'),
  ArtBudEditorial: require('@/assets/fonts/ArtBud-Frenchpress.otf'),
  ArtBudScript: require('@/assets/fonts/ArtBud-MortalHeartImmortalMemory.ttf'),
} as const;

export function useArtBudFonts() {
  return useFonts(artBudFontMap);
}
