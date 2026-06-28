import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SearchX } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { commonStyles, spacing } from '../theme/styles';
import { Button } from './Button';

export function StateView({
  title,
  message,
  loading,
  actionLabel,
  onAction,
}: {
  title: string;
  message?: string;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={[commonStyles.card, styles.wrap]}>
      {loading ? <ActivityIndicator color={colors.primary} /> : <SearchX size={30} color={colors.primary} />}
      <Text style={styles.title}>{title}</Text>
      {!!message && <Text style={styles.message}>{message}</Text>}
      {!!actionLabel && onAction && <Button title={actionLabel} onPress={onAction} variant="secondary" />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 32,
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
