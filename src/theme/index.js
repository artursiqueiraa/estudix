// ============================================================
//  ESTUDIX — Design Tokens
//  Extraídos do styles.css original do protótipo StudyFlow
// ============================================================

export const colors = {
  bg:           '#FBF6EC',
  bgCard:       '#FFFFFF',
  primary:      '#1E3A5F',
  accent:       '#C97B4A',
  success:      '#5B7F4F',
  successLight: '#7A9B6F',
  text:         '#2B2B2B',
  subtext:      '#8A8A8A',
  warmLight:    '#F0E4CC',
  warmMid:      '#EAD9B8',
  border:       'rgba(43, 43, 43, 0.08)',
  white:        '#FFFFFF',
  offWhite:     '#FDFAF3',
  danger:       '#D9534F',
  secondary:    '#8A6A2F',
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
  full: 9999,
  round: 9999,
};

// Sombras para iOS e Android (elevation)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 10,
  },
  primaryBtn: {
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
};

// Nomes de fonte carregadas via @expo-google-fonts
export const fontFamily = {
  serif:        'PlayfairDisplay_700Bold',
  serifRegular: 'PlayfairDisplay_400Regular',
  sans:         'Inter_400Regular',
  sansMedium:   'Inter_500Medium',
  sansSemi:     'Inter_600SemiBold',
  sansBold:     'Inter_700Bold',
};

// Tamanhos de fonte
export const fontSize = {
  xs:   9,
  sm:   11,
  base: 13,
  md:   14,
  lg:   15,
  xl:   18,
  h2:   22,
  h1:   30,
};

// Espaçamentos comuns
export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
};

export default { colors, radii, shadows, fontFamily, fontSize, spacing };
