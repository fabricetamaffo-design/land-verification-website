import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { KeyRound, LogOut, ShieldCheck } from 'lucide-react-native';
import { Button } from '../components/Button';
import { InfoRow } from '../components/InfoRow';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import { colors } from '../theme/colors';
import { commonStyles, spacing } from '../theme/styles';

export function ProfileScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, isAdmin, logout, changePassword } = useAuth();
  const { navigate, reset } = useNavigation();
  const { t } = useLanguage();

  async function submitPassword() {
    if (newPassword.length < 8 || newPassword !== confirm) {
      Alert.alert(t.auth.checkPasswordTitle, t.auth.checkPasswordMessage);
      return;
    }
    setLoading(true);
    try {
      const message = await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
      Alert.alert(t.profile.passwordUpdated, message);
    } catch (err) {
      Alert.alert(t.profile.updateFailed, err instanceof Error ? err.message : t.common.failed);
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <Screen title={t.nav.profile} subtitle={t.profile.loggedOutSubtitle}>
        <View style={commonStyles.card}>
          <Button title={t.auth.login} onPress={() => navigate({ name: 'Login' })} />
          <Button title={t.auth.createAccount} variant="secondary" onPress={() => navigate({ name: 'Register' })} style={styles.topGap} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen title={t.profile.title} subtitle={t.profile.subtitle}>
      <View style={styles.identity}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user.name[0]?.toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={commonStyles.card}>
        <InfoRow label={t.profile.fullName} value={user.name} />
        <InfoRow label={t.profile.email} value={user.email} />
        <InfoRow label={t.profile.role} value={user.role} />
        {isAdmin && <Button title={t.profile.openAdmin} icon={<ShieldCheck size={16} color={colors.primaryDark} />} variant="secondary" onPress={() => navigate({ name: 'AdminDashboard' })} style={styles.topGap} />}
      </View>

      <View style={commonStyles.card}>
        <Text style={commonStyles.sectionTitle}>{t.profile.changePassword}</Text>
        <TextField label={t.profile.currentPassword} value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry style={styles.topGap} />
        <TextField label={t.profile.newPassword} value={newPassword} onChangeText={setNewPassword} secureTextEntry style={styles.topGap} />
        <TextField label={t.profile.confirmNewPassword} value={confirm} onChangeText={setConfirm} secureTextEntry style={styles.topGap} />
        <Button title={t.profile.updatePassword} icon={<KeyRound size={17} color={colors.white} />} onPress={submitPassword} loading={loading} style={styles.topGap} />
      </View>

      <Button title={t.profile.logout} icon={<LogOut size={17} color={colors.white} />} variant="danger" onPress={async () => { await logout(); reset({ name: 'Home' }); }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.slate,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a7f3c1',
  },
  avatarText: {
    color: colors.primaryDark,
    fontSize: 26,
    fontWeight: '900',
  },
  name: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  email: {
    color: '#a7c7b3',
    marginTop: 3,
  },
  topGap: {
    marginTop: spacing.md,
  },
});
