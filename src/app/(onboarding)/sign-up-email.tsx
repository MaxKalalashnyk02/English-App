import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/back-button';
import { Inter, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/hooks/use-onboarding';
import { isValidEmail, MIN_PASSWORD_LENGTH, signUpWithEmail } from '@/lib/auth';
import type { Palette } from '@/constants/palette';
import { usePalette } from '@/hooks/use-palette';

export default function SignUpEmailScreen() {
  const c = usePalette();
  const styles = createStyles(c);
  const { completeOnboarding } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const canSubmit = isValidEmail(email) && password.length >= MIN_PASSWORD_LENGTH && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    await signUpWithEmail(email.trim(), password);
    setBusy(false);
    completeOnboarding();
  };

  return (
    <View style={styles.container}>
      <StatusBar style={c.statusBar} />
      <SafeAreaView style={styles.safeArea}>
        <BackButton />

        <KeyboardAvoidingView
          style={styles.form}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.heading}>
            <Text style={styles.title}>Sign up with email</Text>
            <Text style={styles.subtitle}>Keep your level and progress safe.</Text>
          </View>

          <View style={styles.fields}>
            <TextInput
              keyboardAppearance={c.keyboard}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={c.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              style={styles.input}
            />
            <TextInput
              keyboardAppearance={c.keyboard}
              value={password}
              onChangeText={setPassword}
              placeholder={`Password (${MIN_PASSWORD_LENGTH}+ characters)`}
              placeholderTextColor={c.muted}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="done"
              onSubmitEditing={submit}
              style={styles.input}
            />
          </View>

          <Pressable
            disabled={!canSubmit}
            onPress={submit}
            style={({ pressed }) => [
              styles.button,
              !canSubmit && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}>
            {busy ? (
              <ActivityIndicator color={c.background} />
            ) : (
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const createStyles = (c: Palette) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  heading: {
    gap: Spacing.two,
  },
  title: {
    color: c.text,
    fontSize: 30,
    fontFamily: Inter.bold,
  },
  subtitle: {
    color: c.muted,
    fontSize: 16,
    fontFamily: Inter.regular,
  },
  fields: {
    gap: Spacing.three - 4,
  },
  input: {
    backgroundColor: c.card,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 14,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    color: c.text,
    fontSize: 17,
    fontFamily: Inter.regular,
  },
  button: {
    backgroundColor: c.text,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: c.background,
    fontSize: 18,
    fontFamily: Inter.semiBold,
  },
});
