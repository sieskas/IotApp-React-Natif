// src/screens/DeviceDetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api';
import type { Device, DeviceCommand } from '../types';
import { commonStyles } from '../styles/common';
import Button from '../components/Button';

interface RouteParams {
  deviceId: string;
}

interface DeviceWithStats extends Device {
  stats: {
    total_cleaning_time: number;
    area_cleaned: number;
    cleaning_cycles: number;
    battery_level: number;
  };
}

const DeviceDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { deviceId } = route.params as RouteParams;

  const [device, setDevice] = useState<DeviceWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sendingCommand, setSendingCommand] = useState<string | null>(null);

  const loadDeviceData = async () => {
    try {
      const response = await api.getDevice(deviceId);
      if (response.status === 200) {
        setDevice(response.data as DeviceWithStats);
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de charger le device');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDeviceData();
  }, [deviceId]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDeviceData();
  };

  const sendCommand = async (command: DeviceCommand['command_type']) => {
    if (!device) return;

    try {
      setSendingCommand(command);
      const response = await api.sendDeviceCommand(device.id, command);

      if (response.status === 200) {
        Alert.alert('Succès', `Commande "${command}" envoyée avec succès`);
        // Recharger les détails du device pour voir les changements
        loadDeviceData();
      } else {
        Alert.alert('Erreur', response.error || 'Impossible d\'envoyer la commande');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setSendingCommand(null);
    }
  };

  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'offline':
        return '#F44336';
      case 'cleaning':
        return '#2196F3';
      case 'charging':
        return '#FF9800';
      case 'error':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  const getDeviceTypeLabel = (type: Device['device_type']) => {
    switch (type) {
      case 'robot_vacuum':
        return 'Robot Aspirateur';
      case 'security_camera':
        return 'Caméra de Sécurité';
      case 'sensor':
        return 'Capteur';
      case 'other':
        return 'Autre';
      default:
        return type;
    }
  };

  const renderCommands = () => {
    if (!device || device.device_type !== 'robot_vacuum') return null;

    const commands = [
      { command: 'start_cleaning' as const, label: 'Démarrer nettoyage', color: '#4CAF50' },
      { command: 'stop_cleaning' as const, label: 'Arrêter nettoyage', color: '#F44336' },
      { command: 'return_to_dock' as const, label: 'Retour à la base', color: '#2196F3' },
      { command: 'locate' as const, label: 'Localiser', color: '#FF9800' },
    ];

    return (
      <View style={commonStyles.card}>
        <Text style={commonStyles.cardTitle}>Commandes</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {commands.map((cmd) => (
            <TouchableOpacity
              key={cmd.command}
              style={[
                commonStyles.button,
                {
                  backgroundColor: cmd.color,
                  flex: 0,
                  minWidth: 120,
                  opacity: sendingCommand === cmd.command ? 0.7 : 1,
                },
              ]}
              onPress={() => sendCommand(cmd.command)}
              disabled={sendingCommand !== null}
            >
              {sendingCommand === cmd.command ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text style={commonStyles.buttonText}>{cmd.label}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={commonStyles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={commonStyles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={commonStyles.centerContainer}>
        <Text style={commonStyles.errorText}>Device non trouvé</Text>
        <Button
          title="Retour"
          onPress={() => navigation.goBack()}
          variant="outline"
        />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Device Display */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.cardTitle}>Informations du device</Text>
          <View style={{ marginTop: 12 }}>
            <Text style={commonStyles.cardSubtitle}>Nom: {device.name}</Text>
            <Text style={commonStyles.cardSubtitle}>Modèle: {device.model}</Text>
            <Text style={commonStyles.cardSubtitle}>Type: {getDeviceTypeLabel(device.device_type)}</Text>
            <Text style={commonStyles.cardSubtitle}>Numéro de série: {device.serial_number}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={commonStyles.cardSubtitle}>Statut: </Text>
              <View
                style={{
                  backgroundColor: getStatusColor(device.status),
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 12,
                  marginLeft: 4,
                }}
              >
                <Text style={{ color: 'white', fontSize: 12, fontWeight: '500' }}>
                  {device.status}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistiques */}
        {device.stats && (
          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Statistiques</Text>
            <View style={{ marginTop: 12 }}>
              <Text style={commonStyles.cardSubtitle}>
                Temps de nettoyage total: {Math.round(device.stats.total_cleaning_time / 60)} min
              </Text>
              <Text style={commonStyles.cardSubtitle}>
                Surface nettoyée: {device.stats.area_cleaned} m²
              </Text>
              <Text style={commonStyles.cardSubtitle}>
                Cycles de nettoyage: {device.stats.cleaning_cycles}
              </Text>
              <Text style={commonStyles.cardSubtitle}>
                Niveau de batterie: {device.stats.battery_level}%
              </Text>
            </View>
          </View>
        )}

        {/* Commandes */}
        {renderCommands()}

        {/* Paramètres */}
        {device.settings && (
          <View style={commonStyles.card}>
            <Text style={commonStyles.cardTitle}>Paramètres</Text>
            <View style={{ marginTop: 12 }}>
              {device.settings.cleaning_mode && (
                <Text style={commonStyles.cardSubtitle}>
                  Mode de nettoyage: {device.settings.cleaning_mode}
                </Text>
              )}
              {device.settings.auto_clean_schedule && (
                <Text style={commonStyles.cardSubtitle}>
                  Nettoyage automatique: {device.settings.auto_clean_schedule.enabled ? 'Activé' : 'Désactivé'}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DeviceDetailsScreen;
