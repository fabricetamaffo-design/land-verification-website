import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BadgeCheck,
  CircleCheck,
  FileSearch,
  History,
  Landmark,
  MapPinned,
  Network,
  Search,
  ShieldAlert,
  ShieldCheck,
  UsersRound,
} from 'lucide-react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { colors, gradients } from '../theme/colors';
import { commonStyles, radii, shadow, softShadow, spacing } from '../theme/styles';

export function AboutScreen() {
  const { navigate } = useNavigation();
  const { t } = useLanguage();
  const benefitIcons = [
    <ShieldAlert key="fraud" size={19} color={colors.primaryDark} />,
    <BadgeCheck key="confidence" size={19} color={colors.primaryDark} />,
    <MapPinned key="gps" size={19} color={colors.primaryDark} />,
  ];
  const dataIcons = [
    <FileSearch key="title" size={18} color={colors.primary} />,
    <MapPinned key="map" size={18} color={colors.primary} />,
    <History key="history" size={18} color={colors.primary} />,
  ];

  return (
    <Screen title={t.about.title} subtitle={t.about.subtitle}>
      <LinearGradient colors={gradients.hero} style={styles.identity}>
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <ShieldCheck size={30} color={colors.primaryDark} />
          </View>
          <View style={styles.heroSignal}>
            <CircleCheck size={14} color="#c8f7d7" />
            <Text style={styles.heroSignalText}>{t.about.trustLabel}</Text>
          </View>
        </View>
        <View>
          <Text style={styles.identityTitle}>{t.about.identityTitle}</Text>
          <Text style={styles.identityBody}>{t.about.identityBody}</Text>
        </View>
        <View style={styles.heroChips}>
          {t.about.trustChips.map((chip) => (
            <View key={chip} style={styles.heroChip}>
              <Text style={styles.heroChipText}>{chip}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={styles.sectionHeader}>
        <Text style={styles.kicker}>{t.about.whyKicker}</Text>
        <Text style={styles.sectionTitle}>{t.about.whyTitle}</Text>
        <Text style={styles.sectionIntro}>{t.about.whyIntro}</Text>
      </View>

      <View style={styles.benefitGrid}>
        {t.about.benefits.map((benefit, index) => (
          <View key={benefit.title} style={styles.benefitCard}>
            <View style={styles.benefitIcon}>{benefitIcons[index]}</View>
            <Text style={styles.benefitTitle}>{benefit.title}</Text>
            <Text style={styles.benefitBody}>{benefit.body}</Text>
          </View>
        ))}
      </View>

      <View style={[commonStyles.card, styles.spacedCard]}>
        <View style={styles.cardHeading}>
          <View style={styles.headingIcon}>
            <Network size={18} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t.about.verificationTitle}</Text>
        </View>
        <View style={styles.timeline}>
          {t.about.verificationSteps.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepMarker}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={[commonStyles.card, styles.spacedCard]}>
        <View style={styles.cardHeading}>
          <View style={styles.headingIcon}>
            <MapPinned size={18} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t.about.dataTitle}</Text>
        </View>
        {t.about.dataPoints.map((point, index) => (
          <View key={point.title} style={[styles.dataRow, index === t.about.dataPoints.length - 1 && styles.lastDataRow]}>
            <View style={styles.dataIcon}>{dataIcons[index]}</View>
            <View style={styles.dataText}>
              <Text style={styles.dataTitle}>{point.title}</Text>
              <Text style={styles.dataBody}>{point.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <LinearGradient colors={gradients.mint} style={styles.contextCard}>
        <View style={styles.cardHeading}>
          <View style={styles.headingIcon}>
            <Landmark size={18} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t.about.cameroonTitle}</Text>
        </View>
        <Text style={styles.contextText}>{t.about.cameroonText}</Text>
        <View style={styles.contextPoints}>
          {t.about.cameroonPoints.map((point) => (
            <View key={point} style={styles.contextPoint}>
              <CircleCheck size={15} color={colors.primary} />
              <Text style={styles.contextPointText}>{point}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <View style={[commonStyles.card, styles.spacedCard]}>
        <View style={styles.cardHeading}>
          <View style={styles.headingIcon}>
            <UsersRound size={18} color={colors.primary} />
          </View>
          <Text style={styles.title}>{t.about.team}</Text>
        </View>
        <Text style={styles.teamIntro}>{t.about.teamIntro}</Text>
        <View style={styles.teamList}>
          {t.about.teamMembers.map((member) => <Text key={member} style={styles.member}>{member}</Text>)}
        </View>
        <Text style={styles.supervisor}>{t.about.supervisor}</Text>
      </View>

      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>{t.about.ctaTitle}</Text>
        <Text style={styles.ctaBody}>{t.about.ctaBody}</Text>
        <Button
          title={t.about.searchParcel}
          icon={<Search size={18} color={colors.white} />}
          onPress={() => navigate({ name: 'Search' })}
          style={styles.ctaButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  spacedCard: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  kicker: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  sectionIntro: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },
  identity: {
    borderRadius: radii.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    gap: spacing.lg,
    ...shadow,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: '#d9f9e5',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  heroSignal: {
    alignItems: 'center',
    borderColor: 'rgba(217,249,229,0.3)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  heroSignalText: {
    color: '#d9f9e5',
    fontSize: 12,
    fontWeight: '900',
  },
  identityTitle: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 25,
    lineHeight: 31,
  },
  identityBody: {
    color: '#d9f9e5',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  heroChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  heroChip: {
    backgroundColor: 'rgba(217,249,229,0.14)',
    borderColor: 'rgba(217,249,229,0.24)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  heroChipText: {
    color: '#e9fff0',
    fontSize: 12,
    fontWeight: '900',
  },
  benefitGrid: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  benefitCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing.lg,
    ...softShadow,
  },
  benefitIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    height: 38,
    justifyContent: 'center',
    marginBottom: spacing.md,
    width: 38,
  },
  benefitTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  benefitBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  cardHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headingIcon: {
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    borderRadius: radii.md,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  timeline: {
    gap: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stepMarker: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    marginTop: 2,
    width: 28,
  },
  stepNumber: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 3,
  },
  stepBody: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  dataRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: spacing.md,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  },
  lastDataRow: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  dataIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  dataText: {
    flex: 1,
  },
  dataTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  dataBody: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  contextCard: {
    borderColor: colors.borderStrong,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
    ...softShadow,
  },
  contextText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  contextPoints: {
    gap: spacing.sm,
  },
  contextPoint: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  contextPointText: {
    color: colors.text,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  teamIntro: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.md,
  },
  teamList: {
    gap: spacing.sm,
  },
  member: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  supervisor: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    marginTop: spacing.md,
  },
  ctaCard: {
    backgroundColor: colors.primaryInk,
    borderRadius: radii.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow,
  },
  ctaTitle: {
    color: colors.white,
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 27,
  },
  ctaBody: {
    color: '#d9f9e5',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  ctaButton: {
    marginTop: spacing.xs,
  },
});
