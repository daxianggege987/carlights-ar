import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WarningLight } from '../types';
import { colors, radius, spacing, fontSize, categoryColorMap } from '../theme';
import SeverityBadge from './SeverityBadge';

interface Props {
  light: WarningLight;
  onPress: () => void;
}

export default function LightCard({ light, onPress }: Props) {
  const catColor = categoryColorMap[light.category] || colors.textMuted;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{light.icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {light.nameAr}
        </Text>
        <Text style={styles.nameEn} numberOfLines={1}>
          {light.nameEn}
        </Text>
      </View>
      <View style={styles.trailing}>
        <SeverityBadge severity={light.severity} />
        {!light.canDrive && (
          <Text style={styles.stopDriving}>⛔ توقف</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.bgCardHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    marginRight: spacing.md,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
  },
  nameEn: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'right',
  },
  trailing: {
    alignItems: 'flex-start',
    marginLeft: spacing.md,
    gap: spacing.xs,
  },
  stopDriving: {
    fontSize: fontSize.xs,
    color: colors.severityRed,
    fontWeight: '700',
  },
});
