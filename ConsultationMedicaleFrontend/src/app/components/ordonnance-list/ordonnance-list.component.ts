import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { OrdonnanceService } from '../../core/services/ordonnance.service';
import { Ordonnance } from '../../models/ordonnance';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-ordonnance-list',
  standalone: false,
  templateUrl: './ordonnance-list.component.html',
  styleUrls: ['./ordonnance-list.component.css']
})
export class OrdonnanceListComponent implements OnInit, AfterViewInit {
  currentUser!: Utilisateur;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Ordonnance>([]);
  searchText: string = '';
  isPatient = false;
  isMedecin = false;
  isLoading = true;
  RoleUtilisateur = RoleUtilisateur;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthService,
    private ordonnanceService: OrdonnanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Filter predicate compatible pagination + JSON filter
    this.dataSource.filterPredicate = (data: Ordonnance, filter: string) => {
      let parsed = { text: '' };

      try {
        parsed = JSON.parse(filter);
      } catch {}

      const text = parsed.text.toLowerCase().trim();

      const textToSearch = this.isMedecin
        ? `${data.patient?.prenom ?? ''} ${data.patient?.nom ?? ''} ${data.patient?.niss ?? ''}`
        : `${data.medecin?.prenom ?? ''} ${data.medecin?.nom ?? ''}`;

      return textToSearch.toLowerCase().includes(text);
    };

    this.authService.userInfo$.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isPatient = user.role === RoleUtilisateur.PATIENT;
        this.isMedecin = user.role === RoleUtilisateur.MEDECIN;

        this.displayedColumns = this.isMedecin
          ? ['id', 'patientNom', 'patientNiss', 'contenu', 'date', 'actions']
          : ['id', 'medecinNom', 'medecinINAMI', 'contenu', 'date', 'actions'];

        this.loadOrdonnances();
      },
      error: () => {
        Swal.fire('Erreur', "Impossible de charger l'utilisateur connecté", 'error');
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadOrdonnances() {
    this.isLoading = true;

    const obs = this.isMedecin
      ? this.ordonnanceService.getByMedecin(this.currentUser.id!)
      : this.ordonnanceService.getByPatient(this.currentUser.id!);

    obs.subscribe({
      next: (data) => {
         // Tri décroissant par date
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.dataSource.data = data;
        this.applyCombinedFilter();
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de charger les ordonnances', 'error');
        this.isLoading = false;
      }
    });
  }

  // Méthode centralisée pour pagination + filtres
  applyCombinedFilter() {
    const filterObj = {
      text: this.searchText || ''
    };

    this.dataSource.filter = JSON.stringify(filterObj);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    }
  }

  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value || '';
    this.applyCombinedFilter();
  }

  creerOrdonnance() {
    this.router.navigate(['/ordonnance/edit']);
  }

  voirDetails(ord: Ordonnance) {
    this.router.navigate(['/ordonnance/details', ord.id]);
  }

  editOrdonnance(ord: Ordonnance) {
    this.router.navigate(['/ordonnance/edit', ord.id]);
  }

  deleteOrdonnance(ord: Ordonnance) {
    this.isLoading = true;
    Swal.fire({
      title: 'Supprimer cette ordonnance avec tous les documents associés ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.isConfirmed) {
        this.ordonnanceService.delete(ord.id!).subscribe({
          next: () => {
            Swal.fire('Succès', 'Ordonnance supprimée', 'success');
            this.loadOrdonnances();
            this.isLoading = false;
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible de supprimer', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  goToUser(userId: number, role: RoleUtilisateur) {
    this.router.navigate(
      ['/user-details', userId],
      { state: { role } }
    );
  }
}
