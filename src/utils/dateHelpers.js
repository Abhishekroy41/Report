import { format, parseISO, isToday, isYesterday, startOfDay } from 'date-fns';

export const formatDisplayDate = (isoString) => {
  if (!isoString) return '';
  const date = parseISO(isoString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
};

export const formatDisplayTime = (isoString) => {
  if (!isoString) return '';
  return format(parseISO(isoString), 'h:mm a');
};

export const groupReadingsByDate = (readings) => {
  const grouped = {};
  readings.forEach((reading) => {
    const day = startOfDay(parseISO(reading.timestamp)).toISOString();
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(reading);
  });
  return grouped;
};
