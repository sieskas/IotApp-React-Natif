// src/screens/LocationDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api';
import type { Location, Device } from '../types';
import { locationDetailsStyles } from '../styles/screens/locationDetails.styles';
import { commonStyles } from '../styles/common';
import Button from '../components/Button';

interface RouteParams {
  locationId: string;
}

const LocationDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { locationId } = route.params as RouteParams;

  const [location, setLocation] = useState<Location | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'devices'>('info');

  const loadLocationData = async () => {
    try {
      const [locationResponse, devicesResponse] = await Promise.all([
        api.getLocation(locationId),
        api.getLocationDevices(locationId),
      ]);

      if (locationResponse.status === 200) {
        setLocation(locationResponse.data as Location);
      } else {
        Alert.alert('Erreur', locationResponse.error || 'Impossible de charger la location');
      }

      if (devicesResponse.status === 200) {
        setDevices(devicesResponse.data as Device[]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLocationData();
  }, [locationId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLocationData();
  };

  const handleAddDevice = () => {
    (navigation as any).navigate('AddDevice', { locationId });
  };

  const handleDevicePress = (device: Device) => {
    (navigation as any).navigate('DeviceDetails', { deviceId: device.id });
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

  const formatOpeningHours = (day: string, hours: any) => {
    if (hours?.closed) {
      return 'Fermé';
    }
    if (hours?.open && hours?.close) {
      return `${hours.open} - ${hours.close}`;
    }
    return 'Non défini';
  };

  const renderDeviceItem = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={locationDetailsStyles.deviceCard}
      onPress={() => handleDevicePress(item)}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderInfoTab = () => {
    if (!location) return null;

    return (
      <ScrollView
        style={locationDetailsStyles.tabContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={locationDetailsStyles.header}>
          <Text style={locationDetailsStyles.locationName}>{location.name}</Text>
          <View style={[locationDetailsStyles.statusBadge, { backgroundColor: getStatusColor(location.status) }]}>
            <Text style={locationDetailsStyles.statusText}>{location.status}</Text>
          </View>
        </View>

        <Text style={locationDetailsStyles.locationType}>
          {getLocationTypeLabel(location.type)}
        </Text>

        {/* Adresse */}
        <View style={locationDetailsStyles.section}>
          <Text style={locationDetailsStyles.sectionTitle}>Adresse</Text>
          <Text style={locationDetailsStyles.sectionText}>
            {location.address.street}
          </Text>
          <Text style={locationDetailsStyles.sectionText}>
            {location.address.city}, {location.address.state}
          </Text>
          <Text style={locationDetailsStyles.sectionText}>
            {location.address.postal_code}, {location.address.country}
          </Text>
        </View>

        {/* Contact */}
        <View style={locationDetailsStyles.section}>
          <Text style={locationDetailsStyles.sectionTitle}>Contact</Text>
          <Text style={locationDetailsStyles.sectionText}>
            Téléphone: {location.contact.phone}
          </Text>
          <Text style={locationDetailsStyles.sectionText}>
            Email: {location.contact.email}
          </Text>
          {location.contact.manager && (
            <>
              <Text style={locationDetailsStyles.sectionText}>
                Manager: {location.contact.manager.name}
              </Text>
              <Text style={locationDetailsStyles.sectionText}>
                Email manager: {location.contact.manager.email}
              </Text>
            </>
          )}
        </View>

        {/* Horaires d'ouverture */}
        <View style={locationDetailsStyles.section}>
          <Text style={locationDetailsStyles.sectionTitle}>Horaires d'ouverture</Text>
          {Object.entries(location.business_info.opening_hours).map(([day, hours]) => (
            <View key={day} style={locationDetailsStyles.hoursRow}>
              <Text style={locationDetailsStyles.dayText}>
                {day.charAt(0).toUpperCase() + day.slice(1)}:
              </Text>
              <Text style={locationDetailsStyles.hoursText}>
                {formatOpeningHours(day, hours)}
              </Text>
            </View>
          ))}
        </View>

        {/* Informations légales */}
        <View style={locationDetailsStyles.section}>
          <Text style={locationDetailsStyles.sectionTitle}>Informations légales</Text>
          <Text style={locationDetailsStyles.sectionText}>
            Numéro d'enregistrement: {location.business_info.registration_number}
          </Text>
          <Text style={locationDetailsStyles.sectionText}>
            ID Fiscal: {location.business_info.tax_id}
          </Text>
          <Text style={locationDetailsStyles.sectionText}>
            Secteur: {location.business_info.industry}
          </Text>
        </View>

        {/* Paramètres locaux */}
        {location.local_settings && (
          <View style={locationDetailsStyles.section}>
            <Text style={locationDetailsStyles.sectionTitle}>Paramètres locaux</Text>
            <Text style={locationDetailsStyles.sectionText}>
              Devise: {location.local_settings.currency}
            </Text>
            <Text style={locationDetailsStyles.sectionText}>
              Fuseau horaire: {location.local_settings.timezone}
            </Text>
            <Text style={locationDetailsStyles.sectionText}>
              Langue: {location.local_settings.language}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  };

  const renderDevicesTab = () => (
    <View style={locationDetailsStyles.tabContent}>
      <View style={locationDetailsStyles.devicesHeader}>
        <Text style={locationDetailsStyles.devicesTitle}>
          Devices ({devices.length})
        </Text>
        <Button
          title="Ajouter"
          onPress={handleAddDevice}
          variant="primary"
          style={locationDetailsStyles.addDeviceButton}
        />
      </View>

      {devices.length === 0 ? (
        <View style={commonStyles.emptyContainer}>
          <Text style={commonStyles.emptyText}>Aucun device trouvé</Text>
          <Button
            title="Ajouter un device"
            onPress={handleAddDevice}
            variant="outline"
          />
        </View>
      ) : (
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderDeviceItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={locationDetailsStyles.devicesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={commonStyles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={commonStyles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={commonStyles.centerContainer}>
        <Text style={commonStyles.errorText}>Location non trouvée</Text>
        <Button
          title="Retour"
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </View>
    );
  }

  return (
    <View style={locationDetailsStyles.container}>
      {/* Tabs */}
      <View style={locationDetailsStyles.tabsContainer}>
        <TouchableOpacity
          style={[
            locationDetailsStyles.tab,
            activeTab === 'info' && locationDetailsStyles.activeTab,
          ]}
          onPress={() => setActiveTab('info')}
        >
          <Text
            style={[
              locationDetailsStyles.tabText,
              activeTab === 'info' && locationDetailsStyles.activeTabText,
            ]}
          >
            Informations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            locationDetailsStyles.tab,
            activeTab === 'devices' && locationDetailsStyles.activeTab,
          ]}
          onPress={() => setActiveTab('devices')}
        >
          <Text
            style={[
              locationDetailsStyles.tabText,
              activeTab === 'devices' && locationDetailsStyles.activeTabText,
            ]}
          >
            Devices ({devices.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'info' ? renderInfoTab() : renderDevicesTab()}
    </View>
  );
};

export default LocationDetailsScreen;
