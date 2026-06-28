import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyRound, LogIn, UserPlus } from 'lucide-react-native';
import { Button } from '../components/Button';
import { Notice } from '../components/Notice';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { ApiError, getFriendlyErrorMessage } from '../services/api';
import { colors } from '../theme/colors';
import { commonStyles, spacing } from '../theme/styles';

export function LoginScreen() {
  const [email, setEmail] = useState('admin@landverify.cm');
  const [password, setPassword] = useState('Admin@1234');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { replace, navigate } = useNavigation();
  const { t } = useLanguage();

  async function submit() {
    if (loading) return;
    setLoginError('');

    if (!email.trim() || !password) {
      setLoginError(t.auth.checkCredentials);
      Alert.alert(t.auth.loginFailed, t.auth.checkCredentials);
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      replace(user.role === 'ADMIN' ? { name: 'AdminDashboard' } : { name: 'Search' });
    } catch (err) {
      const message = loginMessage(err, t.auth);
      setLoginError(message);
      Alert.alert(t.auth.loginFailed, message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen title={t.auth.loginTitle} subtitle={t.auth.loginSubtitle}>
      <View style={commonStyles.card}>
        <TextField label={t.auth.email} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextField label={t.auth.password} value={password} onChangeText={setPassword} secureTextEntry style={styles.field} />
        {!!loginError && <Notice message={loginError} />}
        <Button title={t.auth.login} icon={<LogIn size={18} color={colors.white} />} onPress={submit} loading={loading} style={styles.button} />
        <Button title={t.auth.forgotPassword} icon={<KeyRound size={16} color={colors.primaryDark} />} variant="ghost" onPress={() => navigate({ name: 'ForgotPassword' })} />
        <Button title={t.auth.createAccount} icon={<UserPlus size={16} color={colors.primaryDark} />} variant="secondary" onPress={() => navigate({ name: 'Register' })} />
      </View>

      <View style={styles.demo}>
        <Text style={styles.demoTitle}>{t.auth.demoTitle}</Text>
        <Text style={styles.demoText}>admin@landverify.cm / Admin@1234</Text>
      </View>
    </Screen>
  );
}

function loginMessage(error: unknown, authText: {
  wrongCredentials: string;
  userNotFound: string;
  checkCredentials: string;
}) {
  if (error instanceof ApiError) {
    if (error.code === 'AUTH_USER_NOT_FOUND') return authText.userNotFound;
    if (error.code === 'AUTH_INVALID_CREDENTIALS') return authText.wrongCredentials;
  }
  return getFriendlyErrorMessage(error, authText.checkCredentials);
}

const styles = StyleSheet.create({
  field: {
    marginTop: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
  demo: {
    backgroundColor: colors.amberSoft,
    borderWidth: 1,
    borderColor: '#f1d38b',
    borderRadius: 10,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  demoTitle: {
    color: colors.amber,
    fontWeight: '900',
    marginBottom: 4,
  },
  demoText: {
    color: colors.text,
    fontWeight: '800',
  },
});
