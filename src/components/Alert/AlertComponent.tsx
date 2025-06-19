// src/components/Alert/AlertComponent.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  PanResponder,
} from 'react-native';
import { Alert, AlertOptions } from './AlertProvider';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AlertComponentProps {
  alert: Alert;
  index: number;
  onPress: () => void;
  onClose: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({
                                                         alert,
                                                         index,
                                                         onPress,
                                                         onClose,
                                                       }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  // PanResponder pour gérer les gestes de swipe
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100;
      },
      onPanResponderGrant: () => {
        // Début du geste
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx * 0.7);
      },
      onPanResponderRelease: (evt, gestureState) => {
        handleSwipeGesture(gestureState);
      },
    })
  ).current;

  useEffect(() => {
    // Enter animation
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: index * 80,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [index, translateY, opacity, scale]);

  const handleSwipeGesture = (gestureState: { dx: number; dy: number }) => {
    if (Math.abs(gestureState.dx) > 100) {
      // Swipe to dismiss
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: gestureState.dx > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(onClose);
    } else {
      // Snap back
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const getAlertStyles = () => {
    const baseStyle = [styles.alert];

    switch (alert.type) {
      case 'success':
        return [...baseStyle, styles.successAlert];
      case 'error':
        return [...baseStyle, styles.errorAlert];
      case 'warning':
        return [...baseStyle, styles.warningAlert];
      default:
        return [...baseStyle, styles.infoAlert];
    }
  };

  const getIconForType = () => {
    switch (alert.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getIconColor = () => {
    switch (alert.type) {
      case 'success':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      case 'warning':
        return '#FF9800';
      default:
        return '#2196F3';
    }
  };

  return (
    <Animated.View
      style={[
        styles.alertWrapper,
        {
          transform: [
            { translateY },
            { translateX },
            { scale },
          ],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
      testID={`alert-${alert.type}-${alert.id}`}
    >
      <TouchableOpacity
        style={getAlertStyles()}
        onPress={onPress}
        activeOpacity={0.9}
        testID={`alert-touchable-${alert.id}`}
      >
        <View style={styles.alertContent}>
          {alert.showIcon && (
            <View
              style={[styles.iconContainer, { backgroundColor: getIconColor() }]}
              testID={`alert-icon-${alert.id}`}
            >
              <Text style={styles.icon}>{getIconForType()}</Text>
            </View>
          )}

          <View style={styles.textContainer} testID={`alert-text-${alert.id}`}>
            {alert.title && (
              <Text
                style={styles.alertTitle}
                numberOfLines={1}
                testID={`alert-title-${alert.id}`}
              >
                {alert.title}
              </Text>
            )}
            <Text
              style={styles.alertMessage}
              numberOfLines={2}
              testID={`alert-message-${alert.id}`}
            >
              {alert.message}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            testID={`alert-close-button-${alert.id}`}
          >
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
        </View>

        {alert.actions && alert.actions.length > 0 && (
          <View style={styles.actionsContainer} testID={`alert-actions-${alert.id}`}>
            {alert.actions.map((action: NonNullable<AlertOptions['actions']>[0], actionIndex: number) => (
              <TouchableOpacity
                key={actionIndex}
                style={[
                  styles.actionButton,
                  action.style === 'destructive' && styles.destructiveAction,
                  action.style === 'cancel' && styles.cancelAction,
                ]}
                onPress={() => {
                  action.onPress();
                  onClose();
                }}
                testID={`alert-action-${actionIndex}-${alert.id}`}
              >
                <Text
                  style={[
                    styles.actionText,
                    action.style === 'destructive' && styles.destructiveText,
                    action.style === 'cancel' && styles.cancelText,
                  ]}
                  testID={`alert-action-text-${actionIndex}-${alert.id}`}
                >
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertWrapper: {
    marginBottom: 12,
  },
  alert: {
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successAlert: {
    backgroundColor: '#1B4332',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  errorAlert: {
    backgroundColor: '#4A1A1A',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  warningAlert: {
    backgroundColor: '#4A3A1A',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoAlert: {
    backgroundColor: '#1A2A4A',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#9E9E9E',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  destructiveAction: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  cancelAction: {
    backgroundColor: 'transparent',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2196F3',
  },
  destructiveText: {
    color: '#F44336',
  },
  cancelText: {
    color: '#9E9E9E',
  },
});

export default AlertComponent;
