import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CategoryInfo, Category } from '../types';
import { warningLights } from '../data/warningLights';
import { colors, radius, spacing, fontSize } from '../theme';

interface Props {
  category: CategoryInfo;
  onPress: (id: Category) => void;
}

export default function CategoryCard({ category, onPress }: Props) {
  const count = warningLights.filter((l) => l.category === category.id).length;

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: category.color + '30' }]}
      onPress={() => onPress(category.id)}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={styles.name}>{category.nameAr}</Text>
      <Text style={styles.count}>{count}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  count: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
});
