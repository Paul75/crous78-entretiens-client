export class AnneeScolaire {
  anneeDebut: number;
  anneeFin: number;

  constructor(anneeDebut: number) {
    this.anneeDebut = anneeDebut; // ex: 2024
    this.anneeFin = anneeDebut + 1;
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
