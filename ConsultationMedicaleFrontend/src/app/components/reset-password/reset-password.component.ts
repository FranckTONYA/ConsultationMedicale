import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {

  step = 1;
  isLoading = false;
  resetToken: string | null = null;
  emailForm!: FormGroup;
  codeForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.codeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  sendEmail() {
    if (this.emailForm.invalid) return;
    this.isLoading = true;
    this.authService.startPasswordReset(this.emailForm.value.email!).subscribe({
      next: res => {
        this.resetToken = res.resetToken;
        sessionStorage.setItem('resetToken', this.resetToken!);
        this.snack.open('Code envoyé par e-mail !', 'Fermer', { duration: 4000 });
        this.step = 2;
      },
      error: (err) => this.snack.open('Erreur lors de l’envoi.', 'Fermer', { duration: 4000 }),
      complete: () => (this.isLoading = false)
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
        this.snack.open('Mot de passe réinitialisé avec succès !', 'Fermer', { duration: 4000 });
        sessionStorage.removeItem('resetToken');
        this.step = 3;
      },
      error: () => this.snack.open('Code incorrect ou expiré.', 'Fermer', { duration: 4000 }),
      complete: () => (this.isLoading = false)
    });
  }
}
