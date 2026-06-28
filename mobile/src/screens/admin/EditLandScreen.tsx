import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus, Save } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { SegmentedControl } from '../../components/SegmentedControl';
import { StateView } from '../../components/StateView';
import { TextField } from '../../components/TextField';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { adminApi, landApi } from '../../services/api';
import type { LandParcel, OwnershipDraft } from '../../shared';
import { OWNERSHIP_TYPES } from '../../shared';
import { colors } from '../../theme/colors';
import { commonStyles, spacing } from '../../theme/styles';
import { ownershipName } from '../../utils/localized';
import { emptyOwnershipDraft, formFromLand, landFormData, validateLandForm } from './adminForms';
import { LandFields } from './UploadLandScreen';

export function EditLandScreen({ id }: { id: string }) {
  const [land, setLand] = useState<LandParcel | null>(null);
  const [form, setForm] = useState(formFromLandPlaceholder());
  const [newOwner, setNewOwner] = useState<OwnershipDraft>(emptyOwnershipDraft('PURCHASE'));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { replace } = useNavigation();
  const { t } = useLanguage();

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function setOwnerField(field: keyof OwnershipDraft, value: string) {
    setNewOwner((current) => ({ ...current, [field]: value }));
  }

  async function load() {
    setLoading(true);
    try {
      const data = await landApi.detail(id);
      setLand(data.land);
      setForm(formFromLand(data.land));
    } catch (err) {
      Alert.alert(t.admin.loadFailed, err instanceof Error ? err.message : t.admin.unableLoadLand);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  async function save() {
    const error = validateLandForm(form, t.admin);
    if (error) {
      Alert.alert(t.admin.checkForm, error);
      return;
    }
    setSaving(true);
    try {
      await adminApi.updateLand(id, landFormData(form));
      Alert.alert(t.admin.updatedTitle, t.admin.updatedMessage, [
        { text: t.admin.manageLands, onPress: () => replace({ name: 'ManageLands' }) },
      ]);
    } catch (err) {
      Alert.alert(t.admin.updateFailed, err instanceof Error ? err.message : t.common.failed);
    } finally {
      setSaving(false);
    }
  }

  async function addOwner() {
    if (!newOwner.ownerName.trim() || !newOwner.fromYear.trim()) {
      Alert.alert(t.admin.checkOwner, t.admin.checkOwnerMessage);
      return;
    }
    try {
      await adminApi.addOwnership(id, {
        ownerName: newOwner.ownerName.trim(),
        ownershipType: newOwner.ownershipType,
        fromYear: Number(newOwner.fromYear),
        toYear: newOwner.toYear ? Number(newOwner.toYear) : null,
        notes: newOwner.notes.trim() || undefined,
      });
      setNewOwner(emptyOwnershipDraft('PURCHASE'));
      await load();
    } catch (err) {
      Alert.alert(t.admin.ownershipUpdateFailed, err instanceof Error ? err.message : t.common.failed);
    }
  }

  function deleteOwner(recordId: string) {
    Alert.alert(t.admin.deleteOwnershipTitle, t.admin.deleteOwnershipMessage, [
      { text: t.admin.cancel, style: 'cancel' },
      {
        text: t.admin.delete,
        style: 'destructive',
        onPress: async () => {
          try {
            await adminApi.deleteOwnership(recordId);
            await load();
          } catch (err) {
            Alert.alert(t.admin.deleteFailed, err instanceof Error ? err.message : t.common.failed);
          }
        },
      },
    ]);
  }

  if (loading) return <Screen><StateView title={t.admin.loadingRecords} loading /></Screen>;
  if (!land) return <Screen><StateView title={t.admin.landNotFound} /></Screen>;

  return (
    <Screen title={t.admin.editTitle} subtitle={t.admin.editSubtitle}>
      <LandFields form={form} setField={setField} />
      <Button title={t.admin.saveChanges} icon={<Save size={18} color={colors.white} />} onPress={save} loading={saving} />

      <View style={commonStyles.card}>
        <Text style={styles.section}>{t.admin.existingOwnership}</Text>
        {land.ownershipHistory?.length ? land.ownershipHistory.map((record) => (
          <View key={record.id} style={styles.record}>
            <View style={{ flex: 1 }}>
              <Text style={styles.recordName}>{record.ownerName}</Text>
              <Text style={styles.recordMeta}>{ownershipName(t, record.ownershipType)} - {record.fromYear} {t.common.to} {record.toYear || t.ownership.present}</Text>
            </View>
            <Pressable onPress={() => deleteOwner(record.id)}>
              <Text style={styles.delete}>{t.admin.delete}</Text>
            </Pressable>
          </View>
        )) : <Text style={styles.recordMeta}>{t.admin.noOwnership}</Text>}
      </View>

      <View style={commonStyles.card}>
        <Text style={styles.section}>{t.admin.addOwnership}</Text>
        <TextField label={t.admin.ownerName} value={newOwner.ownerName} onChangeText={(value) => setOwnerField('ownerName', value)} />
        <Text style={styles.inlineLabel}>{t.admin.acquisitionType}</Text>
        <SegmentedControl
          options={OWNERSHIP_TYPES.map((type) => ({ label: ownershipName(t, type), value: type }))}
          value={newOwner.ownershipType}
          onChange={(value) => setOwnerField('ownershipType', value)}
        />
        <TextField label={t.admin.fromYear} value={newOwner.fromYear} onChangeText={(value) => setOwnerField('fromYear', value)} keyboardType="number-pad" style={styles.fieldGap} />
        <TextField label={t.admin.toYear} value={newOwner.toYear} onChangeText={(value) => setOwnerField('toYear', value)} keyboardType="number-pad" style={styles.fieldGap} />
        <TextField label={t.admin.notes} value={newOwner.notes} onChangeText={(value) => setOwnerField('notes', value)} style={styles.fieldGap} />
        <Button title={t.admin.addOwnership} icon={<Plus size={16} color={colors.primaryDark} />} variant="secondary" onPress={addOwner} style={styles.fieldGap} />
      </View>
    </Screen>
  );
}

function formFromLandPlaceholder() {
  return {
    titleNumber: '',
    ownerName: '',
    quarter: '',
    areaSqm: '',
    gpsLat: '',
    gpsLng: '',
    notes: '',
    titleApprovedYear: '',
    landUseType: 'RESIDENTIAL',
  };
}

const styles = StyleSheet.create({
  section: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 17,
    marginBottom: spacing.md,
  },
  record: {
    flexDirection: 'row',
    gap: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
  },
  recordName: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 15,
  },
  recordMeta: {
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: 3,
  },
  delete: {
    color: colors.danger,
    fontWeight: '900',
  },
  inlineLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  fieldGap: {
    marginTop: spacing.md,
  },
});
