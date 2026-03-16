import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors, radius, spacing, fontSize } from '../theme';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, onClear, placeholder }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'ابحث عن ضوء تحذيري...'}
        placeholderTextColor={colors.textMuted}
        textAlign="right"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
      <View style={styles.searchIcon}>
        <Text style={styles.searchEmoji}>🔍</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
  },
  searchIcon: {
    marginLeft: spacing.sm,
  },
  searchEmoji: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    paddingVertical: 0,
    writingDirection: 'rtl',
  },
  clearBtn: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  clearText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
