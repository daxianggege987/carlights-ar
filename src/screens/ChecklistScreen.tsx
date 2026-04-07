import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, fontSize, radius } from '../theme';
import BannerAdView from '../ads/BannerAdView';

const STORAGE_KEY = '@carlights/predrive-checklist-v1';

interface Item {
  id: string;
  text: string;
}

const ITEMS: Item[] = [
  { id: '1', text: 'جميع أضواء التحذير مطفأة عند التشغيل' },
  { id: '2', text: 'مستوى الزيت ضمن المحدد في الدليل' },
  { id: '3', text: 'مستوى سائل التبريد ضمن الحد' },
  { id: '4', text: 'الفرامل تعمل بشكل طبيعي (لا صرير شديد)' },
  { id: '5', text: 'ضغط الإطارات مناسب (بما فيها الاحتياطي إن لزم)' },
  { id: '6', text: 'المساحات والزجاج الأمامي نظيفان' },
  { id: '7', text: 'المرايا مضبوطة والأحزمة مربوطة' },
  { id: '8', text: 'لا رائحة وقود أو حرارة غريبة داخل المقصورة' },
  { id: '9', text: 'خطة طوارئ: رقم ورشة أو سحب معروف' },
  { id: '10', text: 'للرحلات الطويلة: فحص سريع للسوائل والإضاءة' },
];

interface Props {
  goBack: () => void;
}

export default function ChecklistScreen({ goBack }: Props) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = async (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const checkedCount = ITEMS.filter((i) => done[i.id]).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>قائمة ما قبل القيادة</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.intro}>
          استخدم هذه القائمة قبل الرحلات المهمة. لا تغني عن فحص دوري عند
          الميكانيكي.
        </Text>
        <Text style={styles.progress}>
          تم إنجاز {checkedCount} من {ITEMS.length}
        </Text>

        {ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.row, done[item.id] && styles.rowDone]}
            onPress={() => toggle(item.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.check}>{done[item.id] ? '☑' : '☐'}</Text>
            <Text
              style={[styles.rowText, done[item.id] && styles.rowTextDone]}
            >
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={async () => {
            setDone({});
            await AsyncStorage.removeItem(STORAGE_KEY);
          }}
        >
          <Text style={styles.resetText}>مسح التحديدات</Text>
        </TouchableOpacity>
      </ScrollView>
      <BannerAdView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backBtn: { padding: spacing.sm },
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
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.xl,
    paddingBottom: 48,
  },
  intro: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  progress: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  rowDone: {
    borderColor: colors.severityGreen + '60',
    backgroundColor: colors.severityGreenBg,
  },
  check: { fontSize: 22, marginTop: 2 },
  rowText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: 24,
  },
  rowTextDone: { color: colors.textSecondary },
  resetBtn: {
    marginTop: spacing.xl,
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  resetText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});
