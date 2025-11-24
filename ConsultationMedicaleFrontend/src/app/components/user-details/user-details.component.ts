import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';
import { Patient } from '../../models/patient';
import { Medecin } from '../../models/medecin';
import { Administrateur } from '../../models/administrateur';

import { PatientService } from '../../core/services/patient.service';
import { MedecinService } from '../../core/services/medecin.service';
import { AdminService } from '../../core/services/admin.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-details',
  standalone: false,
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  isLoading = true;
  role!: RoleUtilisateur;
  id!: number;
  RoleUtilisateur = RoleUtilisateur;

  user!: Utilisateur | Patient | Medecin | Administrateur;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private medecinService: MedecinService,
    private adminService: AdminService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.role = nav?.extras?.state?.['role'] as RoleUtilisateur;
  }

  ngOnInit() {
    this.id = +(this.route.snapshot.paramMap.get("id")!);

    this.loadUser();
  }

  loadUser() {

    let request: Observable<any>;

    switch (this.role) {
      case RoleUtilisateur.PATIENT:
        request = this.patientService.getById(this.id);
        break;

      case RoleUtilisateur.MEDECIN:
        request = this.medecinService.getById(this.id);
        break;

      case RoleUtilisateur.ADMINISTRATEUR:
        request = this.adminService.getById(this.id);
        break;

      default:
        Swal.fire("Erreur", "Rôle inconnu", "error");
        return;
    }

    request.subscribe({
      next: (data: any) => {
        this.user = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire("Erreur", "Impossible de charger l'utilisateur", "error");
      }
    });
  }

  get asPatient(): Patient | null {
    return this.user?.role === RoleUtilisateur.PATIENT ? this.user as Patient : null;
  }

  get asMedecin(): Medecin | null {
    return this.user?.role === RoleUtilisateur.MEDECIN ? this.user as Medecin : null;
  }

  get asAdmin(): Administrateur | null {
    return this.user?.role === RoleUtilisateur.ADMINISTRATEUR ? this.user as Administrateur : null;
  }


  // retour() {
  //   this.router.navigate(['/user/list']);
  // }
}
