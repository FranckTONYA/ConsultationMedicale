import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../models/patient';
import { RoleUtilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-register-patient',
  standalone: false,
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isEditMode = false;
  patientId?: number;
  currentPatient = new Patient();
  verificationToken: string | null = null;
  modeAdmin = false;
  isLoading = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    this.modeAdmin = nav?.extras?.state?.['modeAdmin'] || false;
  }

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.patientId = +id;
        this.loadPatient(this.patientId);

        // Supprime les validations mot de passe en mode édition
        const passwordControl = this.registerForm.get('motDePasse');
        const confirmControl = this.registerForm.get('confirmPassword');
        passwordControl?.clearValidators();
        confirmControl?.clearValidators();
        passwordControl?.updateValueAndValidity();
        confirmControl?.updateValueAndValidity();

         // Supprimer le validateur global
        this.registerForm.setValidators(null);
        this.registerForm.updateValueAndValidity();
      }
    });

    // Rafraîchit la validation à chaque frappe sur les deux champs
    this.registerForm.get('motDePasse')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity({ onlySelf: true });
    });

  }

  initForm() {
    this.registerForm = this.fb.group(
      {
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        sexe: [null, Validators.required],
        niss: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
        dateNaissance: ['', Validators.required],
        adresse: ['', Validators.required],
        telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        email: ['', [Validators.required, Validators.email]],
        motDePasse: [
          '',
          [
            Validators.required,
            this.strongPasswordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
        role: [RoleUtilisateur.PATIENT],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  strongPasswordValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    // Min 8 caractères, 1 maj, 1 chiffre, 1 symbole
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]).{8,}$/;

    return strongPasswordRegex.test(value)
      ? null
      : { weakPassword: true };
  }

  passwordMatchValidator(formGroup: AbstractControl) {
    const passwordControl = formGroup.get('motDePasse');
    const confirmControl = formGroup.get('confirmPassword');

    if (!passwordControl || !confirmControl) return null;

    const password = passwordControl.value;
    const confirm = confirmControl.value;

    if (confirm === '') {
      confirmControl.setErrors(confirmControl.errors ? { ...confirmControl.errors, required: true } : { required: true });
      return null;
    }

    if (password !== confirm) {
      confirmControl.setErrors({ ...confirmControl.errors, passwordMismatch: true });
    } else {
      if (confirmControl.hasError('passwordMismatch')) {
        delete confirmControl.errors!['passwordMismatch'];
        if (!Object.keys(confirmControl.errors!).length) {
          confirmControl.setErrors(null);
        } else {
          confirmControl.setErrors(confirmControl.errors);
        }
      }
    }

    return null;
  }


  loadPatient(id: number) {
    this.patientService.getById(id).subscribe({
      next: (patient: Patient) => {
        this.currentPatient = patient;
        this.registerForm.patchValue(patient);
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger le patient', 'error');
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants ou invalides',
        text: 'Merci de vérifier les informations saisies.',
      });
      return;
    }

    const patientData = { ...this.registerForm.value };
    delete patientData.confirmPassword; // inutile pour le backend

    this.isLoading = true;

    if (this.isEditMode && this.patientId) {
      this.patientService.update(this.patientId, patientData).subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Succès', 'Patient mis à jour.', 'success');
          this.router.navigate([this.modeAdmin ? '/manage-patient' : '/profil']);
        },
        error: () =>{ 
          this.isLoading = false;
          Swal.fire('Erreur', 'Impossible de modifier le patient.', 'error');
        }
      });
    } else {
      if (this.modeAdmin) {
        this.authService.registerPatient(patientData).subscribe({
          next: () => {
            this.isLoading = false;
            Swal.fire('Succès', 'Patient ajouté.', 'success');
            this.router.navigate(['/manage-patient']);
          },
          error: (err) => {
            this.isLoading = false;
            Swal.fire('Erreur', err.error?.error ?? 'Échec lors de l’inscription.', 'error');
          }
        });
      } else {
        this.authService.startPatientRegistration(patientData).subscribe({
          next: (res) => {
            this.isLoading = false;
            this.verificationToken = res.verificationToken;
            sessionStorage.setItem('verificationToken', this.verificationToken!);
            Swal.fire({
              icon: 'info',
              title: 'Vérification requise',
              text: 'Un code vous a été envoyé par e-mail.',
            });
            this.router.navigate(['/verify-code'], {
              state: { verificationToken: this.verificationToken },
            });
          },
          error: (err) =>{
            this.isLoading = false;
            Swal.fire('Erreur', err.error?.error ?? 'Échec lors de l’inscription.', 'error');
          } 
        });
      }
    }
  }
}
