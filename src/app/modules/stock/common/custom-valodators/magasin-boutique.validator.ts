import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function magasinOrBoutiqueValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control || !control.get) return null;

    const magasinId = control.get('magasin_id')?.value;
    const boutiqueId = control.get('boutique_id')?.value;

    if ((magasinId && boutiqueId) || (!magasinId && !boutiqueId)) {
      return { magasinOrBoutique: true }; 
    }

    return null; 
  };
}
