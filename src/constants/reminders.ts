export type ReminderTimeId = 'morning' | 'afternoon' | 'evening' | 'night';

export type ReminderTime = { id: ReminderTimeId; label: string; time: string };

export const REMINDER_TIMES: ReminderTime[] = [
  { id: 'morning', label: 'Morning', time: '9:00' },
  { id: 'afternoon', label: 'Afternoon', time: '13:00' },
  { id: 'evening', label: 'Evening', time: '19:00' },
  { id: 'night', label: 'Night', time: '21:30' },
];

export type NotificationSettings = {
  enabled: boolean;
  reminderTime: ReminderTimeId;
  streakAlerts: boolean;
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  enabled: true,
  reminderTime: 'evening',
  streakAlerts: true,
};
