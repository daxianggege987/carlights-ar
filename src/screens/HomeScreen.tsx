import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Category, Screen } from '../types';
import { colors, spacing, fontSize, radius } from '../theme';
import { categories } from '../data/categories';
import { warningLights } from '../data/warningLights';
import SearchBar from '../components/SearchBar';
import CategoryCard from '../components/CategoryCard';
import LightCard from '../components/LightCard';
import { getFavoriteIds, getRecentIds } from '../storage/userLists';

interface Props {
  navigate: (screen: Screen) => void;
}

const APP_VERSION = '1.0.3';

export default function HomeScreen({ navigate }: Props) {
  const [search, setSearch] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      setFavoriteIds(await getFavoriteIds());
      setRecentIds(await getRecentIds());
    })();
  }, []);

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

            {/* Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 نصائح سريعة</Text>
              <Text style={styles.tipsBody}>
                • راقب أضواء الخطر الحمراء قبل السرعة العالية.{'\n'}
                • احفظ الأضواء المهمة في المفضلة للوصول السريع.{'\n'}
                • استخدم البحث بالإنجليزية إذا لم تجد اسماً عربياً.
              </Text>
            </View>

            {/* Tools */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>أدوات</Text>
              <View style={styles.toolsRow}>
                <TouchableOpacity
                  style={styles.toolCard}
                  onPress={() => navigate({ name: 'checklist' })}
                  activeOpacity={0.85}
                >
                  <Text style={styles.toolIcon}>✅</Text>
                  <Text style={styles.toolTitle}>قائمة ما قبل القيادة</Text>
                  <Text style={styles.toolSub}>فحص سريع قبل الانطلاق</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toolCard}
                  onPress={() => navigate({ name: 'quiz' })}
                  activeOpacity={0.85}
                >
                  <Text style={styles.toolIcon}>🧠</Text>
                  <Text style={styles.toolTitle}>اختبار سريع</Text>
                  <Text style={styles.toolSub}>تعرّف على الرموز</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.severityBrowseTitle}>تصفح حسب الخطورة</Text>
              <View style={styles.severityBrowseRow}>
                <TouchableOpacity
                  style={[styles.sevBtn, styles.sevBtnRed]}
                  onPress={() =>
                    navigate({ name: 'browse', severity: 'red' })
                  }
                >
                  <Text style={styles.sevBtnText}>🔴 خطر</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sevBtn, styles.sevBtnYellow]}
                  onPress={() =>
                    navigate({ name: 'browse', severity: 'yellow' })
                  }
                >
                  <Text style={styles.sevBtnText}>🟡 تحذير</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.sevBtn, styles.sevBtnGreen]}
                  onPress={() =>
                    navigate({ name: 'browse', severity: 'green' })
                  }
                >
                  <Text style={styles.sevBtnText}>🟢 معلومات</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Favorites */}
            {favoriteIds.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  ⭐ المفضلة ({favoriteIds.length})
                </Text>
                {favoriteIds
                  .map((id) => warningLights.find((l) => l.id === id))
                  .filter(Boolean)
                  .map((light) => (
                    <LightCard
                      key={light!.id}
                      light={light!}
                      onPress={() =>
                        navigate({ name: 'detail', lightId: light!.id })
                      }
                    />
                  ))}
              </View>
            )}

            {/* Recent */}
            {recentIds.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🕐 آخر المشاهدة
                </Text>
                {recentIds
                  .map((id) => warningLights.find((l) => l.id === id))
                  .filter(Boolean)
                  .map((light) => (
                    <LightCard
                      key={light!.id}
                      light={light!}
                      onPress={() =>
                        navigate({ name: 'detail', lightId: light!.id })
                      }
                    />
                  ))}
              </View>
            )}

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
          <Text style={styles.footerVersion}>الإصدار {APP_VERSION}</Text>
          <Text style={styles.disclaimer}>
            المعلومات للإرشاد فقط ولا تغني عن تشخيص الميكانيكي. في الحالات
            الخطيرة توقف واطلب المساعدة.
          </Text>
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
  disclaimer: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  tipsCard: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  tipsTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  tipsBody: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 22,
  },
  toolsRow: {
    flexDirection: 'row-reverse',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  toolCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
  },
  toolIcon: { fontSize: 32, marginBottom: spacing.sm },
  toolTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  toolSub: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  severityBrowseTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  severityBrowseRow: {
    flexDirection: 'row-reverse',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  sevBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  sevBtnRed: {
    borderColor: colors.severityRed,
    backgroundColor: colors.severityRedBg,
  },
  sevBtnYellow: {
    borderColor: colors.severityYellow,
    backgroundColor: colors.severityYellowBg,
  },
  sevBtnGreen: {
    borderColor: colors.severityGreen,
    backgroundColor: colors.severityGreenBg,
  },
  sevBtnText: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
