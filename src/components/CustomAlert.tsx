import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getColors, SPACING, BORDER_RADIUS, FONTS, SHADOWS, getFontSizes } from '../constants/theme';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  isDarkMode?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [],
  onDismiss,
  isDarkMode = false,
  fontSize = 'medium',
}) => {
  const COLORS = getColors(isDarkMode);
  const FONT_SIZES = getFontSizes(fontSize);

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  const getButtonStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return styles.cancelButton;
      case 'destructive':
        return styles.destructiveButton;
      default:
        return styles.defaultButton;
    }
  };

  const getButtonTextStyle = (buttonStyle?: string) => {
    switch (buttonStyle) {
      case 'cancel':
        return [styles.buttonText, { color: COLORS.textSecondary }];
      case 'destructive':
        return [styles.buttonText, { color: '#FF3B30' }];
      default:
        return [styles.buttonText, { color: COLORS.primary }];
    }
  };

  // Default to OK button if no buttons provided
  const alertButtons = buttons.length > 0 ? buttons : [{ text: 'OK', style: 'default' as const }];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertContainer, { backgroundColor: COLORS.background }]}>
          <LinearGradient
            colors={[COLORS.gradientStart, COLORS.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <Ionicons name="alert-circle" size={48} color="#FFD700" />
          </LinearGradient>

          <View style={styles.contentContainer}>
            {title && (
              <Text style={[styles.title, { fontSize: FONT_SIZES.xl, color: COLORS.textBrand }]}>
                {title}
              </Text>
            )}
            <Text style={[styles.message, { fontSize: FONT_SIZES.md, color: COLORS.textPrimary }]}>
              {message}
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            {alertButtons.map((button, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleButtonPress(button)}
                style={[
                  styles.button,
                  getButtonStyle(button.style),
                  { backgroundColor: COLORS.cardInnerBackground },
                  alertButtons.length === 1 && styles.singleButton,
                ]}
                activeOpacity={0.7}
              >
                <Text style={[getButtonTextStyle(button.style), { fontSize: FONT_SIZES.md }]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  alertContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BORDER_RADIUS.xxl,
    overflow: 'hidden',
    ...SHADOWS.large,
    elevation: 10,
  },
  headerGradient: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.3)',
  },
  contentContainer: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 215, 0, 0.2)',
  },
  singleButton: {
    borderRightWidth: 0,
  },
  defaultButton: {},
  cancelButton: {},
  destructiveButton: {},
  buttonText: {
    fontWeight: '600',
  },
});

export default CustomAlert;
