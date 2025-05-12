import { Injectable } from "@angular/core";
import { NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";


const I18N_VALUES: any = {
    'fr': {
        weekdays: {
            short: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            long: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
        },
        months: {
            short: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Déc'],
            long: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
        },
    }
    // other languages you would support
};

@Injectable()
export class I18n {
  language = 'fr';
}

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {
    constructor(private _i18n: I18n) {
        super();
    }
    

    getWeekdayShortName(weekday: number): string {
        return I18N_VALUES[this._i18n.language].weekdays.short[weekday - 1];
    }
    getMonthShortName(month: number): string {
        return I18N_VALUES[this._i18n.language].months.short[month - 1];
    }
    getMonthFullName(month: number): string {
        return I18N_VALUES[this._i18n.language].months.long[month - 1];
    }
    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }
    
    getWeekdayLabel(weekday: number, width?: 'short' | 'long'): string {
        return width === 'long' ? I18N_VALUES[this._i18n.language].weekdays.long[weekday-1] : I18N_VALUES[this._i18n.language].weekdays.short[weekday-1];
    }
    
}