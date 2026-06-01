import { DAY_NAMES_ID, DAY_SHORT_ID, MONTH_NAMES_ID, MONTH_SHORT_ID } from './constants';

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function toIsoString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function fromIsoString(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getDayNameId(date: Date): string {
  return DAY_NAMES_ID[date.getDay()];
}

export function getDayShortId(date: Date): string {
  return DAY_SHORT_ID[date.getDay()];
}

export function getMonthNameId(date: Date): string {
  return MONTH_NAMES_ID[date.getMonth()];
}

export function getMonthShortId(date: Date): string {
  return MONTH_SHORT_ID[date.getMonth()];
}

export function formatDisplayDate(date: Date): string {
  return `${getDayShortId(date)} ${date.getDate()}/${date.getMonth() + 1}`;
}

export function formatFullDate(date: Date): string {
  return `${getDayNameId(date)}, ${date.getDate()} ${getMonthNameId(date)} ${date.getFullYear()}`;
}

export function getNextMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // if day is Sunday (0), we want to subtract 6 days. Otherwise subtract day - 1.
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  d.setDate(diff);
  return d;
}

export function getTodayIso(): string {
  return toIsoString(new Date());
}

export function getMonthYear(date: Date): string {
  return `${getMonthNameId(date)} ${date.getFullYear()}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
