import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Ban, Pencil, Upload } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { LandCard } from '../../components/LandCard';
import { Screen } from '../../components/Screen';
import { StateView } from '../../components/StateView';
import { TextField } from '../../components/TextField';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { adminApi } from '../../services/api';
import type { LandParcel } from '../../shared';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/styles';
import { template } from '../../utils/localized';

export function ManageLandsScreen() {
  const [lands, setLands] = useState<LandParcel[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { navigate } = useNavigation();
  const { t } = useLanguage();

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await adminApi.lands(1, 100);
      setLands(data.lands);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.failed);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = filter.toLowerCase();
    if (!q) return lands;
    return lands.filter((land) =>
      land.titleNumber.toLowerCase().includes(q) ||
      land.ownerName.toLowerCase().includes(q) ||
      land.quarter.toLowerCase().includes(q));
  }, [filter, lands]);

  function deactivate(land: LandParcel) {
    Alert.alert(t.admin.deactivateTitle, template(t.admin.deactivateMessage, { title: land.titleNumber }), [
      { text: t.admin.cancel, style: 'cancel' },
      {
        text: t.admin.deactivate,
        style: 'destructive',
        onPress: async () => {
          try {
            await adminApi.deactivateLand(land.id);
            await load();
          } catch (err) {
            Alert.alert(t.admin.deactivateFailed, err instanceof Error ? err.message : t.common.failed);
          }
        },
      },
    ]);
  }

  return (
    <Screen title={t.admin.manageTitle} subtitle={t.admin.manageSubtitle} refreshing={loading} onRefresh={load}>
      <TextField label={t.admin.filter} value={filter} onChangeText={setFilter} placeholder={t.admin.filterPlaceholder} />
      <Button title={t.admin.uploadNew} icon={<Upload size={18} color={colors.white} />} onPress={() => navigate({ name: 'UploadLand' })} style={styles.upload} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      {loading && !lands.length && <StateView title={t.admin.loadingRecords} loading />}
      {!loading && !filtered.length && <StateView title={t.admin.noMatch} />}
      {filtered.map((land) => (
        <View key={land.id} style={styles.wrap}>
          <LandCard land={land} admin onPress={() => navigate({ name: land.isActive ? 'LandDetail' : 'EditLand', id: land.id })} />
          <View style={styles.actions}>
            <Button title={t.admin.edit} icon={<Pencil size={16} color={colors.primaryDark} />} variant="secondary" onPress={() => navigate({ name: 'EditLand', id: land.id })} style={styles.action} />
            {land.isActive && <Button title={t.admin.deactivate} icon={<Ban size={16} color={colors.white} />} variant="danger" onPress={() => deactivate(land)} style={styles.action} />}
          </View>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  upload: {
    marginVertical: spacing.md,
  },
  wrap: {
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  action: {
    flex: 1,
  },
  error: {
    color: colors.danger,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
});
