// src/components/RobotDisplay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Device } from '../api';

interface RobotDisplayProps {
    device?: Device;
    loading?: boolean;
    error?: string;
    testID?: string;
}

const RobotDisplay: React.FC<RobotDisplayProps> = ({
                                                       device,
                                                       loading = false,
                                                       error,
                                                       testID,
                                                   }) => {
    if (loading) {
        return (
            <View style={styles.container} testID={testID}>
                <View style={styles.robotCircle}>
                    {/* Placeholder for loading state */}
                    <View style={styles.loadingIndicator} />
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </View>
        );
    }

    if (error || !device) {
        return (
            <View style={styles.container} testID={testID}>
                <View style={[styles.robotCircle, styles.errorCircle]}>
                    <Text style={styles.errorIcon}>!</Text>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.errorText}>
                        {error || 'Device not available'}
                    </Text>
                </View>
            </View>
        );
    }

    const statusColor =
        device.status === 'online' ? '#4CAF50' :
            device.status === 'cleaning' ? '#2979FF' :
                device.status === 'charging' ? '#FFC107' : '#F44336';

    return (
        <View style={styles.container} testID={testID}>
            <View style={styles.glowPath}>
                <View style={[styles.glow, { backgroundColor: statusColor }]} />
            </View>
            <View style={styles.robotCircle}>
                <Text style={styles.robotIcon}>⟲</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceStatus}>{device.status.toUpperCase()}</Text>
                <Text style={styles.deviceFirmware}>v{device.firmwareVersion}</Text>
                <View style={styles.batteryContainer}>
                    <View style={styles.batteryIcon}>
                        <View
                            style={[
                                styles.batteryLevel,
                                { width: `${device.batteryLevel}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.batteryText}>{device.batteryLevel}%</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        position: 'relative',
    },
    glowPath: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        width: 20,
        height: 200,
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
    errorIcon: {
        fontSize: 40,
        color: '#F44336',
        fontWeight: 'bold',
    },
    errorCircle: {
        borderColor: '#F44336',
        borderWidth: 2,
    },
    loadingIndicator: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 3,
        borderColor: '#2979FF',
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
        transform: [{ rotate: '45deg' }],
    },
    infoContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    deviceName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    deviceStatus: {
        fontSize: 14,
        color: '#757575',
        marginTop: 5,
    },
    deviceFirmware: {
        fontSize: 12,
        color: '#9E9E9E',
        marginTop: 2,
    },
    batteryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    batteryIcon: {
        width: 30,
        height: 15,
        borderWidth: 1,
        borderColor: '#9E9E9E',
        borderRadius: 3,
        marginRight: 5,
        padding: 1,
    },
    batteryLevel: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 1,
    },
    batteryText: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    loadingText: {
        fontSize: 16,
        color: '#757575',
    },
    errorText: {
        fontSize: 16,
        color: '#F44336',
        textAlign: 'center',
    },
});

export default RobotDisplay;
