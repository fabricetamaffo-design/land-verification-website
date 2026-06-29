import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { authApi, getFriendlyErrorMessage } from '../services/api';
import { commonStyles, spacing } from '../theme/styles';
import { colors } from '../theme/colors';

export function ResetPasswordScreen({ initialToken }: { initialToken?: string }) {
  const [token, setToken] = useState(initialToken || '');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { replace } = useNavigation();
  const { t } = useLanguage();

  async function submit() {
    if (loading) return;
    setFormError('');
    if (!token.trim()) {
      setFormError(t.auth.missingTokenMessage);
      return;
    }
    if (password.length < 8 || password !== confirm) {
      setFormError(t.auth.checkPasswordMessage);
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.resetPassword(token.trim(), password);
      Alert.alert(t.auth.passwordReset, result.message, [{ text: t.auth.login, onPress: () => replace({ name: 'Login' }) }]);
    } catch (err) {
      setFormError(getFriendlyErrorMessage(err, t.auth.resetExpired));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title={t.auth.resetTitle} subtitle={t.auth.resetSubtitle}>
      <View style={commonStyles.card}>
        <TextField label={t.auth.resetToken} value={token} onChangeText={setToken} multiline />
        <TextField label={t.auth.newPassword} value={password} onChangeText={setPassword} secureTextEntry style={styles.field} />
        <TextField label={t.auth.confirmPassword} value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.field} />
        {!!formError && <Notice message={formError} />}
        <Button title={t.auth.resetPassword} icon={<RotateCcw size={18} color={colors.white} />} onPress={submit} loading={loading} style={styles.button} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
});
