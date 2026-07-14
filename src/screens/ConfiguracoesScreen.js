// ============================================================
//  ESTUDIX — ConfiguracoesScreen (Paridade 100% Web)
// ============================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../components/AppHeader';
import ChipSelector from '../components/ChipSelector';
import { useEstudix, EDUCATION_LEVELS, GOALS, DIFFICULTIES, STUDY_METHODS } from '../context/EstudixContext';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../theme';

export default function ConfiguracoesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const {
    state, setUserName, changeSetting, clearAllData, exportData, importData, showConfirm,
    setEducationLevel, setGoal, setStudyMethod, toggleDifficulty,
  } = useEstudix();
  const { settings } = state;

  const [modalVisible, setModalVisible] = useState(false);
  const [tempName, setTempName] = useState(settings.userName);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setModalVisible(false);
    }
  };

  const handleClear = () => {
    showConfirm({
      title: 'Limpar Todos os Dados',
      message: 'Tem certeza que deseja apagar todas as matérias, notas e anotações? Esta ação não pode ser desfeita.',
      confirmLabel: 'Limpar Tudo',
      destructive: true,
      onConfirm: clearAllData,
    });
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={true} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.greetingName}>Configurações ⚙️</Text>
        
        {/* PERFIL */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="person-outline" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>PERFIL</Text>
          </View>
        </View>
        <View style={styles.settingsCard}>
          <TouchableOpacity style={styles.settingsItemClickable} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconCircle, { backgroundColor: '#1E3A5F1A' }]}>
                <Ionicons name="person-outline" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingsItemTitle}>Nome de Exibição</Text>
                <Text style={styles.settingsItemSub}>{settings.userName}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          <TouchableOpacity style={styles.settingsItemClickable} onPress={() => setProfileModalVisible(true)} activeOpacity={0.7}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconCircle, { backgroundColor: '#C97B4A1A' }]}>
                <Ionicons name="ribbon-outline" size={18} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.settingsItemTitle}>Perfil de Estudo</Text>
                <Text style={styles.settingsItemSub}>
                  {EDUCATION_LEVELS.find(l => l.id === settings.educationLevel)?.label || 'Não definido'}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
          </TouchableOpacity>
        </View>

        {/* CRONÔMETRO POMODORO */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="timer-outline" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>CRONÔMETRO POMODORO</Text>
          </View>
        </View>
        <View style={styles.settingsCard}>
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconCircle, { backgroundColor: '#5B7F4F1A' }]}>
                <Ionicons name="leaf-outline" size={18} color={colors.success} />
              </View>
              <View>
                <Text style={styles.settingsItemTitle}>Duração do Foco</Text>
                <Text style={styles.settingsItemSub}>{settings.focusMin} minutos</Text>
              </View>
            </View>
            <View style={styles.settingsStepper}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => changeSetting('focus', -5)}><Text style={styles.stepperBtnText}>−</Text></TouchableOpacity>
              <Text style={styles.stepperVal}>{settings.focusMin}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => changeSetting('focus', 5)}><Text style={styles.stepperBtnText}>+</Text></TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.settingsDivider} />
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconCircle, { backgroundColor: '#C97B4A1A' }]}>
                <Ionicons name="cafe-outline" size={18} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.settingsItemTitle}>Pausa Curta</Text>
                <Text style={styles.settingsItemSub}>{settings.shortBreakMin} minutos</Text>
              </View>
            </View>
            <View style={styles.settingsStepper}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => changeSetting('short', -1)}><Text style={styles.stepperBtnText}>−</Text></TouchableOpacity>
              <Text style={styles.stepperVal}>{settings.shortBreakMin}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => changeSetting('short', 1)}><Text style={styles.stepperBtnText}>+</Text></TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingsDivider} />
          
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconCircle, { backgroundColor: '#1E3A5F1A' }]}>
                <Ionicons name="bed-outline" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingsItemTitle}>Pausa Longa</Text>
                <Text style={styles.settingsItemSub}>{settings.longBreakMin} minutos</Text>
              </View>
            </View>
            <View style={styles.settingsStepper}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => changeSetting('long', -5)}><Text style={styles.stepperBtnText}>−</Text></TouchableOpacity>
              <Text style={styles.stepperVal}>{settings.longBreakMin}</Text>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => changeSetting('long', 5)}><Text style={styles.stepperBtnText}>+</Text></TouchableOpacity>
            </View>
          </View>
        </View>

        {/* DADOS */}
        <View style={[styles.sectionHeader, { marginTop: 16 }]}>
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="server-outline" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>DADOS E BACKUP</Text>
          </View>
        </View>
        <View style={styles.settingsCard}>
          {/* Adição Fase 4: Exportar */}
          <TouchableOpacity style={styles.settingsItemClickable} onPress={exportData} activeOpacity={0.7}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconCircle, { backgroundColor: colors.warmLight }]}>
                <Ionicons name="cloud-upload-outline" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingsItemTitle}>Exportar Backup</Text>
                <Text style={styles.settingsItemSub}>Salvar arquivo JSON</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          {/* Adição Fase 4: Importar */}
          <TouchableOpacity style={styles.settingsItemClickable} onPress={importData} activeOpacity={0.7}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconCircle, { backgroundColor: colors.warmLight }]}>
                <Ionicons name="cloud-download-outline" size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingsItemTitle}>Importar Backup</Text>
                <Text style={styles.settingsItemSub}>Restaurar arquivo JSON</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
          </TouchableOpacity>

          <View style={styles.settingsDivider} />

          {/* Limpar Dados do Web Original */}
          <TouchableOpacity style={styles.settingsItemClickable} onPress={handleClear} activeOpacity={0.7}>
            <View style={styles.settingsItemLeft}>
              <View style={[styles.settingsIconCircle, { backgroundColor: '#F3DACB' }]}>
                <Ionicons name="trash-outline" size={18} color={colors.accent} />
              </View>
              <View>
                <Text style={[styles.settingsItemTitle, { color: colors.accent }]}>Limpar Todos os Dados</Text>
                <Text style={styles.settingsItemSub}>Remove matérias, notas e flashcards</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B0B0B0" />
          </TouchableOpacity>
        </View>

        {/* SOBRE */}
        <View style={styles.appVersionBlock}>
          <Ionicons name="school-outline" size={32} color={colors.accent} style={{ marginBottom: 8 }} />
          <Text style={styles.appVersionName}>Estudix</Text>
          <Text style={styles.appVersionTag}>Versão 1.0 — Feito para estudantes 🎓</Text>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Modal Editar Nome */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nome</Text>
            <Text style={styles.modalSub}>Como prefere ser chamado?</Text>
            
            <TextInput
              style={styles.input}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Seu nome"
              placeholderTextColor={colors.subtext}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveName}>
                <Text style={styles.modalBtnSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Perfil de Estudo */}
      <Modal visible={profileModalVisible} transparent animationType="fade" onRequestClose={() => setProfileModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '82%' }]}>
            <Text style={styles.modalTitle}>Perfil de Estudo</Text>
            <Text style={styles.modalSub}>Usado para sugerir matérias e ajustar seu ritmo de estudo.</Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              <Text style={styles.profileLabel}>Nível de escolaridade</Text>
              <ChipSelector options={EDUCATION_LEVELS} selected={settings.educationLevel} onToggle={setEducationLevel} />

              <Text style={[styles.profileLabel, { marginTop: 18 }]}>Objetivo</Text>
              <ChipSelector options={GOALS} selected={settings.goal} onToggle={setGoal} />

              <Text style={[styles.profileLabel, { marginTop: 18 }]}>Dificuldades</Text>
              <ChipSelector options={DIFFICULTIES} selected={settings.difficulties} onToggle={toggleDifficulty} />

              <Text style={[styles.profileLabel, { marginTop: 18 }]}>Método de estudo preferido</Text>
              <ChipSelector options={STUDY_METHODS} selected={settings.studyMethod} onToggle={setStudyMethod} />

              <View style={[styles.settingsItem, { paddingHorizontal: 0, marginTop: 18 }]}>
                <View>
                  <Text style={styles.settingsItemTitle}>Meta Semanal</Text>
                  <Text style={styles.settingsItemSub}>{(settings.weeklyGoalMinutes / 60).toFixed(1)}h por semana</Text>
                </View>
                <View style={styles.settingsStepper}>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => changeSetting('weekly', -30)}><Text style={styles.stepperBtnText}>−</Text></TouchableOpacity>
                  <Text style={styles.stepperVal}>{settings.weeklyGoalMinutes}</Text>
                  <TouchableOpacity style={styles.stepperBtn} onPress={() => changeSetting('weekly', 30)}><Text style={styles.stepperBtnText}>+</Text></TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnSave} onPress={() => setProfileModalVisible(false)}>
                <Text style={styles.modalBtnSaveText}>Concluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { padding: 8, paddingHorizontal: 20 },
  greetingName: { fontFamily: fontFamily.serif, fontSize: 30, color: colors.text, marginBottom: 20 },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 6,
    marginBottom: 12,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionIcon: { fontSize: 14, color: colors.text, marginRight: 6 },
  sectionTitle: { fontFamily: fontFamily.sansBold, fontSize: 11, color: colors.text, letterSpacing: 1 },

  settingsCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    ...shadows.sm,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsItemClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsItemTitle: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 14,
    color: colors.text,
  },
  settingsItemSub: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  settingsDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  settingsStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.warmMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 18,
    color: colors.primary,
    lineHeight: 18,
  },
  stepperVal: {
    fontFamily: fontFamily.sansBold,
    fontSize: 15,
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
  profileLabel: {
    fontFamily: fontFamily.sansBold, fontSize: 11, color: colors.subtext,
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  },

  appVersionBlock: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  appVersionName: {
    fontFamily: fontFamily.serif,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  appVersionTag: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    color: colors.subtext,
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.bgCard, width: '85%', borderRadius: radii.lg, padding: 20, ...shadows.md },
  modalTitle: { fontFamily: fontFamily.serif, fontSize: 22, color: colors.text },
  modalSub: { fontFamily: fontFamily.sans, fontSize: 14, color: colors.subtext, marginTop: 4, marginBottom: 16 },
  input: {
    backgroundColor: colors.warmLight, borderWidth: 1, borderColor: colors.border, borderRadius: radii.sm,
    paddingHorizontal: 16, paddingVertical: 12, fontFamily: fontFamily.sansMedium, fontSize: 13,
    color: colors.text, marginBottom: 20,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalBtnCancel: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnCancelText: { fontFamily: fontFamily.sansMedium, fontSize: 14, color: colors.subtext },
  modalBtnSave: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.sm },
  modalBtnSaveText: { fontFamily: fontFamily.sansMedium, fontSize: 14, color: colors.offWhite },
});
