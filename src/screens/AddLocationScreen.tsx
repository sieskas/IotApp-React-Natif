// src/screens/AddLocationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import type { CreateLocationRequest, Location } from '../types';
import { addLocationStyles } from '../styles/screens/addLocation.styles';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Picker } from '@react-native-picker/picker';

const AddLocationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<CreateLocationRequest>({
    name: '',
    type: 'branch',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'FR',
    },
    contact: {
      phone: '',
      email: '',
      manager: {
        name: '',
        email: '',
      },
    },
    business_info: {
      registration_number: '',
      tax_id: '',
      industry: 'Pet Supplies',
      opening_hours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { open: '10:00', close: '16:00' },
        sunday: { closed: true },
      },
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.address.street.trim()) {
      newErrors.street = 'L\'adresse est requise';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (!formData.address.postal_code.trim()) {
      newErrors.postal_code = 'Le code postal est requis';
    }

    if (!formData.contact.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!formData.contact.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.contact.manager.name.trim()) {
      newErrors.managerName = 'Le nom du manager est requis';
    }

    if (!formData.contact.manager.email.trim()) {
      newErrors.managerEmail = 'L\'email du manager est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.contact.manager.email)) {
      newErrors.managerEmail = 'Format d\'email invalide';
    }

    if (!formData.business_info.registration_number.trim()) {
      newErrors.registration_number = 'Le numéro d\'enregistrement est requis';
    }

    if (!formData.business_info.tax_id.trim()) {
      newErrors.tax_id = 'L\'ID fiscal est requis';
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
      const response = await api.createLocation(formData);
      if (response.status === 201) {
        Alert.alert(
          'Succès',
          'Location créée avec succès',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de créer la location');
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

  return (
    <KeyboardAvoidingView
      style={addLocationStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={addLocationStyles.scrollView}
        contentContainerStyle={addLocationStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={addLocationStyles.title}>Nouvelle Location</Text>

        {/* Informations générales */}
        <View style={addLocationStyles.section}>
          <Text style={addLocationStyles.sectionTitle}>Informations générales</Text>
          
          <InputField
            label="Nom de la location"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            error={errors.name}
            placeholder="Ex: PET France - Lyon"
          />

          <View style={addLocationStyles.pickerContainer}>
            <Text style={addLocationStyles.pickerLabel}>Type de location</Text>
            <Picker
              selectedValue={formData.type}
              onValueChange={(value) => updateFormData('type', value)}
              style={addLocationStyles.picker}
            >
              <Picker.Item label="Succursale" value="branch" />
              <Picker.Item label="Franchise" value="franchise" />
              <Picker.Item label="Siège Social" value="headquarters" />
            </Picker>
          </View>
        </View>

        {/* Adresse */}
        <View style={addLocationStyles.section}>
          <Text style={addLocationStyles.sectionTitle}>Adresse</Text>
          
          <InputField
            label="Rue"
            value={formData.address.street}
            onChangeText={(value) => updateFormData('address.street', value)}
            error={errors.street}
            placeholder="123 Rue de la Paix"
          />

          <InputField
            label="Ville"
            value={formData.address.city}
            onChangeText={(value) => updateFormData('address.city', value)}
            error={errors.city}
            placeholder="Lyon"
          />

          <InputField
            label="État/Région"
            value={formData.address.state}
            onChangeText={(value) => updateFormData('address.state', value)}
            placeholder="Auvergne-Rhône-Alpes"
          />

          <InputField
            label="Code postal"
            value={formData.address.postal_code}
            onChangeText={(value) => updateFormData('address.postal_code', value)}
            error={errors.postal_code}
            placeholder="69001"
          />

          <InputField
            label="Pays"
            value={formData.address.country}
            onChangeText={(value) => updateFormData('address.country', value)}
            placeholder="FR"
          />
        </View>

        {/* Contact */}
        <View style={addLocationStyles.section}>
          <Text style={addLocationStyles.sectionTitle}>Contact</Text>
          
          <InputField
            label="Téléphone"
            value={formData.contact.phone}
            onChangeText={(value) => updateFormData('contact.phone', value)}
            error={errors.phone}
            placeholder="+33-1-23-45-67-89"
            keyboardType="phone-pad"
          />

          <InputField
            label="Email"
            value={formData.contact.email}
            onChangeText={(value) => updateFormData('contact.email', value)}
            error={errors.email}
            placeholder="lyon@pet.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <InputField
            label="Nom du manager"
            value={formData.contact.manager.name}
            onChangeText={(value) => updateFormData('contact.manager.name', value)}
            error={errors.managerName}
            placeholder="Jean Dupont"
          />

          <InputField
            label="Email du manager"
            value={formData.contact.manager.email}
            onChangeText={(value) => updateFormData('contact.manager.email', value)}
            error={errors.managerEmail}
            placeholder="jean.dupont@pet.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Informations business */}
        <View style={addLocationStyles.section}>
          <Text style={addLocationStyles.sectionTitle}>Informations légales</Text>
          
          <InputField
            label="Numéro d'enregistrement"
            value={formData.business_info.registration_number}
            onChangeText={(value) => updateFormData('business_info.registration_number', value)}
            error={errors.registration_number}
            placeholder="FR123456789"
          />

          <InputField
            label="ID Fiscal"
            value={formData.business_info.tax_id}
            onChangeText={(value) => updateFormData('business_info.tax_id', value)}
            error={errors.tax_id}
            placeholder="FR12345678901"
          />

          <InputField
            label="Secteur d'activité"
            value={formData.business_info.industry}
            onChangeText={(value) => updateFormData('business_info.industry', value)}
            placeholder="Pet Supplies"
          />
        </View>

        <View style={addLocationStyles.buttonContainer}>
          <Button
            title="Annuler"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={addLocationStyles.cancelButton}
          />
          
          <Button
            title="Créer"
            onPress={handleSubmit}
            variant="primary"
            style={addLocationStyles.submitButton}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddLocationScreen;
