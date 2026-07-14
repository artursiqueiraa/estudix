// ============================================================
//  ESTUDIX — Toast
//  Feedback rápido e não-bloqueante, estilizado com o design
//  system do app (substitui Alert.alert para mensagens simples)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, radii } from '../theme';

export default function Toast({ message }) {
  const insets = useSafeAreaInsets();
  if (!message) return null;

  return (
    <View style={[styles.toast, { bottom: insets.bottom + 84 }]} pointerEvents="none">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    left: 20,
    right: 20,
    backgroundColor: 'rgba(43, 43, 43, 0.94)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: radii.lg,
    zIndex: 999,
    alignItems: 'center',
  },
  text: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.md,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 20,
  },
});
