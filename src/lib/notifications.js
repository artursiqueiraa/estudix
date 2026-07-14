// ============================================================
//  ESTUDIX — Notificações locais
//  Fim de sessão do Pomodoro e lembrete de evento do calendário.
//  Tudo local (sem servidor push) via expo-notifications.
// ============================================================

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('estudix', {
      name: 'Estudix',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}

async function ensurePermission() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: requested } = await Notifications.requestPermissionsAsync();
  return requested === 'granted';
}

// ── Pomodoro ────────────────────────────────────────────────
export async function scheduleFocusEndNotification(seconds, title, body) {
  if (seconds <= 0) return null;
  const allowed = await ensurePermission();
  if (!allowed) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: { seconds, channelId: 'estudix' },
    });
  } catch (e) {
    console.error('Falha ao agendar notificação do timer:', e);
    return null;
  }
}

export async function cancelNotification(id) {
  if (!id) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch (e) {
    // notificação já disparou ou foi cancelada — ignora
  }
}

// ── Eventos do calendário ───────────────────────────────────
// Agenda um lembrete às 8h do dia do evento, se a data ainda não passou.
export async function scheduleEventReminder(event) {
  const allowed = await ensurePermission();
  if (!allowed) return null;

  const [y, m, d] = event.date.split('-').map(Number);
  const triggerDate = new Date(y, m - 1, d, 8, 0, 0);
  if (triggerDate.getTime() <= Date.now()) return null;

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: `Hoje: ${event.title}`,
        body: event.description || 'Não esqueça do seu compromisso.',
        sound: true,
      },
      trigger: { channelId: 'estudix', date: triggerDate },
    });
  } catch (e) {
    console.error('Falha ao agendar lembrete de evento:', e);
    return null;
  }
}
