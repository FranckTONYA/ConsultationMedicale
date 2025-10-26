import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm!: FormGroup;
  hidePassword = true;
  user : Utilisateur = new Utilisateur(); 
  role = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs correctement.',
      });
      return;
    }

    const { email, motDePasse } = this.loginForm.value;
    this.authService.login(email, motDePasse).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie',
          text: 'Bienvenue sur MediConsult !',
          timer: 1500,
          showConfirmButton: false
        });
        this.authService.userInfo$.subscribe(info => {
          if(info){
            this.user = info;
            this.role = (this.user && this.user.role) ? this.user.role: "" ;
          }
        });
        
        if(this.role.length !== 0){
          if(this.role === RoleUtilisateur.ADMINISTRATEUR)
             this.router.navigate(['/dashboard-admin']);
          if(this.role === RoleUtilisateur.MEDECIN)
             this.router.navigate(['/dashboard-medecin']);
          if(this.role === RoleUtilisateur.PATIENT)
             this.router.navigate(['/dashboard-patient']);
        }
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Échec de connexion',
          text: 'Email ou mot de passe incorrect.',
        });
        console.error(err);
      }
    });
  }
}
