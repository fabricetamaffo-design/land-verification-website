import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Search, ShieldCheck } from 'lucide-react-native';
import { Button } from '../components/Button';
import { LandCard } from '../components/LandCard';
import { Notice } from '../components/Notice';
import { Screen } from '../components/Screen';
import { StateView } from '../components/StateView';
import { TextField } from '../components/TextField';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { getFriendlyErrorMessage, landApi } from '../services/api';
import type { SearchResult } from '../shared';
import { colors } from '../theme/colors';
import { commonStyles, spacing } from '../theme/styles';

export function SearchScreen({ initialQuery }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { navigate } = useNavigation();
  const { t } = useLanguage();

  async function runSearch(nextPage = 1, append = false) {
    if (query.trim().length < 2) {
      setError(t.search.minLength);
      return;
    }
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await landApi.search(query.trim(), nextPage);
      setResults((current) => append ? [...current, ...data.results] : data.results);
      setPage(data.page || nextPage);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, t.search.failed));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) runSearch();
  }, []);

  return (
    <Screen title={t.search.title} subtitle={t.search.subtitle}>
      <View style={commonStyles.card}>
        <View style={styles.panelTitle}>
          <ShieldCheck size={21} color={colors.primary} />
          <Text style={styles.panelText}>{t.search.panelTitle}</Text>
        </View>
        <TextField
          label={t.search.field}
          value={query}
          onChangeText={setQuery}
          placeholder={t.search.placeholder}
          autoCapitalize="characters"
        />
        <Button title={t.search.button} icon={<Search size={18} color={colors.white} />} onPress={() => runSearch()} loading={loading} style={styles.searchButton} />
      </View>

      {!!error && <Notice message={error} />}

      {loading && !results.length && <StateView title={t.search.searching} loading />}
      {!loading && !searched && (
        <StateView title={t.search.readyTitle} message={t.search.readyMessage} />
      )}
      {!loading && searched && results.length === 0 && (
        <StateView title={t.search.noResults} message={t.search.noResultsMessage} />
      )}
      {!!results.length && <Text style={styles.count}>{results.length} {results.length === 1 ? t.search.resultSingular : t.search.resultPlural}</Text>}
      {results.map((land) => (
        <LandCard key={land.id} land={land} onPress={() => navigate({ name: 'LandDetail', id: land.id })} />
      ))}
      {page < totalPages && (
        <Button title={t.search.loadMore} variant="secondary" loading={loading} onPress={() => runSearch(page + 1, true)} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    marginTop: spacing.md,
  },
  panelTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  panelText: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 17,
  },
  count: {
    color: colors.primary,
    fontWeight: '900',
    marginVertical: spacing.md,
  },
});
