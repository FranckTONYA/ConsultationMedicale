import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verify-code',
  standalone: false,
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.css'
})
export class VerifyCodeComponent implements OnInit {

  isLoading = false;
  verifyForm!: FormGroup;
  verificationToken!: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    this.verificationToken = nav?.extras?.state?.['verificationToken'] || null;
  }

  ngOnInit(): void {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  onSubmit() {
    const verificationToken = sessionStorage.getItem('verificationToken');
    const code = this.verifyForm.value.code;

    if (!verificationToken) {
      Swal.fire({
        icon: 'error',
        title: 'Jeton de vérification introuvable ',
        text: 'Veuillez recommencer l’inscription.',
        showConfirmButton: true,
      });
      return;
    }

    if (this.verifyForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Code invalide',
        text: 'Veuillez entrer le code à 6 chiffres envoyé par mail.',
        showConfirmButton: true,
      });
      return;
    }

    this.isLoading = true;

    this.authService.verifyPatientRegistCode(verificationToken, code!).subscribe({
      next: () => {
        Swal.fire({
                      icon: 'success',
                      title: 'Compte vérifié avec succès',
                      text: 'Vous pouvez maintenant vous connecter.',
                      showConfirmButton: true,
                    });
        sessionStorage.removeItem('verificationToken');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snack.open('Code incorrect ou expiré. Réessayez.', 'Fermer', { duration: 4000 });
        Swal.fire({
        icon: 'error',
        title: 'Code incorrect ou expiré',
        text: "Veuillez entrer le code à 6 chiffres envoyé par mail ou recommencer l'incription.",
        showConfirmButton: true,
      });
      },
    });
    this.isLoading = false
  }
}