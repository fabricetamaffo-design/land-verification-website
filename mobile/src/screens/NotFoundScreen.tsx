import React from 'react';
import { View } from 'react-native';
import { Button } from '../components/Button';
import { Screen } from '../components/Screen';
import { StateView } from '../components/StateView';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../navigation/NavigationContext';

export function NotFoundScreen() {
  const { reset } = useNavigation();
  const { t } = useLanguage();
  return (
    <Screen>
      <View>
        <StateView
          title={t.common.screenNotFound}
          message={t.common.screenNotFoundMessage}
        />
        <Button title={t.common.goHome} onPress={() => reset({ name: 'Home' })} />
      </View>
    </Screen>
  );
}
