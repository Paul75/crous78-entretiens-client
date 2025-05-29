export class AgentModel {
  id: number;
  matricule: string;
  nomUsage: string;
  nom: string;
  prenom: string;
  dateNaissance: string|null;
  corpsGrade: string;
  echelon: string;
  datePromotion: string|null;
  fonction: string;
  structure: string;
  adresse: string;
  ville: string;

  constructor() {
    this.id = 0;
    this.matricule = '';
    this.nomUsage = '';
    this.nom = '';
    this.prenom = '';
    this.dateNaissance = null;
    this.corpsGrade = '';
    this.echelon = '';
    this.datePromotion = null;
    this.fonction = '';
    this.structure = '';
    this.adresse = '';
    this.ville = '';
  }
}
