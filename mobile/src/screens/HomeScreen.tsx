import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPinned, Search, ShieldCheck, Sparkles, UsersRound } from 'lucide-react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { colors, gradients } from '../theme/colors';
import { commonStyles, shadow, spacing } from '../theme/styles';

const featureIcons = [ShieldCheck, MapPinned, UsersRound, Sparkles];

export function HomeScreen() {
  const [query, setQuery] = useState('');
  const { navigate } = useNavigation();
  const { t } = useLanguage();

  return (
    <Screen>
      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <View style={styles.heroTop}>
          <View style={styles.mark}><ShieldCheck size={25} color={colors.primaryDark} /></View>
          <View style={styles.signal}>
            <View style={styles.signalDot} />
            <Text style={styles.signalText}>{t.home.signal}</Text>
          </View>
        </View>
        <Text style={styles.badge}>{t.home.badge}</Text>
        <Text style={styles.title}>{t.home.title}</Text>
        <Text style={styles.subtitle}>{t.home.subtitle}</Text>
        <TextField
          label={t.home.titleNumber}
          value={query}
          onChangeText={setQuery}
          placeholder={t.home.placeholder}
          autoCapitalize="characters"
        />
        <View style={styles.actions}>
          <Button title={t.home.search} icon={<Search size={18} color={colors.white} />} onPress={() => navigate({ name: 'Search', query: query.trim() || undefined })} />
          <Button title={t.home.browse} icon={<MapPinned size={18} color={colors.primaryDark} />} variant="secondary" onPress={() => navigate({ name: 'Browse' })} />
        </View>
      </LinearGradient>

      <View style={styles.stats}>
        <Stat value="12" label={t.home.stats.requirements} />
        <Stat value="REST" label={t.home.stats.api} />
        <Stat value="EN/FR" label={t.home.stats.languages} />
      </View>

      <View style={styles.featureList}>
        {t.home.features.map((feature, index) => {
          const Icon = featureIcons[index] || ShieldCheck;
          return (
          <View key={feature.title} style={styles.featureCard}>
            <View style={styles.featureIcon}>
              {React.createElement(Icon, { size: 22, color: colors.primary })}
            </View>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={commonStyles.body}>{feature.desc}</Text>
            </View>
          </View>
          );
        })}
      </View>
    </Screen>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 18,
    padding: spacing.xl,
    gap: spacing.md,
    overflow: 'hidden',
    ...shadow,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mark: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#c8f7d7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
  },
  signalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#76f2a2',
  },
  signalText: {
    color: '#d9f9e5',
    fontWeight: '900',
    fontSize: 11,
  },
  badge: {
    color: '#a7f3c1',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.white,
    fontSize: 35,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: '#d4e8da',
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    gap: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  statValue: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 17,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
    fontWeight: '800',
  },
  featureList: {
    gap: spacing.md,
  },
  featureCard: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 16,
    marginBottom: 6,
  },
});
