import { Component, OnInit } from '@angular/core';
import { DossierMedical } from '../../models/dossier-medical';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-medical-file',
  standalone: false,
  templateUrl: './medical-file.component.html',
  styleUrl: './medical-file.component.css'
})
export class MedicalFileComponent implements OnInit {

  displayedColumns: string[] = [
    'patient',
    'niss',
    'groupeSanguin',
    'allergies',
    'actions'
  ];
  
  dossiers: DossierMedical[] = [];
  isLoading = true;
  currentUser = new Utilisateur();

  constructor(
    private dossierService: DossierMedicalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Réagit aux changements d’infos de l'utilisateur couramment connecté
    this.authService.userInfo$.subscribe(info => {
      this.currentUser = info;
      this.loadDossiers(this.currentUser.id!);
    });
  }

  loadDossiers(medecinId: number) {
    // this.dossierService.getByMedecin(medecinId).subscribe({
    //   next: (data) => {
    //     this.dossiers = data;
    //     this.isLoading = false;
    //   },
    //   error: () => {
    //     this.isLoading = false;
    //   }
    // });

    this.dossierService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.dossiers = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  voir(dossier: DossierMedical) {
    this.router.navigate(['/dossier-medical/details', dossier.id]);
  }

  modifier(dossier: DossierMedical) {
    this.router.navigate(['/dossier-medical/edit', dossier.id]);
  }
}
