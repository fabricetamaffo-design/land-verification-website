import React from 'react';
import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { radii } from '../theme/styles';

interface TextFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}

export function TextField({ label, error, multiline, secureTextEntry, editable, style, ...props }: TextFieldProps) {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const hasPasswordToggle = Boolean(secureTextEntry) && !multiline;
  const isEditable = editable !== false;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputShell, style, error && styles.errorInput, !isEditable && styles.disabledInput]}>
        <TextInput
          {...props}
          editable={editable}
          multiline={multiline}
          secureTextEntry={hasPasswordToggle ? !passwordVisible : secureTextEntry}
          placeholderTextColor="#8da196"
          style={[
            styles.input,
            multiline && styles.multiline,
            hasPasswordToggle && styles.passwordInput,
          ]}
        />
        {hasPasswordToggle && (
          <Pressable
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            disabled={!isEditable}
            hitSlop={8}
            onPress={() => setPasswordVisible((current) => !current)}
            style={({ pressed }) => [
              styles.eyeButton,
              pressed && styles.eyePressed,
              !isEditable && styles.eyeDisabled,
            ]}
          >
            {passwordVisible ? (
              <EyeOff size={19} color={colors.primaryDark} strokeWidth={2.25} />
            ) : (
              <Eye size={19} color={colors.textMuted} strokeWidth={2.25} />
            )}
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  inputShell: {
    minHeight: 46,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceTint,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  input: {
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  passwordInput: {
    paddingRight: 52,
  },
  multiline: {
    minHeight: 92,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: colors.danger,
    backgroundColor: '#fffafa',
  },
  disabledInput: {
    opacity: 0.72,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  eyeButton: {
    position: 'absolute',
    right: 8,
    top: 6,
    width: 34,
    height: 34,
    borderRadius: radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eyePressed: {
    backgroundColor: colors.primarySoft,
    transform: [{ scale: 0.97 }],
  },
  eyeDisabled: {
    opacity: 0.55,
  },
});
