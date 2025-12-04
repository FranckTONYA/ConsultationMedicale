import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DossierMedical } from '../../models/dossier-medical';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-medical-file',
  standalone: false,
  templateUrl: './medical-file.component.html',
  styleUrl: './medical-file.component.css'
})
export class MedicalFileComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'id',
    'patient',
    'niss',
    'date',
    'groupeSanguin',
    'allergies',
    'actions'
  ];

  dataSource = new MatTableDataSource<DossierMedical>([]);
  isLoading = true;
  currentUser = new Utilisateur();
  RoleUtilisateur = RoleUtilisateur;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dossierService: DossierMedicalService,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    /** FilterPredicate défini une seule fois **/
    this.dataSource.filterPredicate = (data: DossierMedical, filter: string) => {
      const val = filter.trim().toLowerCase();

      const patientName = `${data?.patient?.prenom ?? ''} ${data?.patient?.nom ?? ''}`.toLowerCase();
      const niss = (data?.patient?.niss ?? '').toLowerCase();
      const groupe = (data?.groupeSanguin ?? '').toLowerCase();
      const allergies = (data?.allergies ?? []).join(' ').toLowerCase();

      const combined = `${patientName} ${niss} ${groupe} ${allergies}`;

      return combined.includes(val);
    };

    /** Récupération utilisateur + chargement des dossiers */
    this.authService.userInfo$.subscribe(info => {
      this.currentUser = info;

      if (info.role === RoleUtilisateur.MEDECIN) {
        this.loadDossiers(info.id!, false);
      } else {
        this.loadDossiers(info.id!, true);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  /** Charge les dossiers en tenant compte du rôle */
  loadDossiers(medecinId: number, modeAdmin: boolean) {
    this.isLoading = true;

    const source$ = modeAdmin
      ? this.dossierService.getAll()
      : this.dossierService.getByMedecin(medecinId);

    source$.subscribe({
    next: async (data) => {
      // Pour chaque dossier, récupérer le patient via l'endpoint dédié
      const dossiersWithPatient = await Promise.all(
        data.map(async d => {
          if (!d.patient) {
            try {
              const patient = await this.patientService.getByDossier(d.id!).toPromise();
              d.patient = patient!;
            } catch (e) {
               Swal.fire('Erreur', "Patient introuvable pour le dossier", 'error');
            }
          }
          return d;
        })
      );

      this.dataSource.data = dossiersWithPatient;
        this.isLoading = false;

        /** Si un filtre était actif : recalcul obligatoire */
        if (this.dataSource.filter) {
          const f = this.dataSource.filter;
          this.dataSource.filter = '';
          this.dataSource.filter = f;
        }
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', "Erreur rencontrée lors de l'opération", 'error');
      }
    });
  }

  /** Filtre instantané */
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = value.trim().toLowerCase();

    /** Revenir à la 1ère page */
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Navigation */
  voir(dossier: DossierMedical) {
    this.router.navigate(['/dossier-medical/details', dossier.id]);
  }

  modifier(dossier: DossierMedical) {
    this.router.navigate(['/dossier-medical/edit', dossier.id]);
  }

  goToUser(userId: number, role: RoleUtilisateur) {
    this.router.navigate(
      ['/user-details', userId],
      { state: { role } }
    );
  }

  openConversation(userId: number) {
    this.router.navigate(['/messaging/conversation', userId]);
  }
}
