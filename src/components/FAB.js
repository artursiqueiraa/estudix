// ============================================================
//  ESTUDIX — FAB (Floating Action Button)
//  Botão flutuante contextual — aparece apenas nas telas:
//    Matérias, Matéria Interna, Calendário, Anotações
//  Rótulo dinâmico por tela (replica SCREENS_WITH_FAB / FAB_LABELS do app.js)
// ============================================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, radii, shadows, spacing } from '../theme';

// Replica exatamente FAB_LABELS do app.js original
const FAB_LABELS = {
  Materias:       'Nova Matéria',
  MateriaInterna: 'Adicionar Elemento',
  Calendario:     'Novo Evento',
  Anotacoes:      'Nova Anotação',
};

/**
 * @param {object}   props
 * @param {string}   props.currentScreen  — nome da rota atual
 * @param {function} props.onPress        — callback ao pressionar
 */
export default function FAB({ currentScreen, onPress, customLabel }) {
  const insets = useSafeAreaInsets();
  const label = customLabel || FAB_LABELS[currentScreen];

  // Não renderiza se a tela não for uma das que exibem o FAB
  if (!label) return null;

  return (
    <TouchableOpacity
      style={[styles.fab, { bottom: insets.bottom + 70 }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Ionicons name="add" size={18} color={colors.offWhite} />
      <Text style={styles.fabLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    backgroundColor: colors.primary,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: radii.xl,
    ...shadows.primaryBtn,
    zIndex: 50,
  },
  fabLabel: {
    fontFamily: fontFamily.sansSemi,
    fontSize: fontSize.base,
    color: colors.offWhite,
  },
});
