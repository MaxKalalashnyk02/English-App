import { Alert } from 'react-native';

export type AuthProvider = 'apple' | 'google';

export async function signIn(provider: AuthProvider): Promise<boolean> {
  const name = provider === 'apple' ? 'Apple' : 'Google';
  await new Promise<void>((resolve) =>
    Alert.alert(
      'Accounts are coming soon',
      `Sign in with ${name} isn't connected yet. You can continue without an account for now.`,
      [{ text: 'OK', onPress: () => resolve() }]
    )
  );
  return false;
}

export async function signUpWithEmail(email: string, password: string): Promise<boolean> {
  void email;
  void password;
  await new Promise<void>((resolve) =>
    Alert.alert(
      'Accounts are coming soon',
      "Email sign-up isn't connected yet. You can continue without an account for now.",
      [{ text: 'OK', onPress: () => resolve() }]
    )
  );
  return false;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export const MIN_PASSWORD_LENGTH = 8;
