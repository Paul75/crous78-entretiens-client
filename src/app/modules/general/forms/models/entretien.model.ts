import { TypeEntretien } from "../enums/type-entretien.enum";
import { AgentModel } from "./agent.model";

export class EntretienModel {
  
    type: TypeEntretien;
    agent: AgentModel;
    superieur: AgentModel;
    date_entretien: string;
    
    constructor() {
        this.type = TypeEntretien.ENTRETIEN_PRO;
        this.agent = new AgentModel();
        this.superieur = new AgentModel();
        this.date_entretien = '';
    }
  }
  