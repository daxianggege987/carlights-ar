export const colors = {
  bg: '#0d1117',
  bgCard: '#161b22',
  bgCardHover: '#1c2333',
  bgHeader: '#010409',

  primary: '#58a6ff',
  primaryDark: '#1f6feb',

  severityRed: '#f85149',
  severityRedBg: 'rgba(248,81,73,0.12)',
  severityYellow: '#d29922',
  severityYellowBg: 'rgba(210,153,34,0.12)',
  severityGreen: '#3fb950',
  severityGreenBg: 'rgba(63,185,80,0.12)',

  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  textMuted: '#484f58',

  border: '#30363d',
  borderLight: '#21262d',

  white: '#ffffff',
  black: '#000000',

  categoryEngine: '#f97316',
  categoryBrakes: '#ef4444',
  categoryLights: '#eab308',
  categoryElectrical: '#3b82f6',
  categorySafety: '#a855f7',
  categoryTransmission: '#06b6d4',
  categoryFluids: '#14b8a6',
  categoryBody: '#8b5cf6',
  categoryClimate: '#0ea5e9',
  categoryOther: '#6b7280',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
};

export const categoryColorMap: Record<string, string> = {
  engine: colors.categoryEngine,
  brakes: colors.categoryBrakes,
  lights: colors.categoryLights,
  electrical: colors.categoryElectrical,
  safety: colors.categorySafety,
  transmission: colors.categoryTransmission,
  fluids: colors.categoryFluids,
  body: colors.categoryBody,
  climate: colors.categoryClimate,
  other: colors.categoryOther,
};

export const severityLabelAr: Record<string, string> = {
  red: '🔴 خطر — توقف فوراً',
  yellow: '🟡 تحذير — افحص قريباً',
  green: '🟢 معلومات — لا داعي للقلق',
};
