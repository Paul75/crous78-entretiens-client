export class AgentModel {
  
  nom_usage: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  corps_grade: string;
  echelon: string;
  date_promotion: string;
  fonction: string;
  adresse: string;
  ville: string;

  constructor() {
    this.nom_usage = '';
    this.nom = '';
    this.prenom = '';
    this.date_naissance = '';
    this.corps_grade = '';
    this.echelon = '';
    this.date_promotion = '';
    this.fonction = '';
    this.adresse = '';
    this.ville = '';
  }
}
