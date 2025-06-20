// src/screens/LocationsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import type { Location } from '../types';
import { locationsStyles } from '../styles/screens/locations.styles';
import { commonStyles } from '../styles/common';
import Button from '../components/Button';

const LocationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadLocations = async () => {
    try {
      const response = await api.getLocations();
      if (response.status === 200) {
        setLocations(response.data as Location[]);
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de charger les locations');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadLocations();
  };

  const handleAddLocation = () => {
    (navigation as any).navigate('AddLocation');
  };

  const handleLocationPress = (location: Location) => {
    (navigation as any).navigate('LocationDetails', { locationId: location.id });
  };

  const getLocationTypeLabel = (type: Location['type']) => {
    switch (type) {
      case 'headquarters':
        return 'Siège Social';
      case 'branch':
        return 'Succursale';
      case 'franchise':
        return 'Franchise';
      case 'single_location':
        return 'Location Unique';
      default:
        return type;
    }
  };

  const getStatusColor = (status: Location['status']) => {
    switch (status) {
      case 'active':
        return '#4CAF50';
      case 'inactive':
        return '#F44336';
      case 'pending':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  const renderLocationItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={locationsStyles.locationCard}
      onPress={() => handleLocationPress(item)}
    >
      <View style={locationsStyles.locationHeader}>
        <Text style={locationsStyles.locationName}>{item.name}</Text>
        <View style={[locationsStyles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={locationsStyles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={locationsStyles.locationType}>
        {getLocationTypeLabel(item.type)}
      </Text>
      
      <Text style={locationsStyles.locationAddress}>
        {item.address.street}, {item.address.city}
      </Text>
      
      <Text style={locationsStyles.locationCountry}>
        {item.address.country}
      </Text>
      
      {item.contact.manager && (
        <Text style={locationsStyles.locationManager}>
          Manager: {item.contact.manager.name}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={locationsStyles.container}>
      <View style={locationsStyles.header}>
        <Text style={locationsStyles.headerTitle}>Mes Locations</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={locationsStyles.addButton}
            onPress={handleAddLocation}
          >
            <Text style={locationsStyles.addButtonText}>+ Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => (navigation as any).replace('Login')}
            style={{ 
              backgroundColor: '#F44336', 
              paddingHorizontal: 12, 
              paddingVertical: 6, 
              borderRadius: 6 
            }}
          >
            <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={commonStyles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={commonStyles.loadingText}>Chargement des locations...</Text>
        </View>
      ) : locations.length === 0 ? (
        <View style={commonStyles.centerContainer}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>📍</Text>
          <Text style={commonStyles.emptyTitle}>Aucune location</Text>
          <Text style={commonStyles.emptySubtitle}>
            Créez votre première location pour commencer à gérer vos appareils
          </Text>
          <Button
            title="Créer ma première location"
            onPress={handleAddLocation}
            style={{ marginTop: 24 }}
          />
        </View>
      ) : (
        <FlatList
          data={locations}
          renderItem={renderLocationItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default LocationsScreen;
