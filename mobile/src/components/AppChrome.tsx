import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Info, MapPinned, Search, ShieldCheck, User, LogIn } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';
import type { Route } from '../navigation/types';
import type { Translations } from '../translations/en';
import { colors, gradients } from '../theme/colors';
import { shadow, spacing } from '../theme/styles';

const tabs: Array<{ labelKey: keyof Translations['nav']; route: Route; key: string; icon: React.ReactNode }> = [
  { key: 'Home', labelKey: 'home', route: { name: 'Home' }, icon: <Home size={18} /> },
  { key: 'Search', labelKey: 'search', route: { name: 'Search' }, icon: <Search size={18} /> },
  { key: 'Browse', labelKey: 'browse', route: { name: 'Browse' }, icon: <MapPinned size={18} /> },
  { key: 'About', labelKey: 'about', route: { name: 'About' }, icon: <Info size={18} /> },
  { key: 'Profile', labelKey: 'profile', route: { name: 'Profile' }, icon: <User size={18} /> },
];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const { route, navigate, goBack, stack } = useNavigation();
  const { isAuthenticated, isAdmin } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const visibleTabs = isAdmin
    ? [...tabs, { key: 'AdminDashboard', labelKey: 'admin' as const, route: { name: 'AdminDashboard' } as Route, icon: <ShieldCheck size={18} /> }]
    : tabs;
  const routeText = t.routes[route.name as keyof Translations['routes']] || route.name;

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={gradients.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.top}>
        <Pressable onPress={stack.length > 1 ? goBack : () => navigate({ name: 'Home' })} style={styles.brand}>
          <View style={styles.logo}><Text style={styles.logoText}>LV</Text></View>
          <View>
            <Text style={styles.brandText}>LandVerifyCM</Text>
            <Text style={styles.routeText}>{routeText}</Text>
          </View>
        </Pressable>
        <View style={styles.actions}>
          <Pressable onPress={() => setLang(lang === 'en' ? 'fr' : 'en')} style={styles.lang}>
            <Text style={styles.langText}>{lang.toUpperCase()}</Text>
          </Pressable>
          {!isAuthenticated && (
            <Pressable onPress={() => navigate({ name: 'Login' })} style={styles.login}>
              <LogIn size={14} color={colors.white} />
              <Text style={styles.loginText}>{t.nav.login}</Text>
            </Pressable>
          )}
        </View>
      </LinearGradient>

      <View style={styles.body}>{children}</View>

      <View style={styles.tabs}>
        {visibleTabs.map((tab) => {
          const active = route.name === tab.key;
          return (
            <Pressable key={tab.key} onPress={() => navigate(tab.route)} style={[styles.tab, active && styles.tabActive]}>
              <View style={active ? styles.tabIconActive : styles.tabIcon}>
                {React.cloneElement(tab.icon as React.ReactElement<{ color?: string }>, { color: active ? colors.white : colors.textMuted })}
              </View>
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.nav[tab.labelKey]}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  top: {
    minHeight: 82,
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    ...shadow,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#c5f7d6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  logoText: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  brandText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0,
  },
  routeText: {
    color: '#a7c7b3',
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lang: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  langText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 12,
  },
  login: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  loginText: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 12,
  },
  body: {
    flex: 1,
  },
  tabs: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    minHeight: 74,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 7,
    ...shadow,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
    paddingHorizontal: 5,
    paddingVertical: 7,
    borderRadius: 16,
    gap: 4,
  },
  tabActive: {
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  tabIcon: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '900',
    maxWidth: 56,
  },
  tabTextActive: {
    color: colors.primary,
  },
});
