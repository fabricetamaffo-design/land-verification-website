import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../theme/colors';
import { radii, softShadow } from '../theme/styles';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
}

export function Button({ title, onPress, variant = 'primary', disabled, loading, style, icon }: ButtonProps) {
  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'ghost' ? colors.primary : colors.white}
        />
      ) : icon ? (
        <View style={styles.icon} pointerEvents="none">
          {icon}
        </View>
      ) : null}
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          variant === 'secondary' && styles.secondaryText,
          variant === 'ghost' && styles.ghostText,
        ]}
      >
        {title}
      </Text>
    </>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primaryOuter,
        variant !== 'primary' && styles.variantBase,
        variant !== 'primary' && styles[variant],
        pressed && !disabled && !loading && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={disabled || loading ? ['#7db99a', '#5d9a7b'] : gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      ) : content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryOuter: {
    backgroundColor: colors.primary,
    ...softShadow,
  },
  variantBase: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  gradient: {
    minHeight: 48,
    alignSelf: 'stretch',
    width: '100%',
    borderRadius: radii.lg,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondary: {
    backgroundColor: '#f0fbf4',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  danger: {
    backgroundColor: colors.danger,
    borderWidth: 1,
    borderColor: '#a93131',
    shadowColor: colors.danger,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  disabled: {
    opacity: 0.68,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ translateY: 1 }, { scale: 0.99 }],
  },
  text: {
    color: colors.white,
    fontWeight: '900',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
  },
  secondaryText: {
    color: colors.primaryDark,
  },
  ghostText: {
    color: colors.primary,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
