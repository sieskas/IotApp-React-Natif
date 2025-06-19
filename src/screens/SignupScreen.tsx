// src/screens/SignupScreen.tsx
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
  // Alert, // 👈 SUPPRIMÉ - plus besoin
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation';
import Button from '../components/Button';
import InputField from '../components/InputField';
import useApi from '../hooks/useApi';
import { useAlert } from '../hooks/useAlert'; // 👈 NOUVEAU

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

interface SignupScreenProps {
  navigation: SignupScreenNavigationProp;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 👇 NOUVEAU - Hook pour les alertes modernes
  const { showError, showSuccess } = useAlert();

  // Utilisation du hook useApi pour gérer les appels API et les états
  const { loading, error, registerUser, resetState } = useApi();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignup = async () => {
    // Réinitialiser les états d'erreur précédents
    resetState();

    // 👇 MODIFIÉ - Utiliser showError au lieu d'Alert.alert
    // Validation basique
    if (!username || !email || !password || !confirmPassword) {
      return showError('Tous les champs sont obligatoires');
    }

    if (!validateEmail(email)) {
      return showError('Veuillez entrer une adresse email valide');
    }

    console.log(password);
    console.log(confirmPassword);
    if (password !== confirmPassword) {
      return showError('Les mots de passe ne correspondent pas');
    }

    if (password.length < 6) {
      console.log(password.length);
      console.log(password);
      return showError('Le mot de passe doit contenir au moins 6 caractères');
    }

    // Appel à l'API via le hook useApi
    const result = await registerUser({ username, email, password });

    if (result.success) {
      // 👇 MODIFIÉ - Utiliser showSuccess avec actions personnalisées
      showSuccess('Votre compte a été créé avec succès', {
        title: 'Inscription réussie',
        actions: [
          {
            text: 'Se connecter',
            onPress: () => navigation.navigate('Login')
          }
        ],
        persistent: true // L'alerte ne disparaît que quand on clique sur l'action
      });
    } else {
      // L'erreur est déjà gérée par le hook useApi
      console.error(result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="signup-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        testID="signup-keyboard-avoiding-view"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer} testID="signup-inner-container">
            <View style={styles.headerContainer} testID="signup-header">
              <Text style={styles.headerText} testID="signup-header-text">Create Account</Text>
              <Text style={styles.subHeaderText} testID="signup-subheader-text">Join the Roborock community</Text>
            </View>

            <View style={styles.formContainer} testID="signup-form-container">
              {error ? (
                <Text style={styles.errorText} testID="signup-error-message">
                  {error}
                </Text>
              ) : null}

              <InputField
                testID="signup-username-input"
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <InputField
                testID="signup-email-input"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <InputField
                testID="signup-password-input"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textContentType="none"          // Désactive l'auto-password
                autoComplete="off"              // Désactive l'auto-complétion
                autoCorrect={false}             // Désactive l'auto-correction
                autoCapitalize="none"           // Désactive la capitalisation automatique
              />

              <InputField
                testID="signup-confirm-password-input"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                textContentType="none"          // Désactive l'auto-password
                autoComplete="off"              // Désactive l'auto-complétion
                autoCorrect={false}             // Désactive l'auto-correction
                autoCapitalize="none"           // Désactive la capitalisation automatique
              />

              <Button
                testID="signup-submit-button"
                title="Sign Up"
                onPress={handleSignup}
                loading={loading}
                disabled={loading}
              />

              <Button
                testID="back-to-login-button"
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                variant="secondary"
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
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default SignupScreen;
