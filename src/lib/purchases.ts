import { Alert } from 'react-native';

export const PREMIUM_PRICE_LABEL = '$4.99/week';
export const TRIAL_DAYS = 3;

export async function startPremiumTrial(): Promise<boolean> {
  if (__DEV__) {
    return true;
  }
  Alert.alert('Coming soon', 'Secret tutors will be available in a future update.');
  return false;
}
