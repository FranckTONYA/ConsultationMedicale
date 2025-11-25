import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { Utilisateur } from '../../models/utilisateur';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: false,
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  isLoading = false;
  resetToken: string | null = null;
  codeForm!: FormGroup;
  currentUser!: Utilisateur;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private fb: FormBuilder,
     private authService: AuthService,
    private snack: MatSnackBar,
    private router: Router
    ) {}

  ngOnInit(): void {
    Swal.fire({
      icon: 'info',
      title: 'Vérification requise',
      text: 'Un code vous a été envoyé par e-mail',
      showConfirmButton: true,
    });
    this.authService.userInfo$.subscribe(info => {
      this.currentUser = info;
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      newPassword: [
        '',
        [
          Validators.required,
          this.strongPasswordValidator,
        ],

      ],
      confirmPassword: ['', Validators.required]
    },
    { validators: this.passwordMatchValidator }
  );

    if(this.currentUser)
      this.sendEmail();
    else{
       Swal.fire({
          icon: 'error',
          title: "Erreur",
          text: "Erreur rencontrée pendant l'opération",
          showConfirmButton: true,
        });
    }

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
    const passwordControl = formGroup.get('newPassword');
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

  sendEmail() {
    this.isLoading = true;
    this.authService.startPasswordReset(this.currentUser.email!).subscribe({
      next: res => {
        this.resetToken = res.resetToken;
        sessionStorage.setItem('resetToken', this.resetToken!);
        this.isLoading = false
      },
      error: (err) => {
        this.isLoading = false
        Swal.fire({
          icon: 'error',
          title: "Echec d'envoi",
          text: 'Erreur lors de l’envoi du code par e-mail',
          showConfirmButton: true,
        });
      }
    });
  }

  verifyCode() {
    const token = sessionStorage.getItem('resetToken');
    const code = this.codeForm.value.code;
    const newPassword = this.codeForm.value.newPassword;

    if (!token || this.codeForm.invalid) return;

    this.isLoading = true;
    this.authService.verifyPasswordCode(token, code!, newPassword!).subscribe({
      next: () => {
        this.isLoading = false
        Swal.fire({
          icon: 'success',
          title: 'Action reussie',
          text: 'Mot de passe réinitialisé avec succès ',
          showConfirmButton: true,
        });
        sessionStorage.removeItem('resetToken');
        this.router.navigate(['/profil']);
      },
      error: () =>{
        this.isLoading = false
        Swal.fire({
          icon: 'error',
          title: "Erreur de validation",
          text: 'Code incorrect ou expiré.',
          showConfirmButton: true,
        });
      }
    });
  }
}

