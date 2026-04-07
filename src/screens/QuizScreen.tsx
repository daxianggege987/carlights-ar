import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing, fontSize, radius } from '../theme';
import { warningLights } from '../data/warningLights';
import { WarningLight } from '../types';
import BannerAdView from '../ads/BannerAdView';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  goBack: () => void;
}

export default function QuizScreen({ goBack }: Props) {
  const [light, setLight] = useState<WarningLight | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [correctName, setCorrectName] = useState('');
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);

  const nextQuestion = useCallback(() => {
    const pool = warningLights;
    const item = pool[Math.floor(Math.random() * pool.length)];
    const wrongs = shuffle(pool.filter((l) => l.id !== item.id)).slice(0, 3);
    const opts = shuffle([item.nameAr, ...wrongs.map((w) => w.nameAr)]);
    setLight(item);
    setCorrectName(item.nameAr);
    setChoices(opts);
    setPicked(null);
  }, []);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  const onPick = (name: string) => {
    if (picked) return;
    setPicked(name);
    setTotal((t) => t + 1);
    if (name === correctName) {
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const isCorrect = picked && picked === correctName;
  const isWrong = picked && picked !== correctName;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>اختبار سريع</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.stats}>
          سلسلة صحيحة: {streak} · أسئلة: {total}
        </Text>
        <Text style={styles.hint}>
          اختر الاسم العربي الصحيح لرمز التحذير المعروض.
        </Text>

        {light && (
          <>
            <View style={styles.iconBox}>
              <Text style={styles.iconBig}>{light.icon}</Text>
              <Text style={styles.subHint}>ما الاسم العربي لهذا الرمز؟</Text>
            </View>

            {choices.map((c) => {
              const show =
                picked &&
                (c === correctName
                  ? true
                  : c === picked && picked !== correctName);
              const highlightOk = picked && c === correctName;
              const highlightBad = picked && c === picked && c !== correctName;
              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.option,
                    highlightOk && styles.optionOk,
                    highlightBad && styles.optionBad,
                  ]}
                  onPress={() => onPick(c)}
                  disabled={!!picked}
                  activeOpacity={0.85}
                >
                  <Text style={styles.optionText}>{c}</Text>
                  {show && (
                    <Text style={styles.tag}>
                      {c === correctName ? 'صحيح' : ''}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}

            {isWrong && (
              <Text style={styles.feedback}>
                الإجابة الصحيحة: {correctName}
              </Text>
            )}
            {isCorrect && (
              <Text style={styles.feedbackOk}>أحسنت!</Text>
            )}

            <TouchableOpacity
              style={styles.nextBtn}
              onPress={nextQuestion}
              disabled={!picked}
            >
              <Text
                style={[styles.nextText, !picked && styles.nextTextDisabled]}
              >
                السؤال التالي
              </Text>
            </TouchableOpacity>
          </>
        )}
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
  scrollContent: { padding: spacing.xl, paddingBottom: 48 },
  stats: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xxl,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  iconBig: { fontSize: 72, marginBottom: spacing.md },
  subHint: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionOk: {
    borderColor: colors.severityGreen,
    backgroundColor: colors.severityGreenBg,
  },
  optionBad: {
    borderColor: colors.severityRed,
    backgroundColor: colors.severityRedBg,
  },
  optionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    textAlign: 'right',
    lineHeight: 22,
  },
  tag: { fontSize: fontSize.sm, color: colors.severityGreen, fontWeight: '700' },
  feedback: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.severityRed,
    textAlign: 'right',
  },
  feedbackOk: {
    marginTop: spacing.md,
    fontSize: fontSize.md,
    color: colors.severityGreen,
    textAlign: 'right',
    fontWeight: '700',
  },
  nextBtn: {
    marginTop: spacing.xl,
    alignSelf: 'stretch',
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  nextText: { fontSize: fontSize.md, color: colors.white, fontWeight: '700' },
  nextTextDisabled: { opacity: 0.4 },
});
