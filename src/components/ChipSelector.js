// ============================================================
//  ESTUDIX — ChipSelector
//  Grade de opções em formato de pílula, seleção única ou múltipla.
//  Usado no Onboarding e em Configurações (Perfil de Estudo).
// ============================================================
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontFamily, radii } from '../theme';

export default function ChipSelector({ options, selected, onToggle }) {
  const isActive = (id) => Array.isArray(selected) ? selected.includes(id) : selected === id;

  return (
    <View style={styles.wrap}>
      {options.map((opt) => {
        const active = isActive(opt.id);
        return (
          <TouchableOpacity
            key={opt.id}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onToggle(opt.id)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: radii.pill,
    backgroundColor: colors.bgCard, borderWidth: 1.5, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: fontFamily.sansSemi, fontSize: 13, color: colors.text },
  chipTextActive: { color: colors.offWhite },
});
