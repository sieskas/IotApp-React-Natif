import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import Button from '../components/Button';
import InputField from '../components/InputField';
import useApi from '../hooks/useApi';
import { getCurrentEnvironment } from '../utils/environment';
import { useAlert } from '../hooks/useAlert';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 👇 NOUVEAU - Hook pour les alertes modernes
  const { showError, showSuccess } = useAlert();

  // Utilisation du hook useApi pour gérer les appels API et les états
  const { loading, error, loginUser, resetState } = useApi();

  const env = getCurrentEnvironment();

  const handleLogin = async () => {
    if (!username || !password) {
      // Réinitialiser les états d'erreur précédents
      resetState();
      // 👇 MODIFIÉ - Utiliser showError au lieu d'Alert.alert
      return showError('Veuillez saisir votre nom d\'utilisateur et votre mot de passe');
    }

    // Appel à l'API via le hook useApi
    const result = await loginUser(username, password);

    if (result.success) {
      // 👇 NOUVEAU - Alerte de succès
      showSuccess('Connexion réussie !');
      // Naviguer vers l'écran principal en cas de succès
      navigation.replace('Locations');
    } else {
      // L'erreur est déjà gérée par le hook useApi
      console.error(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        testID="keyboard-avoiding-view"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer} testID="login-inner-container">
            <View style={styles.logoContainer} testID="logo-container">
              <Text style={styles.logo} testID="logo-text">roborock</Text>
              <Text style={styles.version} testID="version-text">V0.0.1.{env.toUpperCase()}</Text>
            </View>

            <View style={styles.robotContainer} testID="robot-container">
              {/* Vous pourriez ajouter une animation ici */}
              <View style={styles.glowPath} testID="glow-path" />
              <View style={styles.robotCircle} testID="robot-circle">
                <Text style={styles.robotIcon} testID="robot-icon">⟲</Text>
              </View>
            </View>

            <View style={styles.formContainer} testID="form-container">
              {error ? (
                <Text style={styles.errorText} testID="error-message">
                  {error}
                </Text>
              ) : null}

              <InputField
                testID="username-input"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <InputField
                testID="password-input"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="none"
                autoComplete="off"
              />

              <Button
                testID="login-button"
                title="Log In"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />

              <Button
                testID="signup-button"
                title="Sign Up"
                onPress={() => navigation.navigate('Signup')}
                variant="secondary"
                disabled={loading}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: '200',
    color: 'white',
    letterSpacing: 2,
  },
  version: {
    fontSize: 14,
    color: '#9E9E9E',
    marginTop: 5,
  },
  robotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    position: 'relative',
  },
  glowPath: {
    position: 'absolute',
    width: 20,
    height: 150,
    backgroundColor: '#2979FF',
    borderRadius: 10,
    opacity: 0.5,
  },
  robotCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 2,
  },
  robotIcon: {
    fontSize: 40,
    color: '#333',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 15,
  },
  // Styles pour l'indicateur d'environnement
  envIndicator: {
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 5,
  },
  envText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
