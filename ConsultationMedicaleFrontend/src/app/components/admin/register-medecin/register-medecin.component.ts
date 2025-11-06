import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MedecinService } from '../../../core/services/medecin.service';
import { Medecin } from '../../../models/medecin';
import { AuthService } from '../../../core/services/auth.service';
import { RoleUtilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-register-medecin',
  standalone: false,
  templateUrl: './register-medecin.component.html',
  styleUrls: ['./register-medecin.component.css']
})
export class RegisterMedecinComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isEditMode = false;
  medecinId?: number;
  currentMedecin = new Medecin();
  modeAdmin = false;

  constructor(
    private fb: FormBuilder,
    private medecinService: MedecinService,
    private authService: AuthService,
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
        this.medecinId = +id;
        this.loadMedecin(this.medecinId);

        // ✅ En mode édition → retirer les validations mot de passe
        this.registerForm.get('motDePasse')?.clearValidators();
        this.registerForm.get('confirmPassword')?.clearValidators();
        this.registerForm.setValidators(null);
        this.registerForm.updateValueAndValidity();
      }
    });

    // ✅ mise à jour auto de la validation
    this.registerForm.get('motDePasse')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  initForm() {
    this.registerForm = this.fb.group(
      {
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        specialite: ['', Validators.required],
        numINAMI: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
        adresse: ['', Validators.required],
        telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        email: ['', [Validators.required, Validators.email]],
        motDePasse: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: [RoleUtilisateur.MEDECIN],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(formGroup: AbstractControl) {
    const password = formGroup.get('motDePasse')?.value;
    const confirm = formGroup.get('confirmPassword')?.value;

    if (confirm === '') return null;

    if (password !== confirm) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  loadMedecin(id: number) {
    this.medecinService.getById(id).subscribe({
      next: (m: Medecin) => {
        this.currentMedecin = m;
        this.registerForm.patchValue(m);
      },
      error: () => Swal.fire('Erreur', 'Impossible de charger le médecin', 'error'),
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire('Champs manquants ou invalides', 'Merci de vérifier les informations.', 'warning');
      return;
    }

    const medecinData = { ...this.registerForm.value };
    delete medecinData.confirmPassword;

    if (this.isEditMode && this.medecinId) {
      this.medecinService.update(this.medecinId, medecinData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Médecin mis à jour.', 'success');
          this.router.navigate([this.modeAdmin ? '/manage-medecin' : '/profil']);
        },
        error: () => Swal.fire('Erreur', 'Impossible de modifier.', 'error'),
      });
    } else {
      this.authService.registerMedecin(medecinData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Médecin ajouté.', 'success');
          this.router.navigate(['/manage-medecin']);
        },
        error: (err) => Swal.fire('Erreur', err.error?.error ?? 'Échec.', 'error'),
      });
    }
  }
}
