import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabNavigator  from './BottomTabNavigator';
import CalendarioScreen    from '../screens/CalendarioScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import MateriaInternaScreen from '../screens/MateriaInternaScreen';
import MenuScreen from '../screens/MenuScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
      <Stack.Screen name="Calendario" component={CalendarioScreen} />
      <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} />
      <Stack.Screen name="MateriaInterna" component={MateriaInternaScreen} />
      <Stack.Screen 
        name="Menu" 
        component={MenuScreen} 
        options={{ presentation: 'transparentModal', animation: 'fade' }} 
      />
    </Stack.Navigator>
  );
}
