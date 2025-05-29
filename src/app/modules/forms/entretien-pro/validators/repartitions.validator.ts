import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export const customRepartitionsValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    /*conduite_projet: ['', [Validators.required]],
    encadrement: ['', [Validators.required]],
    nombre_agents: ['', [Validators.required]],
    repartition: new FormBuilder().group({
        a: ['', [Validators.required]],
        b: ['', [Validators.required]],
        c: ['', [Validators.required]]
    })*/

    const conduiteProjet = group.get('conduite_projet')?.value;
    const encadrement = group.get('encadrement')!.value;
    const nombre_agents = group.get('nombre_agents')!.value;

    // console.log('conduite_projet: ', conduiteProjet);
    // console.log('encadrement: ', encadrement);
    // console.log('(conduite_projet && encadrement): ', !(conduiteProjet && encadrement) ? { mismatch: true } : true);

    // console.log('nombre_agents: ', nombre_agents);

    if (conduiteProjet || encadrement) {
        return null; // Pas d'erreur, au moins un des deux est true
    } else {
        return { customRepartitionsValidator: 'Au moins un des deux champs doit être true' };
    }

    // return !(conduite_projet && encadrement) ? { mismatch: true } : true;

    // const a = group.get('a')?.value;
    // const b = group.get('b')?.value;
    // return a === b ? { mismatch: true } : false;
}