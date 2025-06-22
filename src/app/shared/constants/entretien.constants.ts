import { AppreciationGeneraleEnum } from '../enums/appreciation_generale.enum';
import { TypeEntretien } from '../enums/type-entretien.enum';
import { DEFAUT_FORMATIONS_DISPENSEES } from './formations-dispensees.constants';
import { DEFAULT_PERSONNE } from './personne.constants';

export const URL_ENTRETIENS = 'entretien';
export const NAME_ENTRETIEN = 'Entretien';

export const DEFAULT_ENTRETIEN = {
  id: 0,
  type: TypeEntretien.ENTRETIEN_PRO,
  statut: '',
  dateEntretien: '',
  structure: '',
  intitulePoste: '',
  dateAffectation: '',
  emploiType: '',
  positionPoste: '',
  quotiteAffectation: '',
  missions: '',
  conduiteProjet: false,
  encadrement: false,
  cpeNbAgent: 0,
  cpeCategA: 0,
  cpeCategB: 0,
  cpeCategC: 0,
  rappelObjectifs: '',
  evenementsSurvenus: '',
  caCompetences: '',
  caContribution: '',
  caCapacites: '',
  caAptitude: '',
  agCompetences: AppreciationGeneraleEnum.NON_EVALUABLE,
  agContribution: AppreciationGeneraleEnum.NON_EVALUABLE,
  agCapacites: AppreciationGeneraleEnum.NON_EVALUABLE,
  agAptitude: AppreciationGeneraleEnum.NON_EVALUABLE,
  realisationObjectifs: '',
  appreciationLitterale: '',
  acquisExperiencePro: '',
  objectifsActivites: '',
  demarcheEnvisagee: '',
  evolutionActivites: '',
  evolutionCarriere: '',
  personne: DEFAULT_PERSONNE,
  superieur: DEFAULT_PERSONNE,
  commentairesEvaluation: '',
  commentairesEvaluationPerspectives: '',

  // ajout pour form entretien formation
  dateEntretienPrecedent: '',
  soldeCPF: 0,
  utiliserCPF: false,

  competenceTransferFormateur: '',
  competenceTransferTuteur: '',
  competenceTransferPresident: '',
  competenceTransferMembre: '',

  formationsDispensees: DEFAUT_FORMATIONS_DISPENSEES,

  formationsPreparationConcours: '',
  formationsConstruireProjet: '',
};
