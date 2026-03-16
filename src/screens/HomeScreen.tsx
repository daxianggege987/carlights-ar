import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Category, Screen } from '../types';
import { colors, spacing, fontSize, radius } from '../theme';
import { categories } from '../data/categories';
import { warningLights } from '../data/warningLights';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import LightCard from '../components/LightCard';

interface Props {
  navigate: (screen: Screen) => void;
}

export default function HomeScreen({ navigate }: Props) {
  const [search, setSearch] = useState('');

  const filteredLights = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return warningLights.filter(
      (l) =>
        l.nameAr.includes(q) ||
        l.nameEn.toLowerCase().includes(q) ||
        l.descriptionAr.includes(q)
    );
  }, [search]);

  const isSearching = search.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appIcon}>🚗</Text>
          <Text style={styles.title}>أضواء السيارة</Text>
          <Text style={styles.subtitle}>
            اكتشف معنى أي ضوء تحذيري في لوحة القيادة
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            onClear={() => setSearch('')}
          />
        </View>

        {isSearching ? (
          /* Search Results */
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              نتائج البحث ({filteredLights.length})
            </Text>
            {filteredLights.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>لا توجد نتائج</Text>
                <Text style={styles.emptyHint}>
                  جرّب البحث بكلمة أخرى أو تصفح الأقسام
                </Text>
              </View>
            ) : (
              filteredLights.map((light) => (
                <LightCard
                  key={light.id}
                  light={light}
                  onPress={() => navigate({ name: 'detail', lightId: light.id })}
                />
              ))
            )}
          </View>
        ) : (
          <>
            {/* Quick Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{warningLights.length}</Text>
                <Text style={styles.statLabel}>ضوء تحذيري</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {warningLights.filter((l) => l.severity === 'red').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.severityRed }]}>
                  خطر
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {warningLights.filter((l) => l.severity === 'yellow').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.severityYellow }]}>
                  تحذير
                </Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {warningLights.filter((l) => l.severity === 'green').length}
                </Text>
                <Text style={[styles.statLabel, { color: colors.severityGreen }]}>
                  معلومات
                </Text>
              </View>
            </View>

            {/* Categories Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>تصفح حسب الفئة</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    onPress={(id) => navigate({ name: 'browse', category: id })}
                  />
                ))}
              </View>
            </View>

            {/* Danger Lights Quick Access */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ أضواء الخطر — توقف فوراً</Text>
              {warningLights
                .filter((l) => !l.canDrive)
                .map((light) => (
                  <LightCard
                    key={light.id}
                    light={light}
                    onPress={() =>
                      navigate({ name: 'detail', lightId: light.id })
                    }
                  />
                ))}
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            أضواء السيارة — دليلك لفهم لوحة القيادة
          </Text>
          <Text style={styles.footerVersion}>الإصدار 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  appIcon: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  statsRow: {
    flexDirection: 'row-reverse',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  categoryGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    marginHorizontal: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footerVersion: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
