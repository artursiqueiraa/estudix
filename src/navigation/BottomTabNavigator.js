// ============================================================
//  ESTUDIX — BottomTabNavigator
//  4 tabs: Home, Matérias, Foco, Anotações
//  Ícone filled quando ativo, outline quando inativo
//  Replica exatamente updateTabBar() do app.js original
// ============================================================

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontFamily, fontSize, shadows } from '../theme';

import HomeScreen        from '../screens/HomeScreen';
import MateriasScreen    from '../screens/MateriasScreen';
import FocoScreen        from '../screens/FocoScreen';
import AnotacoesScreen   from '../screens/AnotacoesScreen';

const Tab = createBottomTabNavigator();

// Mapeamento ícone outline → filled (igual ao app.js original)
const TAB_ICONS = {
  Home:     { active: 'home',          inactive: 'home-outline'          },
  Materias: { active: 'book',          inactive: 'book-outline'          },
  Foco:     { active: 'time',          inactive: 'time-outline'          },
  Anotacoes:{ active: 'document-text', inactive: 'document-text-outline' },
};

function TabIcon({ routeName, focused, color, size }) {
  const icons = TAB_ICONS[routeName] || { active: 'ellipse', inactive: 'ellipse-outline' };
  return (
    <Ionicons
      name={focused ? icons.active : icons.inactive}
      size={size}
      color={color}
    />
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,   // label visível só na tab ativa (customizada abaixo)
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => (
          <TabIcon routeName={route.name} focused={focused} color={color} size={size} />
        ),
        // Label personalizado: visível apenas na tab ativa
        tabBarLabel: ({ focused, color, children }) => {
          if (!focused) return null;
          return (
            <View style={styles.labelWrap}>
              {/* empty — label opcional, mantemos apenas ícone por padrão */}
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarAccessibilityLabel: 'Home' }}
      />
      <Tab.Screen
        name="Materias"
        component={MateriasScreen}
        options={{ tabBarAccessibilityLabel: 'Matérias' }}
      />
      <Tab.Screen
        name="Foco"
        component={FocoScreen}
        options={{ tabBarAccessibilityLabel: 'Foco' }}
      />
      <Tab.Screen
        name="Anotacoes"
        component={AnotacoesScreen}
        options={{ tabBarAccessibilityLabel: 'Anotações' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 82 : 62,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    ...shadows.sm,
  },
  labelWrap: {
    height: 2,
  },
});
