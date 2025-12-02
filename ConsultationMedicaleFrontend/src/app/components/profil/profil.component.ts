import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';
import { Patient } from '../../models/patient';
import { Medecin } from '../../models/medecin';
import Swal from 'sweetalert2';
import { Administrateur } from '../../models/administrateur';
import { UtilisateurService } from '../../core/services/utilisateur.service';
import { PatientService } from '../../core/services/patient.service';
import { MedecinService } from '../../core/services/medecin.service';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-profil',
  standalone: false,
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  user!: Utilisateur | Patient | Medecin;
  role = '';
  isLoading = true;
  currentUser = new Utilisateur();

  constructor(private authService: AuthService, 
    private router: Router, 
    private userService: UtilisateurService,
    private patientService: PatientService,
    private medecinService: MedecinService,
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    // Réagit aux changements d’infos de l'utilisateur couramment connecté
    this.authService.userInfo$.subscribe(info => {
      this.currentUser = info;
    });

    if (!this.currentUser) {
      Swal.fire('Erreur', 'Aucun utilisateur connecté.', 'error');
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getById(this.currentUser.id!).subscribe({
      next: (response: Utilisateur) => {
        this.user = response;
        this.role = this.user.role ?? '';
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', "Impossible de charger l'utilisateur", 'error');
      }
    });
  }

  private getUserService(role: RoleUtilisateur) {
  switch (role) {
    case RoleUtilisateur.PATIENT:
      return this.patientService;

    case RoleUtilisateur.MEDECIN:
      return this.medecinService;

    case RoleUtilisateur.ADMINISTRATEUR:
      return this.adminService;

    default:
      throw new Error("Rôle utilisateur inconnu : " + role);
  }
}


  // Getters sécurisés pour l’affichage
  get patient(): Patient | null {
    return this.role === RoleUtilisateur.PATIENT ? (this.user as Patient) : null;
  }

  get medecin(): Medecin | null {
    return this.role === RoleUtilisateur.MEDECIN ? (this.user as Medecin) : null;
  }

  get admin(): Administrateur | null {
    return this.role === RoleUtilisateur.ADMINISTRATEUR ? (this.user as Administrateur) : null;
  }

  goToEditProfile() {
    if(this.role === RoleUtilisateur.PATIENT)
      this.router.navigate(['/edit-patient', this.user.id]);
    if(this.role === RoleUtilisateur.MEDECIN)
      this.router.navigate(['/edit-medecin', this.user.id]);
    if(this.role === RoleUtilisateur.ADMINISTRATEUR)
      this.router.navigate(['/edit-admin', this.user.id]);
  }

  goToChangePassword() {
    Swal.fire({
      title: 'Confirmez-vous la modification du mot de passe ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/change-password']);
      }
    });
  }

  deleteAccount() {
      Swal.fire({
        title: 'Suppression définitive de votre compte ?',
        text: "Cette opération supprimera également tous les éléments liés à votre compte" ,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText:'Non',
      }).then(result => {
        if (result.isConfirmed) {
          this.isLoading = true;
          const service = this.getUserService(this.user.role!);
          service.delete(this.user.id!).subscribe({
            next: () => {
              this.isLoading = false;
              Swal.fire({
                icon: 'success',
                title: 'Suppréssion réussie',
                text: "Votre compte utilisateur a bien été supprimé !",
                timer: 1500,
                showConfirmButton: false
              });
              this.authService.logout();
            },
            error: () =>{
              this.isLoading = false;
              Swal.fire({
                icon: 'error',
                title: "Erreur de suppression",
                text: "La suppression de votre compte a rencontré une erreur.",
                showConfirmButton: true,
              });
            } 
          });
        }
      });
    }
  

}
