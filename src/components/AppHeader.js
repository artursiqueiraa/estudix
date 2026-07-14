// ============================================================
//  ESTUDIX — AppHeader
//  Header comum a todas as telas:
//  [hambúrguer | voltar] ─────── [ícone notificações]
// ============================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, fontSize, shadows, spacing } from '../theme';

/**
 * @param {object}   props
 * @param {object}   props.navigation  — objeto de navegação do React Navigation
 * @param {boolean}  props.showBack    — exibe botão Voltar (pill) em vez do hambúrguer
 * @param {function} [props.onBack]    — override para a ação de voltar
 */
export default function AppHeader({ navigation, showBack = false, onBack }) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) { onBack(); return; }
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('BottomTabs', { screen: 'Home' });
  };

  const handleNotifications = () => {
    navigation.navigate('BottomTabs', { screen: 'Anotacoes' });
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      {/* Hambúrguer ou Voltar */}
      {showBack ? (
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={14} color={colors.text} />
          <Text style={styles.backLabel}>Voltar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Menu')}
          accessibilityLabel="Abrir menu"
        >
          <Ionicons name="menu" size={26} color={colors.text} />
        </TouchableOpacity>
      )}

      {/* Notificações */}
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={handleNotifications}
        accessibilityLabel="Ver anotações"
      >
        <Ionicons name="notifications-outline" size={22} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
    zIndex: 10,
  },
  iconBtn: {
    padding: 6,
    borderRadius: 50,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
    ...shadows.sm,
  },
  backLabel: {
    fontFamily: fontFamily.sansSemi,
    fontSize: fontSize.base,
    color: colors.text,
    marginLeft: 2,
  },
});
