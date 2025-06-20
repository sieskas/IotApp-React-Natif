// src/screens/LocationManagementScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles/common';

const LocationManagementScreen: React.FC = () => {
  const navigation = useNavigation();

  const menuItems = [
    {
      title: 'Voir toutes les locations',
      description: 'Consulter la liste de toutes les locations',
      onPress: () => (navigation as any).navigate('Locations'),
      icon: '📍',
    },
    {
      title: 'Ajouter une location',
      description: 'Créer une nouvelle location',
      onPress: () => (navigation as any).navigate('AddLocation'),
      icon: '➕',
    },
  ];

  return (
    <View style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Gestion des Locations</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={commonStyles.card}
            onPress={item.onPress}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 24, marginRight: 16 }}>{item.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={commonStyles.cardTitle}>{item.title}</Text>
                <Text style={commonStyles.cardSubtitle}>{item.description}</Text>
              </View>
              <Text style={{ fontSize: 18, color: '#007AFF' }}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default LocationManagementScreen;
