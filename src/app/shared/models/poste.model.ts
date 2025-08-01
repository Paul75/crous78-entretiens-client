import { Personne } from './personne.model';

export interface Poste {
  id?: number;
  dateAffectation: string;
  fonction?: string;
  emploiType?: string;
  fdpCategorie?: string;
  fdpCorps?: string;

  affectationAdministrative?: string;
  affectationGeographique?: string;

  missions?: string;

  encadrement?: boolean;
  conduiteProjet?: boolean;
  cpeNbAgent?: number;
  cpeCategA?: number;
  cpeCategB?: number;
  cpeCategC?: number;

  competencesConnaissances?: string;
  competencesSavoirFaire?: string;
  competencesSavoirEtre?: string;

  personne?: Personne;
  personneId?: number;

  nouveau?: boolean; // Indique si le poste est nouveau
}
