import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LandStatus } from '../shared';
import { isValidStatus } from '../shared';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../theme/colors';
import { statusName } from '../utils/localized';

export function StatusBadge({ status, admin = false }: { status: LandStatus; admin?: boolean }) {
  const { t } = useLanguage();
  const valid = isValidStatus(status);
  const label = statusName(t, status, admin);
  return (
    <View style={[styles.badge, valid ? styles.valid : styles.notValid]}>
      <View style={[styles.dot, valid ? styles.validDot : styles.notValidDot]} />
      <Text style={[styles.text, valid ? styles.validText : styles.notValidText]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  valid: {
    backgroundColor: colors.primarySoft,
    borderColor: '#a8dec0',
  },
  notValid: {
    backgroundColor: colors.dangerSoft,
    borderColor: '#f3b6b6',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  validDot: {
    backgroundColor: colors.primary,
  },
  notValidDot: {
    backgroundColor: colors.danger,
  },
  text: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0,
  },
  validText: {
    color: colors.primaryDark,
  },
  notValidText: {
    color: colors.danger,
  },
});
