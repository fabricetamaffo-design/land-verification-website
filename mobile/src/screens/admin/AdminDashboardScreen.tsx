import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ClipboardList, Upload, Users } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { LandCard } from '../../components/LandCard';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { adminApi } from '../../services/api';
import type { LandParcel } from '../../shared';
import { colors } from '../../theme/colors';
import { commonStyles, spacing } from '../../theme/styles';

export function AdminDashboardScreen() {
  const [lands, setLands] = useState<LandParcel[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();
  const { navigate } = useNavigation();
  const { t } = useLanguage();

  async function load() {
    setLoading(true);
    setError('');
    try {
      const [landData, userData] = await Promise.all([adminApi.lands(1, 100), adminApi.users(1, 100)]);
      setLands(landData.lands);
      setUserCount(userData.total || userData.users.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.failed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const counts = useMemo(() => ({
    total: lands.length,
    valid: lands.filter((land) => land.status === 'VALID').length,
    suspicious: lands.filter((land) => land.status === 'SUSPICIOUS').length,
    duplicate: lands.filter((land) => land.status === 'DUPLICATE').length,
    active: lands.filter((land) => land.isActive).length,
  }), [lands]);

  if (!isAdmin) return <Screen title={t.nav.admin}><StateView title={t.admin.accessRequired} message={t.admin.loginAdmin} /></Screen>;

  return (
    <Screen title={t.admin.dashboardTitle} subtitle={t.admin.dashboardSubtitle} refreshing={loading} onRefresh={load}>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.stats}>
        <Stat label={t.admin.total} value={counts.total} />
        <Stat label={t.admin.active} value={counts.active} />
        <Stat label={t.admin.valid} value={counts.valid} />
        <Stat label={t.admin.suspicious} value={counts.suspicious} />
        <Stat label={t.admin.duplicate} value={counts.duplicate} />
        <Stat label={t.admin.users} value={userCount} />
      </View>

      <View style={styles.actions}>
        <Button title={t.admin.uploadLand} icon={<Upload size={18} color={colors.white} />} onPress={() => navigate({ name: 'UploadLand' })} />
        <Button title={t.admin.manageLands} icon={<ClipboardList size={16} color={colors.primaryDark} />} variant="secondary" onPress={() => navigate({ name: 'ManageLands' })} />
        <Button title={t.admin.users} icon={<Users size={16} color={colors.primaryDark} />} variant="secondary" onPress={() => navigate({ name: 'AdminUsers' })} />
      </View>

      <Text style={styles.section}>{t.admin.recentRecords}</Text>
      {loading && !lands.length && <StateView title={t.admin.loadingRecords} loading />}
      {lands.slice(0, 5).map((land) => (
        <LandCard
          key={land.id}
          land={land}
          admin
          onPress={() => navigate({ name: land.isActive ? 'LandDetail' : 'EditLand', id: land.id })}
        />
      ))}
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stat: {
    width: '31%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  statValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '900',
  },
  actions: {
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  section: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
    marginBottom: spacing.md,
  },
  error: {
    color: colors.danger,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
});
