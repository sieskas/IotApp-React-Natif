// src/components/Button.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
                                         title,
                                         onPress,
                                         style,
                                         textStyle,
                                         loading = false,
                                         disabled = false,
                                         variant = 'primary',
                                         testID,
                                       }) => {
  const buttonStyles = [
    styles.button,
    variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    variant === 'primary' ? styles.primaryText : styles.secondaryText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      accessibilityLabel={title}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? 'white' : '#2979FF'}
          testID={testID ? `${testID}-loading-indicator` : undefined}
        />
      ) : (
        <Text
          style={textStyles}
          testID={testID ? `${testID}-text` : undefined}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  primaryButton: {
    backgroundColor: '#2979FF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2979FF',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
    borderColor: '#BDBDBD',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#2979FF',
  },
  disabledText: {
    color: '#757575',
  },
});

export default Button;
