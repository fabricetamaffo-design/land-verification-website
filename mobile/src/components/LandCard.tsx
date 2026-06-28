import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarDays, MapPin, Ruler, UserRound } from 'lucide-react-native';
import { useLanguage } from '../context/LanguageContext';
import type { SearchResult } from '../shared';
import { isValidStatus } from '../shared';
import { colors, gradients } from '../theme/colors';
import { commonStyles, spacing } from '../theme/styles';
import { formatAreaLabel, formatDateLabel, landUseName } from '../utils/localized';
import { StatusBadge } from './StatusBadge';

export function LandCard({
  land,
  onPress,
  admin,
}: {
  land: SearchResult;
  onPress: () => void;
  admin?: boolean;
}) {
  const { lang, t } = useLanguage();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [commonStyles.card, styles.card, pressed && styles.pressed]}>
      <LinearGradient
        colors={isValidStatus(land.status) ? gradients.mint : ['#fff0f0', '#ffe0e0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.accent}
      />
      <View style={styles.top}>
        <View style={styles.titleBlock}>
          <Text style={styles.kicker}>{t.landCard.titleNumber}</Text>
          <Text style={styles.title}>{land.titleNumber}</Text>
        </View>
        <StatusBadge status={land.status} admin={admin} />
      </View>
      <View style={styles.grid}>
        <Metric icon={<UserRound size={15} color={colors.primary} />} label={t.landCard.owner} value={land.ownerName} />
        <Metric icon={<MapPin size={15} color={colors.primary} />} label={t.landCard.quarter} value={land.quarter} />
        <Metric icon={<Ruler size={15} color={colors.primary} />} label={t.landCard.area} value={formatAreaLabel(t, land.areaSqm)} />
        <Metric icon={<CalendarDays size={15} color={colors.primary} />} label={t.landCard.registered} value={formatDateLabel(t, lang, land.createdAt)} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.use}>{landUseName(t, land.landUseType)}</Text>
        <Text style={styles.link}>{t.landCard.viewDetails}</Text>
      </View>
    </Pressable>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <View style={styles.metricHead}>
        {icon}
        <Text style={styles.metricLabel}>{label}</Text>
      </View>
      <Text numberOfLines={1} style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    gap: spacing.md,
    overflow: 'hidden',
    paddingTop: spacing.xl,
    borderColor: colors.borderStrong,
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 7,
  },
  pressed: {
    opacity: 0.94,
    transform: [{ translateY: 1 }, { scale: 0.995 }],
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  titleBlock: {
    flex: 1,
  },
  kicker: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: 0,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metric: {
    width: '48%',
    backgroundColor: colors.surfaceTint,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metricHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  use: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    overflow: 'hidden',
  },
  link: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
});
