import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Severity } from '../types';
import { colors, radius, spacing, fontSize } from '../theme';

const config: Record<Severity, { bg: string; color: string; label: string }> = {
  red: { bg: colors.severityRedBg, color: colors.severityRed, label: 'خطر' },
  yellow: { bg: colors.severityYellowBg, color: colors.severityYellow, label: 'تحذير' },
  green: { bg: colors.severityGreenBg, color: colors.severityGreen, label: 'معلومات' },
};

interface Props {
  severity: Severity;
  large?: boolean;
}

export default function SeverityBadge({ severity, large }: Props) {
  const c = config[severity];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }, large && styles.badgeLarge]}>
      <View style={[styles.dot, { backgroundColor: c.color }]} />
      <Text style={[styles.label, { color: c.color }, large && styles.labelLarge]}>
        {c.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  badgeLarge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
  labelLarge: {
    fontSize: fontSize.md,
  },
});
