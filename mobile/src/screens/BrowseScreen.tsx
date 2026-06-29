import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapPinned } from 'lucide-react-native';
import { Button } from '../components/Button';
import { LandCard } from '../components/LandCard';
import { Notice } from '../components/Notice';
import { Screen } from '../components/Screen';
import { SegmentedControl } from '../components/SegmentedControl';
import { StateView } from '../components/StateView';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../navigation/NavigationContext';
import { getFriendlyErrorMessage, landApi } from '../services/api';
import type { SearchResult } from '../shared';
import { colors } from '../theme/colors';
import { commonStyles, spacing } from '../theme/styles';

const ALL_QUARTERS = '__all__';

const SAMPLE_LANDS: SearchResult[] = [
  { id: 'sample-bastos', titleNumber: 'SAMPLE-001', ownerName: 'Protected', quarter: 'Bastos', areaSqm: 500, status: 'VALID', notes: null, gpsLat: 0, gpsLng: 0, titleApprovedYear: 2020, landUseType: 'RESIDENTIAL', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'sample-nlongkak', titleNumber: 'SAMPLE-002', ownerName: 'Protected', quarter: 'Nlongkak', areaSqm: 300, status: 'VALID', notes: null, gpsLat: 0, gpsLng: 0, titleApprovedYear: 2019, landUseType: 'COMMERCIAL', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'sample-melen', titleNumber: 'SAMPLE-003', ownerName: 'Protected', quarter: 'Melen', areaSqm: 750, status: 'SUSPICIOUS', notes: null, gpsLat: 0, gpsLng: 0, titleApprovedYear: 2018, landUseType: 'AGRICULTURAL', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'sample-bonanjo', titleNumber: 'SAMPLE-004', ownerName: 'Protected', quarter: 'Bonanjo', areaSqm: 620, status: 'VALID', notes: null, gpsLat: 0, gpsLng: 0, titleApprovedYear: 2021, landUseType: 'COMMERCIAL', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'sample-akwa', titleNumber: 'SAMPLE-005', ownerName: 'Protected', quarter: 'Akwa', areaSqm: 410, status: 'VALID', notes: null, gpsLat: 0, gpsLng: 0, titleApprovedYear: 2022, landUseType: 'RESIDENTIAL', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 'sample-bafoussam', titleNumber: 'SAMPLE-006', ownerName: 'Protected', quarter: 'Bafoussam Centre', areaSqm: 880, status: 'VALID', notes: null, gpsLat: 0, gpsLng: 0, titleApprovedYear: 2017, landUseType: 'MIXED', createdAt: '2026-01-01T00:00:00.000Z' },
];

export function BrowseScreen({ initialQuarter }: { initialQuarter?: string }) {
  const [quarter, setQuarter] = useState(initialQuarter && initialQuarter !== 'All' ? initialQuarter : ALL_QUARTERS);
  const [quarters, setQuarters] = useState<string[]>([]);
  const [lands, setLands] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState('');
  const { navigate } = useNavigation();
  const { t } = useLanguage();
  const { isAdmin } = useAuth();

  async function load(nextQuarter = quarter, nextPage = 1, append = false) {
    setLoading(true);
    setError('');
    if (!isAdmin) {
      const sampleQuarters = Array.from(new Set(SAMPLE_LANDS.map((land) => land.quarter))).sort();
      const filtered = nextQuarter === ALL_QUARTERS
        ? SAMPLE_LANDS
        : SAMPLE_LANDS.filter((land) => land.quarter === nextQuarter);
      setQuarters(sampleQuarters);
      setLands(filtered);
      setPage(1);
      setTotalPages(1);
      setLoading(false);
      return;
    }
    try {
      const selected = nextQuarter === ALL_QUARTERS ? undefined : nextQuarter;
      const [quarterData, landData] = await Promise.all([
        quarters.length ? Promise.resolve({ quarters }) : landApi.quarters(),
        landApi.browse(selected, nextPage),
      ]);
      setQuarters(quarterData.quarters);
      setLands((current) => append ? [...current, ...landData.results] : landData.results);
      setPage(landData.page || nextPage);
      setTotalPages(landData.totalPages || 0);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, t.browse.failed));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setQuarter(ALL_QUARTERS);
    load(ALL_QUARTERS);
  }, [isAdmin]);

  const options = [
    { label: t.browse.all, value: ALL_QUARTERS },
    ...quarters.map((q) => ({ label: q, value: q })),
  ];

  return (
    <Screen title={t.browse.title} subtitle={t.browse.subtitle}>
      {!isAdmin && (
        <View style={commonStyles.card}>
          <Text style={styles.privacyTitle}>{t.browse.privacyTitle}</Text>
          <Text style={commonStyles.body}>{t.browse.privacyMessage}</Text>
        </View>
      )}
      <View style={commonStyles.card}>
        <View style={styles.filterHeader}>
          <MapPinned size={21} color={colors.primary} />
          <Text style={styles.filterLabel}>{t.browse.quarter}</Text>
        </View>
        <SegmentedControl
          options={options.length ? options : [{ label: t.browse.all, value: ALL_QUARTERS }]}
          value={quarter}
          onChange={(value) => {
            setQuarter(value);
            load(value);
          }}
        />
      </View>

      {!!error && <Notice message={error} />}
      {!!lands.length && <Text style={styles.count}>{lands.length} {lands.length === 1 ? t.browse.activeSingular : t.browse.activePlural}</Text>}
      {loading && !lands.length && <StateView title={t.browse.loading} loading />}
      {!loading && !lands.length && <StateView title={t.browse.noneTitle} message={t.browse.noneMessage} />}
      {lands.map((land) => (
        <LandCard
          key={land.id}
          land={land}
          admin={isAdmin}
          onPress={() => isAdmin
            ? navigate({ name: 'LandDetail', id: land.id })
            : navigate({ name: 'Search' })}
        />
      ))}
      {page < totalPages && (
        <Button title={t.browse.loadMore} variant="secondary" loading={loading} onPress={() => load(quarter, page + 1, true)} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterLabel: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  count: {
    color: colors.primary,
    fontWeight: '900',
    marginVertical: spacing.md,
  },
  privacyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
});
