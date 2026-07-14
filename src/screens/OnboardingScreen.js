// ============================================================
//  ESTUDIX — OnboardingScreen
//  Primeiro contato com o app: nome + primeira matéria.
//  Some para sempre depois que settings.onboarded = true.
// ============================================================

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useEstudix, EDUCATION_LEVELS, GOALS } from '../context/EstudixContext';
import ChipSelector from '../components/ChipSelector';
import { colors, fontFamily, fontSize, radii, spacing, shadows } from '../theme';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { completeOnboarding, saveMateria } = useEstudix();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [educationLevel, setEducationLevelLocal] = useState(null);
  const [goal, setGoalLocal] = useState(null);
  const [materiaName, setMateriaName] = useState('');

  const goToStep2 = () => setStep(1);
  const goToStep3 = () => setStep(2);

  const finish = () => {
    if (materiaName.trim()) saveMateria(materiaName.trim());
    completeOnboarding(name.trim(), educationLevel, goal);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.dotsRow}>
        <View style={[styles.dot, step === 0 && styles.dotActive]} />
        <View style={[styles.dot, step === 1 && styles.dotActive]} />
        <View style={[styles.dot, step === 2 && styles.dotActive]} />
      </View>

      {step === 0 ? (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="school" size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Bem-vindo ao Estudix</Text>
          <Text style={styles.subtitle}>
            Organize matérias, notas, flashcards e sessões de foco num só lugar. Pra começar, como podemos te chamar?
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
            placeholderTextColor={colors.subtext}
            autoFocus
            returnKeyType="next"
            onSubmitEditing={goToStep2}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, !name.trim() && styles.primaryBtnDisabled]}
            onPress={goToStep2}
            disabled={!name.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.offWhite} />
          </TouchableOpacity>
        </View>
      ) : step === 1 ? (
        <ScrollView contentContainerStyle={styles.profileContent} showsVerticalScrollIndicator={false}>
          <View style={styles.iconCircle}>
            <Ionicons name="ribbon-outline" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Só mais um pouco, {name.trim()}</Text>
          <Text style={styles.subtitle}>
            Isso ajuda o Estudix a sugerir matérias e dicas certas para você.
          </Text>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Nível de escolaridade</Text>
            <ChipSelector options={EDUCATION_LEVELS} selected={educationLevel} onToggle={setEducationLevelLocal} />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Seu objetivo</Text>
            <ChipSelector options={GOALS} selected={goal} onToggle={setGoalLocal} />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={goToStep3} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>{educationLevel || goal ? 'Continuar' : 'Pular por agora'}</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.offWhite} />
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <Ionicons name="book" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>Prazer, {name.trim()}! 👋</Text>
          <Text style={styles.subtitle}>
            Qual é a primeira matéria que você quer organizar? Você pode adicionar as outras depois.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Ex: Matemática"
            value={materiaName}
            onChangeText={setMateriaName}
            placeholderTextColor={colors.subtext}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={finish}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={finish} activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>{materiaName.trim() ? 'Começar a estudar' : 'Pular por agora'}</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.offWhite} />
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  dotsRow: { flexDirection: 'row', gap: 6, alignSelf: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },

  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 },
  fieldBlock: { width: '100%', marginBottom: spacing.lg },
  fieldLabel: {
    fontFamily: fontFamily.sansBold, fontSize: fontSize.sm, color: colors.subtext,
    textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  iconCircle: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.warmLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 22,
  },
  title: {
    fontFamily: fontFamily.serif, fontSize: 26, color: colors.text,
    textAlign: 'center', marginBottom: 10,
  },
  subtitle: {
    fontFamily: fontFamily.sans, fontSize: 14, color: colors.subtext,
    textAlign: 'center', lineHeight: 21, maxWidth: 300, marginBottom: 32,
  },
  input: {
    width: '100%', backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.sm, paddingHorizontal: spacing.md, paddingVertical: 14,
    fontFamily: fontFamily.sansMedium, fontSize: fontSize.lg, color: colors.text,
    textAlign: 'center', marginBottom: 20, ...shadows.sm,
  },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, paddingVertical: 15, paddingHorizontal: 32,
    borderRadius: radii.pill, ...shadows.primaryBtn,
  },
  primaryBtnDisabled: { opacity: 0.4 },
  primaryBtnText: {
    fontFamily: fontFamily.sansSemi, fontSize: fontSize.lg, color: colors.offWhite,
  },
});
