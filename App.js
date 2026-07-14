// ============================================================
//  ESTUDIX — App.js
// ============================================================

import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, StatusBar, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initNotifications } from './src/lib/notifications';

// Fontes Google
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

import { Ionicons } from '@expo/vector-icons';
import { EstudixProvider } from './src/context/EstudixContext';
import { colors, fontFamily } from './src/theme';

import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { useEstudix } from './src/context/EstudixContext';

function AppContent() {
  const { isStoreLoaded, state } = useEstudix();

  if (!isStoreLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <Ionicons name="school" size={64} color={colors.primary} style={{ marginBottom: 16 }} />
        <Text style={styles.loadingTitle}>Estudix</Text>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 24 }} />
      </View>
    );
  }

  if (!state.settings.onboarded) {
    return <OnboardingScreen />;
  }

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    initNotifications();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <EstudixProvider>
        <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
        <AppContent />
      </EstudixProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  loadingTitle: {
    fontFamily: fontFamily.serif,
    fontSize: 32,
    color: colors.text,
  }
});
