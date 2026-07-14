// ============================================================
//  ESTUDIX — FocoScreen (Paridade 100% Web)
// ============================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '../components/AppHeader';
import { useEstudix, pad } from '../context/EstudixContext';
import { scheduleFocusEndNotification, cancelNotification } from '../lib/notifications';
import { colors, fontFamily, fontSize, radii, spacing, shadows } from '../theme';

const MODE_LABELS = {
  focus: 'Foco',
  short_break: 'Curta',
  long_break: 'Longa'
};

const MODE_COLORS = {
  focus: colors.primary,
  short_break: colors.secondary,
  long_break: '#5B7F4F'
};

const RING_SIZE = 260;
const RING_STROKE = 10;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function FocoScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { state, updateTimer, getSessionDuration, finishTimerSession, setFocusMateria } = useEstudix();
  const { timer, materias } = state;

  const progressAnim = useRef(new Animated.Value(1)).current;
  const notificationIdRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (timer.isRunning && timer.remainingSeconds > 0) {
      interval = setInterval(() => {
        updateTimer({ remainingSeconds: timer.remainingSeconds - 1 });
      }, 1000);
    } else if (timer.isRunning && timer.remainingSeconds === 0) {
      notificationIdRef.current = null;
      finishTimerSession();
    }
    return () => clearInterval(interval);
  }, [timer.isRunning, timer.remainingSeconds]);

  useEffect(() => {
    const fraction = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 0;
    Animated.timing(progressAnim, {
      toValue: fraction,
      duration: 950,
      easing: Easing.linear,
      useNativeDriver: false, // strokeDashoffset não roda na thread nativa
    }).start();
  }, [timer.remainingSeconds, timer.totalSeconds]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [RING_CIRCUMFERENCE, 0],
  });

  const toggleTimer = async () => {
    const startingNow = !timer.isRunning;
    updateTimer({ isRunning: startingNow });

    if (startingNow) {
      const isFocusSession = timer.sessionType === 'focus';
      notificationIdRef.current = await scheduleFocusEndNotification(
        timer.remainingSeconds,
        isFocusSession ? 'Sessão de foco concluída! 🎉' : 'Intervalo concluído! 💪',
        isFocusSession ? 'Hora de fazer uma pausa.' : 'Hora de voltar a focar.'
      );
    } else {
      cancelNotification(notificationIdRef.current);
      notificationIdRef.current = null;
    }
  };

  const resetTimer = () => {
    cancelNotification(notificationIdRef.current);
    notificationIdRef.current = null;
    updateTimer({
      isRunning: false,
      remainingSeconds: timer.totalSeconds,
    });
  };

  const mins = Math.floor(timer.remainingSeconds / 60);
  const secs = timer.remainingSeconds % 60;
  const timeString = `${pad(mins)}:${pad(secs)}`;
  const activeColor = MODE_COLORS[timer.sessionType] || colors.primary;

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <AppHeader navigation={navigation} showBack={false} />

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Foco Total ⏳</Text>
        <Text style={styles.subtitle}>Desconecte-se e concentre-se no agora.</Text>

        {materias.length > 0 && (
          <View style={styles.materiaSelectorBlock}>
            <Text style={styles.materiaSelectorLabel}>Estudando</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.materiaChipsRow}>
              {materias.map((mat) => {
                const isActive = timer.materiaId === mat.id;
                return (
                  <TouchableOpacity
                    key={mat.id}
                    style={[styles.materiaChip, isActive && { backgroundColor: mat.color, borderColor: mat.color }]}
                    onPress={() => setFocusMateria(isActive ? null : mat.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={mat.icon} size={13} color={isActive ? colors.offWhite : mat.color} />
                    <Text style={[styles.materiaChipText, isActive && { color: colors.offWhite }]}>{mat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        <View style={styles.sessionTypeBar}>
          {Object.keys(MODE_LABELS).map((key) => {
            const isActive = timer.sessionType === key;
            return (
              <TouchableOpacity
                key={key}
                style={[styles.sessionTypeBtn, isActive && styles.sessionTypeBtnActive]}
                onPress={() => {
                  cancelNotification(notificationIdRef.current);
                  notificationIdRef.current = null;
                  const duration = getSessionDuration(key);
                  updateTimer({
                    isRunning: false,
                    sessionType: key,
                    remainingSeconds: duration,
                    totalSeconds: duration
                  });
                }}
                activeOpacity={0.8}
              >
                <Text style={[styles.sessionTypeBtnText, isActive && styles.sessionTypeBtnTextActive]}>
                  {MODE_LABELS[key]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.timerContainer}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={colors.warmLight}
              strokeWidth={RING_STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RING_RADIUS}
              stroke={activeColor}
              strokeWidth={RING_STROKE}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${RING_CIRCUMFERENCE}, ${RING_CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.timerCenterOverlay} pointerEvents="none">
            <Text style={styles.timerDisplay}>{timeString}</Text>
          </View>
        </View>

        <View style={styles.timerControls}>
          <TouchableOpacity
            style={[styles.timerMainBtn, { backgroundColor: activeColor }]}
            onPress={toggleTimer}
            activeOpacity={0.85}
          >
            <Text style={styles.timerMainBtnText}>{timer.isRunning ? 'PAUSAR' : 'INICIAR'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.timerResetBtn} onPress={resetTimer}>
            <Ionicons name="refresh" size={24} color={colors.subtext} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.sessionDotsRow}>
          {[0,1,2,3].map((i) => (
            <View
              key={i}
              style={[
                styles.sessionDot,
                i < timer.cyclePosition && styles.sessionDotDone,
                i === timer.cyclePosition && timer.sessionType === 'focus' && styles.sessionDotCurrent
              ]}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamily.serif,
    fontSize: 30,
    color: colors.text,
    marginBottom: 6,
    width: '100%',
    textAlign: 'left'
  },
  subtitle: {
    fontFamily: fontFamily.sans,
    fontSize: 13,
    color: colors.subtext,
    width: '100%',
    textAlign: 'left',
    marginBottom: 30
  },

  materiaSelectorBlock: {
    width: '100%',
    marginBottom: 18,
  },
  materiaSelectorLabel: {
    fontFamily: fontFamily.sansBold,
    fontSize: fontSize.xs,
    color: colors.subtext,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  materiaChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  materiaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bgCard,
  },
  materiaChipText: {
    fontFamily: fontFamily.sansSemi,
    fontSize: 12,
    color: colors.text,
  },

  sessionTypeBar: {
    flexDirection: 'row',
    backgroundColor: colors.warmLight,
    borderRadius: radii.xl,
    padding: 4,
    marginBottom: 30,
    width: '100%',
  },
  sessionTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  sessionTypeBtnActive: {
    backgroundColor: colors.bgCard,
    ...shadows.sm,
  },
  sessionTypeBtnText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 13,
    color: colors.subtext,
  },
  sessionTypeBtnTextActive: {
    color: colors.primary,
  },

  timerContainer: {
    width: 260,
    height: 260,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  timerCenterOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerDisplay: {
    fontFamily: fontFamily.sansBold,
    fontSize: 58,
    color: colors.text,
    letterSpacing: -1,
  },

  timerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 30,
  },
  timerMainBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: radii.pill,
    ...shadows.primaryBtn,
  },
  timerMainBtnText: {
    fontFamily: fontFamily.sansBold,
    fontSize: 16,
    color: colors.offWhite,
    letterSpacing: 1,
  },
  timerResetBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.warmLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sessionDotsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  sessionDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border,
  },
  sessionDotDone: {
    backgroundColor: colors.accent,
  },
  sessionDotCurrent: {
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: 'transparent',
  }
});
