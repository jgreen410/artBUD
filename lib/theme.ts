import { Platform, TextStyle, ViewStyle } from 'react-native';

const withOpacity = (hex: string, opacity: number) => {
  const normalized = hex.replace('#', '');

  if (normalized.length !== 6) {
    return hex;
  }

  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0');

  return `#${normalized}${alpha}`;
};

const fontFamily = {
  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
  display: 'ArtBudDisplay',
  editorial: 'ArtBudEditorial',
  script: 'ArtBudScript',
} as const;

export const theme = {
  colors: {
    background: {
      base: '#F2EDE6',
      canvas: '#F2EDE6',
      surface: '#F5EDE0',
      elevated: '#ECDDCA',
    },
    text: {
      primary: '#2A1F14',
      secondary: '#5C4A3A',
      tertiary: '#8B7764',
      inverse: '#F5EDE0',
    },
    action: {
      primary: '#C8852A',
      primaryPressed: '#B57622',
      secondary: '#C4573A',
      secondaryPressed: '#AF4B31',
    },
    accent: {
      sage: '#7A8B6F',
      dustyRose: '#C08B7E',
      clay: '#D8B18A',
      charcoal: '#6B5A49',
    },
    border: {
      subtle: withOpacity('#B8A48E', 0.3),
      strong: '#B8A48E',
    },
    state: {
      success: '#7A8B6F',
      warning: '#C8852A',
      danger: '#C4573A',
      muted: '#DDD0C2',
    },
    overlay: {
      warm: 'rgba(42, 31, 20, 0.22)',
      strong: 'rgba(42, 31, 20, 0.48)',
    },
  },
  spacing: {
    px: 1,
    1: 8,
    2: 16,
    3: 24,
    4: 32,
    5: 40,
    6: 48,
    7: 56,
    8: 64,
  },
  radius: {
    xs: 8,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    pill: 999,
    round: 999,
  },
  typography: {
    fontFamily,
    size: {
      hero: 44,
      screenTitle: 28,
      sectionTitle: 20,
      cardTitle: 18,
      body: 16,
      caption: 14,
      meta: 12,
    },
    lineHeight: {
      hero: 48,
      screenTitle: 34,
      sectionTitle: 26,
      cardTitle: 24,
      body: 24,
      caption: 20,
      meta: 16,
    },
    letterSpacing: {
      tight: -0.4,
      normal: 0,
      wide: 0.3,
      caps: 0.8,
    },
  },
  shadow: {
    card: Platform.select<ViewStyle>({
      ios: {
        shadowColor: '#2A1F14',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: '#2A1F14',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
    }),
  },
} as const;

export const textStyles = {
  hero: {
    fontFamily: fontFamily.script,
    fontSize: theme.typography.size.hero,
    lineHeight: theme.typography.lineHeight.hero,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
  screenTitle: {
    fontFamily: fontFamily.display,
    fontSize: theme.typography.size.screenTitle,
    lineHeight: theme.typography.lineHeight.screenTitle,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
  sectionTitle: {
    fontFamily: fontFamily.display,
    fontSize: theme.typography.size.sectionTitle,
    lineHeight: theme.typography.lineHeight.sectionTitle,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
  editorial: {
    fontFamily: fontFamily.editorial,
    fontSize: 22,
    lineHeight: 28,
    color: theme.colors.text.secondary,
  } satisfies TextStyle,
  body: {
    fontFamily: fontFamily.body,
    fontSize: theme.typography.size.body,
    lineHeight: theme.typography.lineHeight.body,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
  bodyMedium: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: theme.typography.size.body,
    lineHeight: theme.typography.lineHeight.body,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
  bodyBold: {
    fontFamily: fontFamily.bodyBold,
    fontSize: theme.typography.size.body,
    lineHeight: theme.typography.lineHeight.body,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
  caption: {
    fontFamily: fontFamily.body,
    fontSize: theme.typography.size.caption,
    lineHeight: theme.typography.lineHeight.caption,
    color: theme.colors.text.secondary,
  } satisfies TextStyle,
  meta: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: theme.typography.size.meta,
    lineHeight: theme.typography.lineHeight.meta,
    letterSpacing: theme.typography.letterSpacing.caps,
    textTransform: 'uppercase',
    color: theme.colors.text.tertiary,
  } satisfies TextStyle,
  chip: {
    fontFamily: fontFamily.editorial,
    fontSize: 15,
    lineHeight: 18,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
  buttonLabel: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
  input: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    lineHeight: 22,
    color: theme.colors.text.primary,
  } satisfies TextStyle,
} as const;

export const layout = {
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background.base,
  } satisfies ViewStyle,
  content: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[3],
  } satisfies ViewStyle,
  card: {
    backgroundColor: theme.colors.background.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    padding: theme.spacing[2],
    ...theme.shadow.card,
  } satisfies ViewStyle,
  pill: {
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border.subtle,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: theme.colors.background.base,
  } satisfies ViewStyle,
} as const;

export type AppTheme = typeof theme;
