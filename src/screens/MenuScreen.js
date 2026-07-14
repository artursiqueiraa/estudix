import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, fontFamily, fontSize, spacing, radii, shadows } from '../theme';
import { useEstudix, getGreeting } from '../context/EstudixContext';

const { width } = Dimensions.get('window');

const NAV_ITEMS = [
  { label: 'Home',              icon: 'home-outline',      screen: 'BottomTabs',   tab: 'Home'         },
  { label: 'Gerenciar Matérias',icon: 'book-outline',      screen: 'BottomTabs',   tab: 'Materias'     },
  { label: 'Cronômetro Foco',   icon: 'time-outline',      screen: 'BottomTabs',   tab: 'Foco'         },
  { label: 'Calendário',        icon: 'calendar-outline',  screen: 'Calendario',   tab: null           },
  { divider: true },
  { label: 'Configurações',     icon: 'settings-outline',  screen: 'Configuracoes',tab: null           },
];

export default function MenuScreen() {
  const navigation = useNavigation();
  const { state } = useEstudix();
  const { userName } = state.settings;
  const saudacao = getGreeting();
  
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 12
    }).start();
  }, []);

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    });
  };

  const handleNav = (item) => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      navigation.goBack(); // Fecha modal
      if (item.screen === 'BottomTabs') {
        navigation.navigate('BottomTabs', { screen: item.tab });
      } else {
        navigation.navigate(item.screen);
      }
    });
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={closeMenu} />
      
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>Menu Principal</Text>
          <TouchableOpacity onPress={closeMenu} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.profileName}>{saudacao}, {userName} ☕</Text>
            <Text style={styles.profileSub}>Foco e disciplina!</Text>
          </View>
        </View>

        <ScrollView style={styles.nav} showsVerticalScrollIndicator={false}>
          {NAV_ITEMS.map((item, idx) => {
            if (item.divider) {
              return <View key={`div-${idx}`} style={styles.divider} />;
            }
            return (
              <TouchableOpacity
                key={item.label}
                style={styles.navLink}
                onPress={() => handleNav(item)}
                activeOpacity={0.7}
              >
                <View style={styles.navIcon}>
                  <Ionicons name={item.icon} size={18} color={'#5A5A5A'} />
                </View>
                <Text style={styles.navLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.quoteCard}>
          <Ionicons name="sparkles-outline" size={20} color={colors.accent} />
          <Text style={styles.quoteText}>
            Pequenas ações diárias geram grandes resultados.
          </Text>
          <View style={styles.quoteUnderline} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  drawer: {
    width: '78%',
    height: '100%',
    backgroundColor: colors.bg,
    paddingTop: 48,
    ...shadows.lg,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  menuTitle: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize.h2,
    color: colors.text,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 50,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.warmLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontFamily: fontFamily.sansBold,
    fontSize: 14,
    color: colors.text,
  },
  profileSub: {
    fontFamily: fontFamily.sans,
    fontSize: 12,
    color: colors.subtext,
    marginTop: 2,
  },
  nav: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 8,
  },
  navLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    marginBottom: 2,
  },
  navIcon: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontFamily: fontFamily.sansMedium,
    fontSize: fontSize.lg,
    color: '#5A5A5A',
  },
  quoteCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    marginHorizontal: 16,
    marginBottom: 48,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    ...shadows.sm,
  },
  quoteText: {
    fontFamily: fontFamily.serifRegular,
    fontSize: 13,
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 21,
  },
  quoteUnderline: {
    width: 30,
    height: 2,
    backgroundColor: colors.warmMid,
    borderRadius: 2,
  },
});
