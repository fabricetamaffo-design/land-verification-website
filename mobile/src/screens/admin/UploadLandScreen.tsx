import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FileUp, Plus, Upload } from 'lucide-react-native';
import { Button } from '../../components/Button';
import { Screen } from '../../components/Screen';
import { SegmentedControl } from '../../components/SegmentedControl';
import { TextField } from '../../components/TextField';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '../../navigation/NavigationContext';
import { adminApi } from '../../services/api';
import { LAND_USE_TYPES, OWNERSHIP_TYPES } from '../../shared';
import type { OwnershipDraft } from '../../shared';
import { colors } from '../../theme/colors';
import { commonStyles, spacing } from '../../theme/styles';
import { landUseName, ownershipName, template } from '../../utils/localized';
import { emptyLandForm, emptyOwnershipDraft, landFormData, validateLandForm, validateOwnershipDrafts } from './adminForms';

export function UploadLandScreen() {
  const [form, setForm] = useState(emptyLandForm());
  const [owners, setOwners] = useState<OwnershipDraft[]>([emptyOwnershipDraft()]);
  const [documents, setDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const { replace } = useNavigation();
  const { t } = useLanguage();

  function setField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function setOwner(index: number, field: keyof OwnershipDraft, value: string) {
    setOwners((current) => current.map((owner, i) => i === index ? { ...owner, [field]: value } : owner));
  }

  async function pickDocuments() {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      multiple: true,
      copyToCacheDirectory: true,
    });
    if (!result.canceled) setDocuments(result.assets.slice(0, 5));
  }

  async function submit() {
    const landError = validateLandForm(form, t.admin);
    const ownerError = validateOwnershipDrafts(owners, t.admin);
    if (landError || ownerError) {
      Alert.alert(t.admin.checkForm, landError || ownerError);
      return;
    }
    setLoading(true);
    try {
      await adminApi.uploadLand(landFormData(form, owners, documents));
      Alert.alert(t.admin.uploadedTitle, t.admin.uploadedMessage, [
        { text: t.admin.adminPanel, onPress: () => replace({ name: 'AdminDashboard' }) },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.common.failed;
      Alert.alert(t.admin.uploadFailed, message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title={t.admin.uploadTitle} subtitle={t.admin.uploadSubtitle}>
      <LandFields form={form} setField={setField} />

      <View style={commonStyles.card}>
        <Text style={styles.section}>{t.admin.ownershipHistory}</Text>
        {owners.map((owner, index) => (
          <View key={index} style={styles.ownerCard}>
            <View style={styles.ownerHeader}>
              <Text style={styles.ownerTitle}>{template(t.admin.ownerNumber, { number: index + 1 })}</Text>
              {owners.length > 1 && (
                <Pressable onPress={() => setOwners((current) => current.filter((_, i) => i !== index))}>
                  <Text style={styles.remove}>{t.admin.remove}</Text>
                </Pressable>
              )}
            </View>
            <TextField label={t.admin.ownerName} value={owner.ownerName} onChangeText={(value) => setOwner(index, 'ownerName', value)} />
            <Text style={styles.inlineLabel}>{t.admin.acquisitionType}</Text>
            <SegmentedControl
              options={OWNERSHIP_TYPES.map((type) => ({ label: ownershipName(t, type), value: type }))}
              value={owner.ownershipType}
              onChange={(value) => setOwner(index, 'ownershipType', value)}
            />
            <TextField label={t.admin.fromYear} value={owner.fromYear} onChangeText={(value) => setOwner(index, 'fromYear', value)} keyboardType="number-pad" style={styles.fieldGap} />
            <TextField label={t.admin.toYearCurrent} value={owner.toYear} onChangeText={(value) => setOwner(index, 'toYear', value)} keyboardType="number-pad" style={styles.fieldGap} />
            <TextField label={t.admin.notes} value={owner.notes} onChangeText={(value) => setOwner(index, 'notes', value)} style={styles.fieldGap} />
          </View>
        ))}
        <Button title={t.admin.addOwner} icon={<Plus size={16} color={colors.primaryDark} />} variant="secondary" onPress={() => setOwners((current) => [...current, emptyOwnershipDraft('PURCHASE')])} />
      </View>

      <View style={commonStyles.card}>
        <Text style={styles.section}>{t.admin.documents}</Text>
        <Button title={t.admin.pickDocuments} icon={<FileUp size={16} color={colors.primaryDark} />} variant="secondary" onPress={pickDocuments} />
        {documents.map((doc) => <Text key={doc.uri} style={styles.doc}>{doc.name}</Text>)}
      </View>

      <Button title={t.admin.uploadVerify} icon={<Upload size={18} color={colors.white} />} onPress={submit} loading={loading} />
    </Screen>
  );
}

export function LandFields({
  form,
  setField,
}: {
  form: ReturnType<typeof emptyLandForm>;
  setField: (field: keyof ReturnType<typeof emptyLandForm>, value: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <View style={commonStyles.card}>
      <Text style={styles.section}>{t.admin.basicInfo}</Text>
      <TextField label={t.land.titleNumber} value={form.titleNumber} onChangeText={(value) => setField('titleNumber', value)} autoCapitalize="characters" />
      <TextField label={t.admin.currentOwner} value={form.ownerName} onChangeText={(value) => setField('ownerName', value)} style={styles.fieldGap} />
      <TextField label={t.land.quarter} value={form.quarter} onChangeText={(value) => setField('quarter', value)} style={styles.fieldGap} />
      <TextField label={t.admin.areaSqm} value={form.areaSqm} onChangeText={(value) => setField('areaSqm', value)} keyboardType="decimal-pad" style={styles.fieldGap} />
      <TextField label={t.admin.latitude} value={form.gpsLat} onChangeText={(value) => setField('gpsLat', value)} keyboardType="decimal-pad" style={styles.fieldGap} />
      <TextField label={t.admin.longitude} value={form.gpsLng} onChangeText={(value) => setField('gpsLng', value)} keyboardType="decimal-pad" style={styles.fieldGap} />
      <TextField label={t.admin.approvedYear} value={form.titleApprovedYear} onChangeText={(value) => setField('titleApprovedYear', value)} keyboardType="number-pad" style={styles.fieldGap} />
      <Text style={styles.inlineLabel}>{t.admin.landUse}</Text>
      <SegmentedControl
        options={LAND_USE_TYPES.map((type) => ({ label: landUseName(t, type), value: type }))}
        value={form.landUseType}
        onChange={(value) => setField('landUseType', value)}
      />
      <TextField label={t.admin.notes} value={form.notes} onChangeText={(value) => setField('notes', value)} multiline style={styles.fieldGap} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 17,
    marginBottom: spacing.md,
  },
  fieldGap: {
    marginTop: spacing.md,
  },
  inlineLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  ownerCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surfaceMuted,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  ownerTitle: {
    color: colors.text,
    fontWeight: '900',
  },
  remove: {
    color: colors.danger,
    fontWeight: '900',
  },
  doc: {
    color: colors.text,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
});
