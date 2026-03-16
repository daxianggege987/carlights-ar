import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Screen } from '../types';
import { colors, spacing, fontSize, radius, severityLabelAr, categoryColorMap } from '../theme';
import { warningLights } from '../data/warningLights';
import { categories } from '../data/categories';
import SeverityBadge from '../components/SeverityBadge';
import BannerAdView from '../ads/BannerAdView';
import { adManager } from '../ads/AdManager';

interface Props {
  lightId: string;
  navigate: (screen: Screen) => void;
  goBack: () => void;
}

export default function DetailScreen({ lightId, navigate, goBack }: Props) {
  const light = warningLights.find((l) => l.id === lightId);

  const handleGoBack = () => {
    if (light) {
      adManager.tryShowInterstitial(light.severity === 'red');
    }
    goBack();
  };

  if (!light) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>لم يتم العثور على هذا الضوء</Text>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.backLink}>← العودة</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const catInfo = categories.find((c) => c.id === light.category);
  const catColor = categoryColorMap[light.category] || colors.textMuted;
  const severityLabel = severityLabelAr[light.severity];

  const severityBgColor =
    light.severity === 'red'
      ? colors.severityRedBg
      : light.severity === 'yellow'
      ? colors.severityYellowBg
      : colors.severityGreenBg;

  const severityTextColor =
    light.severity === 'red'
      ? colors.severityRed
      : light.severity === 'yellow'
      ? colors.severityYellow
      : colors.severityGreen;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backBtn}>
          <Text style={styles.backText}>→ رجوع</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {light.nameAr}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={[styles.heroCard, { borderColor: severityTextColor + '40' }]}>
          <Text style={styles.heroIcon}>{light.icon}</Text>
          <Text style={styles.heroName}>{light.nameAr}</Text>
          <Text style={styles.heroNameEn}>{light.nameEn}</Text>
          <View style={styles.heroMeta}>
            <SeverityBadge severity={light.severity} large />
            <TouchableOpacity
              style={[styles.catBadge, { backgroundColor: catColor + '20' }]}
              onPress={() => navigate({ name: 'browse', category: light.category })}
            >
              <Text style={[styles.catBadgeText, { color: catColor }]}>
                {catInfo?.icon} {catInfo?.nameAr}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Severity Banner */}
        <View style={[styles.severityBanner, { backgroundColor: severityBgColor }]}>
          <Text style={[styles.severityBannerText, { color: severityTextColor }]}>
            {severityLabel}
          </Text>
          {!light.canDrive && (
            <Text style={styles.stopDrivingBanner}>
              ⛔ لا تستمر في القيادة — توقف فوراً!
            </Text>
          )}
          {light.canDrive && (
            <Text style={styles.canDriveBanner}>
              ✅ يمكنك القيادة بحذر حتى الوصول للورشة
            </Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionIcon}>📖</Text>
          <Text style={styles.sectionTitle}>ماذا يعني هذا الضوء؟</Text>
          <Text style={styles.sectionBody}>{light.descriptionAr}</Text>
        </View>

        {/* Action */}
        <View style={[styles.sectionCard, styles.actionCard]}>
          <Text style={styles.sectionIcon}>🛠️</Text>
          <Text style={styles.sectionTitle}>ماذا يجب أن تفعل؟</Text>
          <Text style={styles.sectionBody}>{light.actionAr}</Text>
        </View>

        {/* Common Causes */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionIcon}>🔍</Text>
          <Text style={styles.sectionTitle}>الأسباب الشائعة</Text>
          {light.commonCausesAr.map((cause, index) => (
            <View key={index} style={styles.causeItem}>
              <Text style={styles.causeBullet}>•</Text>
              <Text style={styles.causeText}>{cause}</Text>
            </View>
          ))}
        </View>

        {/* Can Drive Info */}
        <View
          style={[
            styles.driveInfoCard,
            {
              backgroundColor: light.canDrive
                ? colors.severityGreenBg
                : colors.severityRedBg,
              borderColor: light.canDrive
                ? colors.severityGreen + '30'
                : colors.severityRed + '30',
            },
          ]}
        >
          <Text style={styles.driveInfoIcon}>
            {light.canDrive ? '✅' : '⛔'}
          </Text>
          <Text
            style={[
              styles.driveInfoTitle,
              {
                color: light.canDrive
                  ? colors.severityGreen
                  : colors.severityRed,
              },
            ]}
          >
            {light.canDrive
              ? 'يمكنك الاستمرار في القيادة'
              : 'توقف فوراً عن القيادة'}
          </Text>
          <Text style={styles.driveInfoBody}>
            {light.canDrive
              ? 'يمكنك القيادة بحذر للوصول إلى أقرب ورشة صيانة. تجنب السرعات العالية وراقب مؤشرات السيارة.'
              : 'هذا العطل خطير! توقف في أقرب مكان آمن وأوقف المحرك. لا تحاول القيادة حتى يتم الإصلاح.'}
          </Text>
        </View>

        {/* Related Lights */}
        {warningLights
          .filter(
            (l) => l.category === light.category && l.id !== light.id
          )
          .length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>أضواء مشابهة</Text>
            {warningLights
              .filter(
                (l) => l.category === light.category && l.id !== light.id
              )
              .slice(0, 3)
              .map((related) => (
                <TouchableOpacity
                  key={related.id}
                  style={styles.relatedCard}
                  onPress={() =>
                    navigate({ name: 'detail', lightId: related.id })
                  }
                >
                  <Text style={styles.relatedIcon}>{related.icon}</Text>
                  <Text style={styles.relatedName}>{related.nameAr}</Text>
                  <SeverityBadge severity={related.severity} />
                </TouchableOpacity>
              ))}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
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
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 60,
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    marginTop: spacing.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  heroName: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  heroNameEn: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  heroMeta: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: spacing.md,
  },
  catBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  catBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  severityBanner: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  severityBannerText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    textAlign: 'center',
  },
  stopDrivingBanner: {
    fontSize: fontSize.md,
    color: colors.severityRed,
    fontWeight: '700',
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  canDriveBanner: {
    fontSize: fontSize.sm,
    color: colors.severityGreen,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionCard: {
    borderColor: colors.primary + '30',
  },
  sectionIcon: {
    fontSize: 24,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  sectionBody: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    lineHeight: 26,
    textAlign: 'right',
  },
  causeItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  causeBullet: {
    fontSize: fontSize.md,
    color: colors.primary,
    marginLeft: spacing.sm,
    lineHeight: 24,
  },
  causeText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'right',
    lineHeight: 24,
  },
  driveInfoCard: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
  },
  driveInfoIcon: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  driveInfoTitle: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  driveInfoBody: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  relatedSection: {
    marginTop: spacing.xxl,
  },
  relatedTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'right',
    marginBottom: spacing.md,
  },
  relatedCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  relatedIcon: {
    fontSize: 24,
    marginLeft: spacing.md,
  },
  relatedName: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  backLink: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: '600',
  },
});
