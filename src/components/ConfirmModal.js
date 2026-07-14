// ============================================================
//  ESTUDIX — ConfirmModal
//  Diálogo de confirmação/aviso com a cara do app — substitui
//  o Alert.alert nativo do sistema operacional.
//  Disparado globalmente via useEstudix().showConfirm(...)
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { colors, fontFamily, fontSize, radii, spacing, shadows } from '../theme';

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  hideCancel = false,
  destructive = false,
  onCancel,
  onConfirmPress,
}) {
  return (
    <Modal visible={!!visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.actions}>
            {!hideCancel && (
              <TouchableOpacity style={styles.btnCancel} onPress={onCancel} activeOpacity={0.7}>
                <Text style={styles.btnCancelText}>{cancelLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.btnConfirm, destructive && styles.btnDestructive]}
              onPress={onConfirmPress}
              activeOpacity={0.85}
            >
              <Text style={styles.btnConfirmText}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  content: { backgroundColor: colors.bgCard, width: '85%', borderRadius: radii.lg, padding: spacing.xl, ...shadows.md },
  title: { fontFamily: fontFamily.serif, fontSize: fontSize.h2, color: colors.text },
  message: { fontFamily: fontFamily.sans, fontSize: fontSize.sm, color: colors.subtext, marginTop: spacing.xs, lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md, marginTop: spacing.xl },
  btnCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  btnCancelText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.md, color: colors.subtext },
  btnConfirm: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  btnDestructive: { backgroundColor: colors.danger },
  btnConfirmText: { fontFamily: fontFamily.sansMedium, fontSize: fontSize.md, color: colors.offWhite },
});
