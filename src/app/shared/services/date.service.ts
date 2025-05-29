import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  getCurrentDate(): string {
    const now = new Date();
    return formatDate(now, 'dd/MM/yyyy', 'fr-FR');
  }

  transformDateEn(date: string): string {
    /*const [day, month, year] = date.split('/');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    return this.datePipe.transform(dateObj, 'yyyy-MM-dd') || '';*/

    const [day, month, year] = date.split('/');
    // Assurez-vous que le mois et le jour ont deux chiffres
    const formattedMonth = month.padStart(2, '0');
    const formattedDay = day.padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  formatDateOrEmpty(date: string): string {
    return date ? formatDate(date, 'dd/MM/yyyy', 'fr') : '';
  }
}