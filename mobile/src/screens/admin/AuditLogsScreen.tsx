import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { useLanguage } from '../../context/LanguageContext';
import { adminApi } from '../../services/api';
import type { AuditLog } from '../../shared';
import { colors } from '../../theme/colors';
import { commonStyles, spacing } from '../../theme/styles';
import { formatDateLabel } from '../../utils/localized';

export function AuditLogsScreen({ landId, titleNumber }: { landId: string; titleNumber?: string }) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { lang, t } = useLanguage();

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.auditLogs(landId);
      setLogs(data.logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.failed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [landId]);

  return (
    <Screen title={t.admin.auditTitle} subtitle={titleNumber || landId} refreshing={loading} onRefresh={load}>
      {!!error && <Text style={styles.error}>{error}</Text>}
      {loading && !logs.length && <StateView title={t.admin.loadingAudit} loading />}
      {!loading && !logs.length && <StateView title={t.admin.noAudit} />}
      {logs.map((log) => (
        <View key={log.id} style={commonStyles.card}>
          <Text style={styles.action}>{log.action}</Text>
          <Text style={styles.meta}>{formatDateLabel(t, lang, log.timestamp)} {t.common.by} {log.user?.name || log.userId}</Text>
          {!!log.changes && <Text style={styles.json}>{JSON.stringify(log.changes, null, 2)}</Text>}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  action: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  meta: {
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: spacing.sm,
  },
  json: {
    color: colors.slate,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 12,
  },
  error: {
    color: colors.danger,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
});
