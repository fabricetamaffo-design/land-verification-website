import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppChrome } from '../components/AppChrome';
import { StateView } from '../components/StateView';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AboutScreen } from '../screens/AboutScreen';
import { BrowseScreen } from '../screens/BrowseScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LandDetailScreen } from '../screens/LandDetailScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { NotFoundScreen } from '../screens/NotFoundScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AuditLogsScreen } from '../screens/admin/AuditLogsScreen';
import { EditLandScreen } from '../screens/admin/EditLandScreen';
import { ManageLandsScreen } from '../screens/admin/ManageLandsScreen';
import { UploadLandScreen } from '../screens/admin/UploadLandScreen';
import { useNavigation } from './NavigationContext';

const adminRoutes = new Set(['AdminDashboard', 'ManageLands', 'UploadLand', 'EditLand', 'AdminUsers', 'AuditLogs']);

export function AppNavigator() {
  const { route, navigate } = useNavigation();
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <AppChrome>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      </AppChrome>
    );
  }

  let content: React.ReactNode;

  if (adminRoutes.has(route.name) && !isAdmin) {
    content = (
      <StateView
        title={t.admin.accessRequired}
        message={isAuthenticated ? t.admin.notAdmin : t.admin.loginAdmin}
        actionLabel={isAuthenticated ? t.admin.goProfile : t.auth.login}
        onAction={() => navigate(isAuthenticated ? { name: 'Profile' } : { name: 'Login' })}
      />
    );
  } else {
    switch (route.name) {
      case 'Home':
        content = <HomeScreen />;
        break;
      case 'Search':
        content = <SearchScreen initialQuery={route.query} />;
        break;
      case 'Browse':
        content = <BrowseScreen initialQuarter={route.quarter} />;
        break;
      case 'LandDetail':
        content = <LandDetailScreen id={route.id} />;
        break;
      case 'About':
        content = <AboutScreen />;
        break;
      case 'Login':
        content = <LoginScreen />;
        break;
      case 'Register':
        content = <RegisterScreen />;
        break;
      case 'ForgotPassword':
        content = <ForgotPasswordScreen />;
        break;
      case 'ResetPassword':
        content = <ResetPasswordScreen initialToken={route.token} />;
        break;
      case 'Profile':
        content = <ProfileScreen />;
        break;
      case 'AdminDashboard':
        content = <AdminDashboardScreen />;
        break;
      case 'ManageLands':
        content = <ManageLandsScreen />;
        break;
      case 'UploadLand':
        content = <UploadLandScreen />;
        break;
      case 'EditLand':
        content = <EditLandScreen id={route.id} />;
        break;
      case 'AdminUsers':
        content = <AdminUsersScreen />;
        break;
      case 'AuditLogs':
        content = <AuditLogsScreen landId={route.landId} titleNumber={route.titleNumber} />;
        break;
      case 'NotFound':
        content = <NotFoundScreen />;
        break;
      default:
        content = <NotFoundScreen />;
    }
  }

  return <AppChrome>{content}</AppChrome>;
}
