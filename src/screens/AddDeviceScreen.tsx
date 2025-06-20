// src/screens/AddDeviceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import api from '../api';
import type { CreateDeviceRequest, Device } from '../types';
import { addDeviceStyles } from '../styles/screens/addDevice.styles';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Picker } from '@react-native-picker/picker';

interface RouteParams {
  locationId: string;
}

const AddDeviceScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { locationId } = route.params as RouteParams;

  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateDeviceRequest>({
    name: '',
    model: '',
    serial_number: '',
    device_type: 'robot_vacuum',
    location_id: locationId,
    settings: {
      auto_clean_schedule: {
        enabled: false,
        days: [],
        time: '09:00',
      },
      cleaning_mode: 'standard',
      notifications: {
        low_battery: true,
        cleaning_complete: true,
        error_alerts: true,
      },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Le modèle est requis';
    }

    if (!formData.serial_number.trim()) {
      newErrors.serial_number = 'Le numéro de série est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    try {
      const response = await api.createDevice(formData);
      if (response.status === 201) {
        Alert.alert(
          'Succès',
          'Device créé avec succès',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de créer le device');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const keys = field.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  const getCleaningModeLabel = (mode: string) => {
    switch (mode) {
      case 'quiet':
        return 'Silencieux';
      case 'standard':
        return 'Standard';
      case 'high':
        return 'Élevé';
      case 'max':
        return 'Maximum';
      default:
        return mode;
    }
  };

  return (
    <KeyboardAvoidingView
      style={addDeviceStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={addDeviceStyles.scrollView}
        contentContainerStyle={addDeviceStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={addDeviceStyles.title}>Nouveau Device</Text>

        {/* Informations générales */}
        <View style={addDeviceStyles.section}>
          <Text style={addDeviceStyles.sectionTitle}>Informations générales</Text>
          
          <InputField
            label="Nom du device"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            error={errors.name}
            placeholder="Ex: Roborock Salon"
          />

          <InputField
            label="Modèle"
            value={formData.model}
            onChangeText={(value) => updateFormData('model', value)}
            error={errors.model}
            placeholder="Ex: S7 MaxV Ultra"
          />

          <InputField
            label="Numéro de série"
            value={formData.serial_number}
            onChangeText={(value) => updateFormData('serial_number', value)}
            error={errors.serial_number}
            placeholder="Ex: R7MU2025001"
          />

          <View style={addDeviceStyles.pickerContainer}>
            <Text style={addDeviceStyles.pickerLabel}>Type de device</Text>
            <Picker
              selectedValue={formData.device_type}
              onValueChange={(value) => updateFormData('device_type', value)}
              style={addDeviceStyles.picker}
            >
              <Picker.Item label={getDeviceTypeLabel('robot_vacuum')} value="robot_vacuum" />
              <Picker.Item label={getDeviceTypeLabel('security_camera')} value="security_camera" />
              <Picker.Item label={getDeviceTypeLabel('sensor')} value="sensor" />
              <Picker.Item label={getDeviceTypeLabel('other')} value="other" />
            </Picker>
          </View>
        </View>

        {/* Paramètres */}
        {formData.device_type === 'robot_vacuum' && (
          <View style={addDeviceStyles.section}>
            <Text style={addDeviceStyles.sectionTitle}>Paramètres de nettoyage</Text>
            
            <View style={addDeviceStyles.pickerContainer}>
              <Text style={addDeviceStyles.pickerLabel}>Mode de nettoyage</Text>
              <Picker
                selectedValue={formData.settings?.cleaning_mode || 'standard'}
                onValueChange={(value) => updateFormData('settings.cleaning_mode', value)}
                style={addDeviceStyles.picker}
              >
                <Picker.Item label={getCleaningModeLabel('quiet')} value="quiet" />
                <Picker.Item label={getCleaningModeLabel('standard')} value="standard" />
                <Picker.Item label={getCleaningModeLabel('high')} value="high" />
                <Picker.Item label={getCleaningModeLabel('max')} value="max" />
              </Picker>
            </View>

            <InputField
              label="Heure de nettoyage automatique"
              value={formData.settings?.auto_clean_schedule?.time || '09:00'}
              onChangeText={(value) => updateFormData('settings.auto_clean_schedule.time', value)}
              placeholder="09:00"
            />
          </View>
        )}

        {/* Notifications */}
        <View style={addDeviceStyles.section}>
          <Text style={addDeviceStyles.sectionTitle}>Notifications</Text>
          
          <View style={addDeviceStyles.switchContainer}>
            <Text style={addDeviceStyles.switchLabel}>Batterie faible</Text>
            <Text style={addDeviceStyles.switchValue}>
              {formData.settings?.notifications?.low_battery ? 'Activé' : 'Désactivé'}
            </Text>
          </View>

          <View style={addDeviceStyles.switchContainer}>
            <Text style={addDeviceStyles.switchLabel}>Nettoyage terminé</Text>
            <Text style={addDeviceStyles.switchValue}>
              {formData.settings?.notifications?.cleaning_complete ? 'Activé' : 'Désactivé'}
            </Text>
          </View>

          <View style={addDeviceStyles.switchContainer}>
            <Text style={addDeviceStyles.switchLabel}>Alertes d'erreur</Text>
            <Text style={addDeviceStyles.switchValue}>
              {formData.settings?.notifications?.error_alerts ? 'Activé' : 'Désactivé'}
            </Text>
          </View>
        </View>

        <View style={addDeviceStyles.buttonContainer}>
          <Button
            title="Annuler"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={addDeviceStyles.cancelButton}
          />
          
          <Button
            title="Créer"
            onPress={handleSubmit}
            variant="primary"
            style={addDeviceStyles.submitButton}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddDeviceScreen;
