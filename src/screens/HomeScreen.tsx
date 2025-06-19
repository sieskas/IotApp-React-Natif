// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  // Alert, // 👈 SUPPRIMÉ - plus besoin
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import RobotDisplay from '../components/RobotDisplay';
import Button from '../components/Button';
import useApi from '../hooks/useApi';
import type { Device } from '../api';
import { useAlert } from '../hooks/useAlert'; // 👈 NOUVEAU

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 👇 NOUVEAU - Hook pour les alertes modernes
  const { showInfo, showConfirm, showSuccess } = useAlert();

  // Utilisation du hook useApi pour gérer les appels API et les états
  const { loading, error, fetchDevices: apiFetchDevices } = useApi();

  const fetchDevices = async () => {
    const result = await apiFetchDevices();

    if (result.success && result.data) {
      setDevices(result.data);
    } else {
      // L'erreur est déjà gérée par le hook useApi
      console.error(result.error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDevices();
    setRefreshing(false);
  };

  const handleLogout = () => {
    // 👇 MODIFIÉ - Utiliser showConfirm pour demander confirmation
    showConfirm(
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      () => {
        showSuccess('Déconnexion réussie');
        navigation.replace('Login');
      }, // onConfirm
      () => {}, // onCancel (optionnel)
      { title: 'Déconnexion' }
    );
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.deviceCard} testID={`device-card-${item.id}`}>
      <RobotDisplay device={item} testID={`device-${item.id}`} />
      <View style={styles.actionButtons} testID={`device-actions-${item.id}`}>
        <Button
          title="Start Cleaning"
          onPress={() => {
            // 👇 MODIFIÉ - Utiliser showInfo au lieu d'Alert.alert
            showInfo(`Nettoyage démarré avec ${item.name}`, {
              title: 'Nettoyage en cours',
              duration: 3000
            });
          }}
          style={styles.actionButton}
          testID={`start-cleaning-${item.id}`}
        />
        <Button
          title="Settings"
          onPress={() => {
            // 👇 MODIFIÉ - Utiliser showInfo au lieu d'Alert.alert
            showInfo(`Paramètres de ${item.name}`, {
              title: 'Paramètres',
              duration: 3000
            });
          }}
          variant="secondary"
          style={styles.actionButton}
          testID={`settings-${item.id}`}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} testID="home-screen">
      <View style={styles.header} testID="home-header">
        <Text style={styles.headerTitle} testID="header-title">My Devices</Text>
        <TouchableOpacity onPress={handleLogout} testID="logout-button">
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer} testID="error-container">
          <Text style={styles.errorText} testID="error-text">{error}</Text>
          <Button title="Retry" onPress={fetchDevices} testID="retry-button" />
        </View>
      ) : (
        <FlatList
          data={devices}
          renderItem={renderDevice}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.deviceList}
          testID="devices-list"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#2979FF']}
              tintColor="#2979FF"
            />
          }
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer} testID="loading-container">
                <Text style={styles.loadingText} testID="loading-text">Loading devices...</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer} testID="empty-container">
                <Text style={styles.emptyText} testID="empty-text">No devices found</Text>
                <Text style={styles.emptySubText} testID="empty-subtext">Add a device to get started</Text>
                <Button
                  title="Add Device"
                  onPress={() => {
                    // 👇 MODIFIÉ - Utiliser showInfo au lieu d'Alert.alert
                    showInfo('Fonctionnalité d\'ajout d\'appareil à venir', {
                      title: 'Bientôt disponible',
                      duration: 4000
                    });
                  }}
                  style={{ marginTop: 20 }}
                  testID="add-device-button"
                />
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    color: '#2979FF',
    fontSize: 16,
  },
  deviceList: {
    padding: 15,
  },
  deviceCard: {
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#9E9E9E',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubText: {
    color: '#9E9E9E',
    textAlign: 'center',
  },
});

export default HomeScreen;
