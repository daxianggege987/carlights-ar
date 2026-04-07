import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Category, Screen, Severity } from '../types';
import { colors, spacing, fontSize, radius } from '../theme';
import { categories } from '../data/categories';
import { warningLights } from '../data/warningLights';
import LightCard from '../components/LightCard';
import SearchBar from '../components/SearchBar';
import BannerAdView from '../ads/BannerAdView';

type SeverityFilter = Severity | 'all';

interface Props {
  initialCategory?: Category;
  initialSeverity?: SeverityFilter;
  navigate: (screen: Screen) => void;
  goBack: () => void;
}

export default function BrowseScreen({
  initialCategory,
  initialSeverity,
  navigate,
  goBack,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>(
    initialCategory || 'all'
  );
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>(
    initialSeverity ?? 'all'
  );
  const [search, setSearch] = useState('');

  const poolForSeverity = useMemo(() => {
    if (activeCategory === 'all') return warningLights;
    return warningLights.filter((l) => l.category === activeCategory);
  }, [activeCategory]);

  const severityCounts = useMemo(() => {
    const red = poolForSeverity.filter((l) => l.severity === 'red').length;
    const yellow = poolForSeverity.filter((l) => l.severity === 'yellow').length;
    const green = poolForSeverity.filter((l) => l.severity === 'green').length;
    return { all: poolForSeverity.length, red, yellow, green };
  }, [poolForSeverity]);

  const filteredLights = useMemo(() => {
    let result = warningLights;
    if (activeCategory !== 'all') {
      result = result.filter((l) => l.category === activeCategory);
    }
    if (severityFilter !== 'all') {
      result = result.filter((l) => l.severity === severityFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.nameAr.includes(q) ||
          l.nameEn.toLowerCase().includes(q) ||
          l.descriptionAr.includes(q)
      );
    }
    return result;
  }, [activeCategory, severityFilter, search]);

  const activeCatInfo = categories.find((c) => c.id === activeCategory);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeCategory === 'all'
            ? 'جميع الأضواء'
            : activeCatInfo?.icon + ' ' + (activeCatInfo?.nameAr || '')}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          onClear={() => setSearch('')}
          placeholder="ابحث في هذا القسم..."
        />
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
        style={styles.chipsScroll}
      >
        <TouchableOpacity
          style={[styles.chip, activeCategory === 'all' && styles.chipActive]}
          onPress={() => setActiveCategory('all')}
        >
          <Text
            style={[
              styles.chipText,
              activeCategory === 'all' && styles.chipTextActive,
            ]}
          >
            الكل ({warningLights.length})
          </Text>
        </TouchableOpacity>
        {categories.map((cat) => {
          const count = warningLights.filter((l) => l.category === cat.id).length;
          if (count === 0) return null;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                activeCategory === cat.id && styles.chipActive,
                activeCategory === cat.id && { borderColor: cat.color },
              ]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeCategory === cat.id && styles.chipTextActive,
                ]}
              >
                {cat.icon} {cat.nameAr} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Severity chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.severityChipsContainer}
        style={styles.severityChipsScroll}
      >
        {(
          [
            { key: 'all' as const, label: 'الكل', count: severityCounts.all },
            { key: 'red' as const, label: '🔴 خطر', count: severityCounts.red },
            {
              key: 'yellow' as const,
              label: '🟡 تحذير',
              count: severityCounts.yellow,
            },
            {
              key: 'green' as const,
              label: '🟢 معلومات',
              count: severityCounts.green,
            },
          ] as const
        ).map(({ key, label, count }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.severityChip,
              severityFilter === key && styles.severityChipActive,
              key === 'red' && severityFilter === key && styles.severityChipRed,
              key === 'yellow' &&
                severityFilter === key &&
                styles.severityChipYellow,
              key === 'green' &&
                severityFilter === key &&
                styles.severityChipGreen,
            ]}
            onPress={() => setSeverityFilter(key)}
          >
            <Text
              style={[
                styles.severityChipText,
                severityFilter === key && styles.severityChipTextActive,
              ]}
            >
              {label} ({count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
      >
        <Text style={styles.resultCount}>
          {filteredLights.length} نتيجة
        </Text>
        {filteredLights.map((light) => (
          <LightCard
            key={light.id}
            light={light}
            onPress={() => navigate({ name: 'detail', lightId: light.id })}
          />
        ))}
        {filteredLights.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>لا توجد نتائج في هذا القسم</Text>
          </View>
        )}
      </ScrollView>
      <BannerAdView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  backBtn: {
    padding: spacing.sm,
  },
  backText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  chipsScroll: {
    maxHeight: 48,
    marginBottom: spacing.sm,
  },
  severityChipsScroll: {
    maxHeight: 44,
    marginBottom: spacing.md,
  },
  severityChipsContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    flexDirection: 'row-reverse',
  },
  severityChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  severityChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryDark + '30',
  },
  severityChipRed: {
    borderColor: colors.severityRed,
  },
  severityChipYellow: {
    borderColor: colors.severityYellow,
  },
  severityChipGreen: {
    borderColor: colors.severityGreen,
  },
  severityChipText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  severityChipTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  chipsContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    flexDirection: 'row-reverse',
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  chipActive: {
    backgroundColor: colors.primaryDark + '30',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
  },
  resultCount: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
});
