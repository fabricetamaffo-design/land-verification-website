import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyRound, RotateCcw } from 'lucide-react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { authApi } from '../services/api';
import { colors } from '../theme/colors';
import { commonStyles, spacing } from '../theme/styles';

function tokenFromResetUrl(resetUrl?: string) {
  if (!resetUrl) return '';
  const match = resetUrl.match(/[?&]token=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation();
  const { t } = useLanguage();

  async function submit() {
    setLoading(true);
    try {
      const result = await authApi.forgotPassword(email.trim());
      const resetToken = tokenFromResetUrl(result.resetUrl);
      setToken(resetToken);
      Alert.alert(t.auth.resetGenerated, result.message);
    } catch (err) {
      Alert.alert(t.auth.resetFailed, err instanceof Error ? err.message : t.common.failed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title={t.auth.forgotTitle} subtitle={t.auth.forgotSubtitle}>
      <View style={commonStyles.card}>
        <TextField label={t.auth.email} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <Button title={t.auth.generateReset} icon={<KeyRound size={18} color={colors.white} />} onPress={submit} loading={loading} style={styles.button} />
      </View>

      {!!token && (
        <View style={styles.tokenCard}>
          <Text style={styles.tokenTitle}>{t.auth.demoTokenReady}</Text>
          <Text numberOfLines={3} style={styles.token}>{token}</Text>
          <Button title={t.auth.resetPassword} icon={<RotateCcw size={18} color={colors.white} />} onPress={() => navigate({ name: 'ResetPassword', token })} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.lg,
  },
  tokenCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.amberSoft,
    borderRadius: 10,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#f1d38b',
    gap: spacing.md,
  },
  tokenTitle: {
    color: colors.amber,
    fontWeight: '900',
  },
  token: {
    color: colors.text,
    fontSize: 12,
  },
});
