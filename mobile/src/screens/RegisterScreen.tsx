import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { LogIn, UserPlus } from 'lucide-react-native';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { commonStyles, spacing } from '../theme/styles';
import { colors } from '../theme/colors';
import { getFriendlyErrorMessage } from '../services/api';

export function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { replace, navigate } = useNavigation();
  const { t } = useLanguage();

  async function submit() {
    if (loading) return;
    setFormError('');
    if (password.length < 8) {
      setFormError(t.auth.passwordShortMessage);
      return;
    }
    if (password !== confirm) {
      setFormError(t.auth.passwordsMismatchMessage);
      return;
    }
    setLoading(true);
    try {
      const message = await register({ name: name.trim(), email: email.trim(), password });
      Alert.alert(t.auth.accountCreated, message, [{ text: t.auth.login, onPress: () => replace({ name: 'Login' }) }]);
    } catch (err) {
      setFormError(getFriendlyErrorMessage(err, t.common.failed));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}>
      <View style={commonStyles.card}>
        <TextField label={t.auth.fullName} value={name} onChangeText={setName} placeholder="Jean-Pierre Mbarga" />
        <TextField label={t.auth.email} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.field} />
        <TextField label={t.auth.password} value={password} onChangeText={setPassword} secureTextEntry style={styles.field} />
        <TextField label={t.auth.confirmPassword} value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.field} />
        {!!formError && <Notice message={formError} />}
        <Button title={t.auth.createAccount} icon={<UserPlus size={18} color={colors.white} />} onPress={submit} loading={loading} style={styles.button} />
        <Button title={t.auth.alreadyAccount} icon={<LogIn size={16} color={colors.primaryDark} />} variant="ghost" onPress={() => navigate({ name: 'Login' })} />
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
