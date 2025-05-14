import { TypeEntretien } from "../enums/type-entretien.enum";
import { AgentModel } from "./agent.model";

export class EntretienModel {
  
    type: TypeEntretien;
    agent: AgentModel;
    superieur: AgentModel;
    dateEntretien: Date;
    
    constructor() {
        this.type = TypeEntretien.ENTRETIEN_PRO;
        this.agent = new AgentModel();
        this.superieur = new AgentModel();
        this.dateEntretien = new Date();
    }
  }
  