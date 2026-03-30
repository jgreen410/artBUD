import type { VideoSource } from 'expo-video';

export interface AuthShowcaseItem {
  id: string;
  title: string;
  kicker: string;
  teaser: string;
  prompt: string;
  placeholderColor: string;
  source: VideoSource;
}

const toVideoSource = (value: string | undefined, fallbackAsset: number): VideoSource => {
  const normalized = value?.trim();
  return normalized ? normalized : fallbackAsset;
};

// Local assets are the default. `.env` URLs can override them if you want to swap clips later.
export const authShowcaseItems: AuthShowcaseItem[] = [
  {
    id: 'solo-charcoal',
    title: 'Studio Charcoal',
    kicker: 'One Artist',
    teaser: 'A quiet, hands-on moment with paper, charcoal dust, and close-up mark making.',
    prompt:
      'Cinematic vertical video of one artist creating a large charcoal portrait in a warm studio, close-up hands shading on textured paper, charcoal dust in the light, messy apron, intentional slow movements, earthy color palette, shallow depth of field, premium art documentary style.',
    placeholderColor: '#6B5A49',
    source: toVideoSource(
      process.env.EXPO_PUBLIC_AUTH_VIDEO_SOLO_CHARCOAL_URL,
      require('../assets/videos/1.mp4'),
    ),
  },
  {
    id: 'midnight-digital',
    title: 'Midnight Digital',
    kicker: 'One Artist',
    teaser: 'Tablet glow, layered brushwork, and a digital illustration coming together at night.',
    prompt:
      'Vertical cinematic video of a single digital artist painting an illustration on a tablet at night, moody studio lighting, screen reflections on hands and face, stylus strokes visible, layered interface glimpses without readable UI, creative focus, rich ochre and terracotta accents, polished modern art-tech aesthetic.',
    placeholderColor: '#4C4036',
    source: toVideoSource(
      process.env.EXPO_PUBLIC_AUTH_VIDEO_MIDNIGHT_DIGITAL_URL,
      require('../assets/videos/2.mp4'),
    ),
  },
  {
    id: 'funny-mural-duo',
    title: 'Laughing Mural Duo',
    kicker: 'Funny Couple',
    teaser: 'Two artists mid-project, a paint mishap, and a genuinely funny collaborative moment.',
    prompt:
      'Vertical cinematic video of two artists painting a colorful indoor mural together, one accidentally flicks paint onto both of them, they stop and laugh, playful chemistry, brushes and paint trays everywhere, joyful creative chaos, still stylish and beautiful, natural movement, handcrafted art studio energy.',
    placeholderColor: '#7A4F3D',
    source: toVideoSource(
      process.env.EXPO_PUBLIC_AUTH_VIDEO_FUNNY_MURAL_DUO_URL,
      require('../assets/videos/3.mp4'),
    ),
  },
  {
    id: 'plein-air',
    title: 'Plein-Air Light',
    kicker: 'Outside',
    teaser: 'An artist painting outdoors with wind, sunlight, and a portable watercolor setup.',
    prompt:
      'Vertical cinematic video of one artist outside painting a watercolor landscape on location, breezy hillside or riverside setting, travel easel, wind moving paper and clothing, sunlight shifting across paint palette, calm observational mood, natural environment sounds implied, elegant plein-air documentary style.',
    placeholderColor: '#556452',
    source: toVideoSource(
      process.env.EXPO_PUBLIC_AUTH_VIDEO_PLEIN_AIR_URL,
      require('../assets/videos/4.mp4'),
    ),
  },
];
