export class AnneeScolaire {
  anneeDebut: number;
  anneeFin: number;

  constructor(anneeDebut: number) {
    this.anneeDebut = anneeDebut; // ex: 2024
    this.anneeFin = anneeDebut + 1;
  }

  startFormat() {
    const date = new Date(this.anneeDebut, 8, 1); // 1er septembre
    const day = date.getDate();
    const prefix = day === 1 ? '1er' : day.toString();
    const month = date.toLocaleDateString('fr-FR', { month: 'long' });
    const year = date.getFullYear();

    return `${prefix} ${month} ${year}`;
  }

  endFormat() {
    const date = new Date(this.anneeFin, 7, 31); // 31 août
    const day = date.getDate();
    const prefix = day === 1 ? '1er' : day.toString();
    const month = date.toLocaleDateString('fr-FR', { month: 'long' });
    const year = date.getFullYear();

    return `${prefix} ${month} ${year}`;
  }

  toString() {
    return `${this.anneeDebut}-${this.anneeFin}`;
  }

  // Méthode statique pour obtenir l'année scolaire actuelle
  getAnneeScolaireActuelle(date = new Date()) {
    const mois = date.getMonth() + 1; // Janvier = 0
    const annee = date.getFullYear();
    // Supposons que l'année scolaire commence en septembre
    const anneeDebut = mois >= 9 ? annee : annee - 1;
    return new AnneeScolaire(anneeDebut);
  }
}
