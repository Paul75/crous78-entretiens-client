export class AnneeScolaire {
  anneeDebut: number;
  anneeFin: number;

  // Constantes pour les mois
  private static readonly MOIS_SEPTEMBRE: number = 8;
  private static readonly MOIS_AOUT: number = 7;

  constructor(anneeDebut: number) {
    this.anneeDebut = anneeDebut; // ex: 2024
    this.anneeFin = anneeDebut + 1;
  }

  startFormat() {
    const date = new Date(this.anneeDebut, AnneeScolaire.MOIS_SEPTEMBRE, 1); // 1er septembre
    const day = date.getDate();
    const prefix = day === 1 ? '1er' : day.toString();
    const month = date.toLocaleDateString('fr-FR', { month: 'long' });
    const year = date.getFullYear();

    return `${prefix} ${month} ${year}`;
  }

  endFormat() {
    const date = new Date(this.anneeFin, AnneeScolaire.MOIS_AOUT, 31); // 31 août
    const day = date.getDate();
    const prefix = day === 1 ? '1er' : day.toString();
    const month = date.toLocaleDateString('fr-FR', { month: 'long' });
    const year = date.getFullYear();

    return `${prefix} ${month} ${year}`;
  }

  toString() {
    return `${this.anneeDebut}-${this.anneeFin}`;
  }

  getDateFin(): Date {
    return new Date(this.anneeFin, AnneeScolaire.MOIS_AOUT, 31, 23, 59, 59); // 31 août à 23:59
  }

  getDateDebut(): Date {
    return new Date(this.anneeDebut, AnneeScolaire.MOIS_SEPTEMBRE, 1); // 1er septembre anneeDebut
  }

  // Méthode statique pour obtenir l'année scolaire actuelle
  static getAnneeScolaireActuelle(date = new Date()) {
    const mois = date.getMonth() + 1;
    const annee = date.getFullYear();
    const anneeDebut = mois >= 9 ? annee : annee - 1;
    return new AnneeScolaire(anneeDebut);
  }

  isInCurrentSchoolYear(date: string): boolean {
    const dd = new Date(date);
    const start = new Date(this.anneeDebut, AnneeScolaire.MOIS_SEPTEMBRE, 1); // 1er septembre anneeDebut
    const end = new Date(this.anneeFin, AnneeScolaire.MOIS_AOUT, 31, 23, 59, 59); // 31 août anneeFin

    return dd >= start && dd <= end;
  }
}
