import { DatePipe, formatDate } from '@angular/common';

export function getCurrentDate(): string {
  const now = new Date();

  return formatDate(now, 'dd/MM/yyyy HH:mm:ss', 'fr-FR');
}

export function transformDateEn(date: string): string {
  const [day, month, year] = date.split('/');

  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

  return new DatePipe('fr_FR').transform(dateObj, 'yyyy-MM-dd') || '';
}