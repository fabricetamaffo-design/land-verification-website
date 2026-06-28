import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { NavigationProvider } from './src/navigation/NavigationContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NavigationProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
