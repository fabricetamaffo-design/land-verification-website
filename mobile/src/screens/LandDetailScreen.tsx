import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ExternalLink, FileText, History, MapPinned, Pencil, ShieldAlert } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';
import { Button } from '../components/Button';
import { InfoRow } from '../components/InfoRow';
import { Screen } from '../components/Screen';
import { StateView } from '../components/StateView';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { getAuthHeaders, landApi, uploadPathToUrl } from '../services/api';
import type { LandDocument, LandParcel } from '../shared';
import { normalizeDocumentName } from '../shared';
import { colors, gradients } from '../theme/colors';
import { commonStyles, spacing } from '../theme/styles';
import { formatAreaLabel, formatDateLabel, landUseName, notValidReasonLabel, ownershipName } from '../utils/localized';

export function LandDetailScreen({ id }: { id: string }) {
  const [land, setLand] = useState<LandParcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [docLoading, setDocLoading] = useState('');
  const { isAdmin } = useAuth();
  const { lang, t } = useLanguage();
  const { navigate } = useNavigation();

  async function load() {
    setLoading(true);
    setError('');
    try {
      const data = await landApi.detail(id);
      setLand(data.land);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.land.unavailable);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  const mapHtml = useMemo(() => {
    if (!land) return '';
    const delta = 0.004;
    const bbox = `${land.gpsLng - delta},${land.gpsLat - delta},${land.gpsLng + delta},${land.gpsLat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${land.gpsLat},${land.gpsLng}`;
  }, [land]);

  async function openDocument(doc: LandDocument) {
    if (!isAdmin) {
      Alert.alert(t.land.adminRequiredTitle, t.land.protectedDocuments);
      return;
    }
    const fileName = normalizeDocumentName(doc.filePath);
    const target = `${FileSystem.cacheDirectory || ''}${fileName}`;
    if (!FileSystem.cacheDirectory) {
      Alert.alert(t.land.documentUnavailable, t.land.cacheUnavailable);
      return;
    }
    setDocLoading(doc.id);
    try {
      const downloaded = await FileSystem.downloadAsync(uploadPathToUrl(doc.filePath), target, {
        headers: getAuthHeaders(),
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloaded.uri);
      } else {
        await Linking.openURL(downloaded.uri);
      }
    } catch (err) {
      Alert.alert(t.land.documentUnavailable, err instanceof Error ? err.message : t.land.documentDownloadFailed);
    } finally {
      setDocLoading('');
    }
  }

  if (loading) return <Screen><StateView title={t.land.loading} loading /></Screen>;
  if (error || !land) return <Screen><StateView title={t.land.unavailable} message={error} actionLabel={t.land.tryAgain} onAction={load} /></Screen>;

  const notValid = land.status !== 'VALID';
  const protectedValue = t.land.protectedValue;
  const visibleOwner = isAdmin ? land.ownerName : protectedValue;

  return (
    <Screen title={land.titleNumber} subtitle={`${land.quarter} - ${formatAreaLabel(t, land.areaSqm)}`} refreshing={loading} onRefresh={load}>
      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[commonStyles.card, styles.headerCard]}>
        <View style={styles.headerTop}>
          <View style={styles.titleBlock}>
            <Text style={styles.kicker}>{t.land.currentOwner}</Text>
            <Text style={styles.owner}>{visibleOwner}</Text>
          </View>
          <StatusBadge status={land.status} admin={isAdmin} />
        </View>
        {notValid && (
          <View style={styles.warningBox}>
            <ShieldAlert size={18} color="#ffd4d4" />
            <Text style={styles.warning}>{isAdmin ? notValidReasonLabel(t, land.status, land.notes) : t.land.notValidReason}</Text>
          </View>
        )}
        {isAdmin && (
          <View style={styles.adminRow}>
            <Button title={t.land.edit} icon={<Pencil size={16} color={colors.primaryDark} />} variant="secondary" onPress={() => navigate({ name: 'EditLand', id: land.id })} style={styles.smallButton} />
            <Button title={t.land.audit} icon={<History size={16} color={colors.primaryDark} />} variant="secondary" onPress={() => navigate({ name: 'AuditLogs', landId: land.id, titleNumber: land.titleNumber })} style={styles.smallButton} />
          </View>
        )}
      </LinearGradient>

      <View style={commonStyles.card}>
        <SectionTitle icon={<FileText size={20} color={colors.primary} />} title={t.land.detailsTitle} />
        <InfoRow label={t.land.titleNumber} value={land.titleNumber} />
        <InfoRow label={t.land.owner} value={visibleOwner} />
        <InfoRow label={t.land.quarter} value={land.quarter} />
        <InfoRow label={t.land.area} value={formatAreaLabel(t, land.areaSqm)} />
        <InfoRow label={t.land.landUse} value={landUseName(t, land.landUseType)} />
        <InfoRow label={t.land.titleApproved} value={land.titleApprovedYear ? String(land.titleApprovedYear) : t.common.notSpecified} />
        <InfoRow label={t.land.registeredBy} value={isAdmin ? (land.uploadedBy?.name || t.common.notSpecified) : protectedValue} />
        <InfoRow label={t.land.registered} value={formatDateLabel(t, lang, land.createdAt)} />
        <InfoRow label={t.land.latitude} value={land.gpsLat.toFixed(6)} />
        <InfoRow label={t.land.longitude} value={land.gpsLng.toFixed(6)} />
      </View>

      <View style={commonStyles.card}>
        <SectionTitle icon={<MapPinned size={20} color={colors.primary} />} title={t.land.gpsTitle} />
        <View style={styles.map}>
          {Platform.OS === 'web'
            ? React.createElement('iframe', {
              src: mapHtml,
              title: t.land.gpsTitle,
              style: { border: 0, width: '100%', height: '100%' },
            } as Record<string, unknown>)
            : <WebView source={{ uri: mapHtml }} style={styles.webview} />}
        </View>
        <Button
          title={t.land.openMaps}
          icon={<ExternalLink size={16} color={colors.primaryDark} />}
          variant="secondary"
          onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${land.gpsLat},${land.gpsLng}`)}
        />
      </View>

      <View style={commonStyles.card}>
        <SectionTitle icon={<History size={20} color={colors.primary} />} title={t.land.ownershipTitle} />
        {land.ownershipHistory?.length ? land.ownershipHistory.map((record) => (
          <View key={record.id} style={styles.ownerRow}>
            <Text style={styles.ownerName}>{record.ownerName}</Text>
            <Text style={styles.ownerMeta}>
              {ownershipName(t, record.ownershipType)} - {record.fromYear} {t.common.to} {record.toYear || t.ownership.present}
            </Text>
            {!!record.notes && <Text style={commonStyles.body}>{record.notes}</Text>}
          </View>
        )) : <Text style={commonStyles.body}>{t.land.noOwnership}</Text>}
      </View>

      <View style={commonStyles.card}>
        <SectionTitle icon={<FileText size={20} color={colors.primary} />} title={t.land.documentsTitle} />
        {!isAdmin ? <Text style={commonStyles.body}>{t.land.protectedDocuments}</Text> : land.documents?.length ? land.documents.map((doc) => (
          <Pressable key={doc.id} onPress={() => openDocument(doc)} style={styles.document}>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{doc.fileName}</Text>
              <Text style={styles.ownerMeta}>{formatDateLabel(t, lang, doc.uploadedAt)}</Text>
            </View>
            <Text style={styles.docAction}>{docLoading === doc.id ? t.land.opening : t.land.open}</Text>
          </Pressable>
        )) : <Text style={commonStyles.body}>{t.land.noDocuments}</Text>}
      </View>
    </Screen>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={styles.sectionIcon}>{icon}</View>
      <Text style={commonStyles.sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerCard: {
    borderColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleBlock: {
    flex: 1,
  },
  kicker: {
    color: '#a7c7b3',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  owner: {
    color: colors.white,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: '900',
    marginTop: 4,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: spacing.md,
    backgroundColor: 'rgba(191,59,59,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,212,212,0.25)',
    padding: spacing.md,
    borderRadius: 10,
  },
  warning: {
    flex: 1,
    color: '#ffd4d4',
    lineHeight: 20,
    fontWeight: '700',
  },
  adminRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  smallButton: {
    flex: 1,
  },
  map: {
    height: 230,
    overflow: 'hidden',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.md,
  },
  webview: {
    flex: 1,
  },
  ownerRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    marginTop: spacing.md,
    gap: 4,
  },
  ownerName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  ownerMeta: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  document: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  docName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '900',
  },
  docAction: {
    color: colors.primary,
    fontWeight: '900',
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: spacing.md,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
