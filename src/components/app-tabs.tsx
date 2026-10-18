import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { usePalette } from '@/hooks/use-palette';

export default function AppTabs() {
  const c = usePalette();
  return (
    <NativeTabs
      backgroundColor={c.background}
      blurEffect={c.statusBar === 'light' ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
      tintColor={c.text}
      iconColor={{ default: c.muted, selected: c.text }}
      labelStyle={{ default: { color: c.muted }, selected: { color: c.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Fun</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'person', selected: 'person.fill' }} md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
