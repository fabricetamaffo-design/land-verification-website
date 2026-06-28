import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertCircle, Info } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/styles';

type NoticeVariant = 'danger' | 'info';

export function Notice({ message, variant = 'danger' }: { message: string; variant?: NoticeVariant }) {
  const danger = variant === 'danger';
  const Icon = danger ? AlertCircle : Info;

  return (
    <View style={[styles.wrap, danger ? styles.danger : styles.info]}>
      <View style={[styles.icon, danger ? styles.dangerIcon : styles.infoIcon]}>
        <Icon size={17} color={danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.text, danger ? styles.dangerText : styles.infoText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'flex-start',
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
    padding: spacing.md,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#efb8b8',
  },
  info: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.borderStrong,
  },
  icon: {
    alignItems: 'center',
    borderRadius: radii.sm,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  dangerIcon: {
    backgroundColor: '#fff6f6',
  },
  infoIcon: {
    backgroundColor: colors.surface,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  dangerText: {
    color: colors.danger,
  },
  infoText: {
    color: colors.primaryDark,
  },
});
