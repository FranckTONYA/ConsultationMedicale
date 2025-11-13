import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DossierMedical } from '../../models/dossier-medical';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-medical-file',
  standalone: false,
  templateUrl: './medical-file.component.html',
  styleUrl: './medical-file.component.css'
})
export class MedicalFileComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'patient',
    'niss',
    'groupeSanguin',
    'allergies',
    'actions'
  ];

  dataSource = new MatTableDataSource<DossierMedical>([]);
  isLoading = true;
  currentUser = new Utilisateur();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private dossierService: DossierMedicalService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // définir le filterPredicate *avant* de remplir dataSource
    this.dataSource.filterPredicate = (data: DossierMedical, filter: string) => {
      const search = filter.trim().toLowerCase();

      // Construire la chaîne à chercher : prénom + nom + NISS + groupe etc.
      const patientName = `${data?.patient?.prenom ?? ''} ${data?.patient?.nom ?? ''}`.toLowerCase();
      const niss = (data?.patient?.niss ?? '').toLowerCase();
      const groupe = (data?.groupeSanguin ?? '').toLowerCase();
      const allergies = (data?.allergies ?? []).join(' ').toLowerCase();

      const combined = `${patientName} ${niss} ${groupe} ${allergies}`;

      return combined.includes(search);
    };

    this.authService.userInfo$.subscribe(info => {
      this.currentUser = info;
      if(info.role == RoleUtilisateur.MEDECIN)
        this.loadDossiers(this.currentUser.id!, false);
      else
        this.loadDossiers(this.currentUser.id!, true);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadDossiers(medecinId: number, modeAdmin: boolean) {
    if(modeAdmin){
      this.dossierService.getAll().subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    } else{
        this.dossierService.getByMedecin(medecinId).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    }

    // si un filtre est actif, forcer le recalcul
    if (this.dataSource.filter) {
      const f = this.dataSource.filter;
      this.dataSource.filter = '';              // reset
      this.dataSource.filter = f;               // ré-apply
    }

  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = value.trim().toLowerCase();

    // retourne à la première page si la pagination est active
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  voir(dossier: DossierMedical) {
    this.router.navigate(['/dossier-medical/details', dossier.id]);
  }

  modifier(dossier: DossierMedical) {
    this.router.navigate(['/dossier-medical/edit', dossier.id]);
  }
}
