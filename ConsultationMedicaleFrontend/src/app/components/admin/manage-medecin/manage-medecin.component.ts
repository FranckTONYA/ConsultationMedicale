import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MedecinService } from '../../../core/services/medecin.service';
import { Medecin } from '../../../models/medecin';
import { RoleUtilisateur } from '../../../models/utilisateur';

@Component({
  selector: 'app-manage-medecin',
  standalone: false,
  templateUrl: './manage-medecin.component.html',
  styleUrls: ['./manage-medecin.component.css']
})
export class ManageMedecinComponent implements OnInit, AfterViewInit {

  displayedColumns = [
    'id', 
    'nom', 
    'prenom', 
    'sexe',
    'specialite', 
    'numINAMI', 
    'telephone', 
    'email', 
    'actions'
  ];

  dataSource = new MatTableDataSource<Medecin>([]);
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private medecinService: MedecinService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMedecins();
  }

  ngAfterViewInit() {
    // requis pour éviter erreurs d'initialisation
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  loadMedecins() {
    this.isLoading = true;

    this.medecinService.getAll().subscribe({
      next: (data: Medecin[]) => {
        this.dataSource.data = data;

        // Configure le paginator si déjà dispo
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }

        // Fix filtrage pour plusieurs colonnes
        this.dataSource.filterPredicate = (row: Medecin, filter: string) =>
          `${row.nom} ${row.prenom} ${row.sexe} ${row.specialite} ${row.numINAMI} ${row.email}`
            .toLowerCase()
            .includes(filter);

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', 'Impossible de charger les médecins.', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addMedecin() {
    this.router.navigate(['/register-medecin'], { state: { modeAdmin: true }});
  }

  editMedecin(id: number) {
    this.router.navigate(['/edit-medecin', id], { state: { modeAdmin: true }});
  }

  voirDetails(userId: number) {
    this.router.navigate(
      ['/user-details', userId],
      { state: { role :  RoleUtilisateur.MEDECIN} }
    );
  }

  openConversation(userId: number) {
    this.router.navigate(['/messaging/conversation', userId]);
  }

  deleteMedecin(id: number) {
    Swal.fire({
      title: 'Supprimer ce médecin ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then(result => {
      if (result.isConfirmed) {

        this.medecinService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Supprimé',
              text: 'Le médecin a été supprimé.',
              timer: 1500,
              showConfirmButton: false
            });

            this.loadMedecins(); // refresh propre
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'La suppression a échoué.',
            });
          }
        });

      }
    });
  }
}
