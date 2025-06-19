// components/InputField.tsx
import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  testID?: string;
  textContentType?: 'none' | 'URL' | 'addressCity' | 'addressCityAndState' | 'addressState' | 'countryName' | 'creditCardNumber' | 'emailAddress' | 'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' | 'nickname' | 'organizationName' | 'postalCode' | 'streetAddressLine1' | 'streetAddressLine2' | 'sublocality' | 'telephoneNumber' | 'username' | 'password' | 'newPassword' | 'oneTimeCode';
  autoComplete?: 'off' | 'username' | 'password' | 'email' | 'name' | 'tel' | 'street-address' | 'postal-code' | 'cc-number' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year';
}

const InputField: React.FC<InputFieldProps> = ({
                                                 label,
                                                 placeholder,
                                                 value,
                                                 onChangeText,
                                                 secureTextEntry = false,
                                                 autoCapitalize,
                                                 autoCorrect,
                                                 keyboardType,
                                                 testID,
                                                 textContentType = 'none',
                                                 autoComplete = 'off',
                                               }) => {
  return (
    <View style={styles.container} testID={testID ? `${testID}-container` : undefined}>
      {label && (
        <Text
          style={styles.label}
          testID={testID ? `${testID}-label` : undefined}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        testID={testID}
        placeholderTextColor="#666"
        textContentType={textContentType}
        autoComplete={autoComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#FFF',
  },
  input: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFF',
  },
});

export default InputField;
