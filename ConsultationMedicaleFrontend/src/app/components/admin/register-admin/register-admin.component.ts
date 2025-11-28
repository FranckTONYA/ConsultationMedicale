import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../../core/services/admin.service';
import { Administrateur } from '../../../models/administrateur';
import { AuthService } from '../../../core/services/auth.service';
import { RoleUtilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-register-admin',
  standalone: false,
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})
export class RegisterAdminComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isEditMode = false;
  adminId?: number;
  currentAdmin = new Administrateur();
  modeAdmin = false;
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
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
        this.adminId = +id;
        this.loadAdmin(this.adminId);

        // En mode édition → enlever validation mot de passe
        this.registerForm.get('motDePasse')?.clearValidators();
        this.registerForm.get('confirmPassword')?.clearValidators();
        this.registerForm.setValidators(null);
        this.registerForm.updateValueAndValidity();
      }
    });

    // Mise à jour de la validation confirmPassword
    this.registerForm.get('motDePasse')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
    this.isLoading = false;
  }

  initForm() {
    this.registerForm = this.fb.group(
      {
        nom: ['', Validators.required],
        prenom: ['', Validators.required],
        sexe: [null, Validators.required],
        adresse: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        motDePasse: [
          '',
          [
            Validators.required,
            this.strongPasswordValidator,
          ],
        ],
        confirmPassword: ['', Validators.required],
        role: [RoleUtilisateur.ADMINISTRATEUR]
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
    const pass = formGroup.get('motDePasse')?.value;
    const confirm = formGroup.get('confirmPassword')?.value;

    if (confirm === '') return null;
    if (pass !== confirm) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  loadAdmin(id: number) {
    this.isLoading = true;
    this.adminService.getById(id).subscribe({
      next: (admin: Administrateur) => {
        this.currentAdmin = admin;
        this.registerForm.patchValue(admin);
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger l’administrateur', 'error');
        this.isLoading = false;
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire('Champs manquants ou invalides', 'Merci de vérifier les informations.', 'warning');
      return;
    }

    this.isLoading = true;

    const adminData = { ...this.registerForm.value };
    delete adminData.confirmPassword;

    if (this.isEditMode && this.adminId) {
      // Si motDePasse vide → ne pas l’envoyer du tout → conserve l’ancien
      if (!adminData.motDePasse) {
        delete adminData.motDePasse;
      }

      this.adminService.update(this.adminId, adminData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Administrateur mis à jour.', 'success');
          this.isLoading = false;
          this.router.navigate([this.modeAdmin ? '/manage-admin' : '/profil']);
        },
        error: () => {
          Swal.fire('Erreur', 'Impossible de modifier.', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.authService.registerAdmin(adminData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Administrateur ajouté.', 'success');
          this.isLoading = false;
          this.router.navigate(['/manage-admin']);
        },
        error: (err) => {
          Swal.fire('Erreur', err.error?.error ?? 'Échec.', 'error');
          this.isLoading = false;
        }
      });
    }
  }
}
