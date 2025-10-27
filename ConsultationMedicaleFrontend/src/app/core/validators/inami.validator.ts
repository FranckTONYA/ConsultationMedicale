// inami.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function inamiValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value || '').replace(/\D/g, ''); // Supprime tout sauf les chiffres

    if (!value) return null; // champ vide => pas d'erreur si non requis
    if (value.length !== 11) {
      return { inamiLength: true };
    }

    const num9 = parseInt(value.substring(0, 9), 10);
    const controlDigits = parseInt(value.substring(9, 11), 10);

    const expected = 97 - (num9 % 97);
    if (expected === controlDigits) return null;

    // Cas particulier : numéros commençant par 2 (médecins récents)
    const altExpected = 97 - ((2000000000 + num9) % 97);
    if (altExpected === controlDigits) return null;

    return { inamiInvalid: true };
  };
}
