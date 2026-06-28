import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InfoRow } from '../../components/InfoRow';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services/api';
import type { AdminUser } from '../../shared';
import { colors } from '../../theme/colors';
import { commonStyles, spacing } from '../../theme/styles';
import { formatDateLabel } from '../../utils/localized';

export function AdminUsersScreen() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { lang, t } = useLanguage();

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.users(1, 100);
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.failed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen title={t.admin.usersTitle} subtitle={t.admin.usersSubtitle} refreshing={loading} onRefresh={load}>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {loading && !users.length && <StateView title={t.admin.loadingUsers} loading />}
      {users.map((user) => (
        <View key={user.id} style={commonStyles.card}>
          <Text style={styles.name}>{user.name}</Text>
          <InfoRow label={t.profile.email} value={user.email} />
          <InfoRow label={t.profile.role} value={user.role} />
          <InfoRow label={t.admin.state} value={user.isActive ? t.common.active : t.common.inactive} />
          <InfoRow label={t.admin.created} value={formatDateLabel(t, lang, user.createdAt)} />
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  error: {
    color: colors.danger,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
});
