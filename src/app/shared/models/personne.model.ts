import { Poste } from './poste.model';

export interface Personne {
  id: number;
  matricule: string;
  nomUsage: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  corpsGrade: string;
  echelon: string;
  datePromotion?: string | null;
  fonction: string;
  structure: string;
  adresse: string;
  ville: string;
  isNew?: boolean;
  isActif?: boolean;
  postes?: Poste[] | null;
}
