import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MedecinService } from '../../core/services/medecin.service';
import { Medecin } from '../../models/medecin';
import { Patient } from '../../models/patient';
import { AuthService } from '../../core/services/auth.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-consent-management',
  standalone: false,
  templateUrl: './consent-management.component.html',
  styleUrl: './consent-management.component.css'
})
export class ConsentManagementComponent implements OnInit, AfterViewInit {

  currentPatient = new Patient();
  assignedMedecins: MatTableDataSource<Medecin> = new MatTableDataSource<Medecin>([]);
  displayedColumns: string[] = ['nom', 'specialite', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchControl = new FormControl('');
  searchedMedecin: Medecin | null = null;

  constructor(
    private medecinService: MedecinService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentPatient();

    this.searchControl.valueChanges.subscribe(value => {
      if (value && value.length >= 3) {
        this.medecinService.getByINAMI(Number(value)).subscribe({
          next: (medecin: Medecin) => {
            console.log(medecin);
            // Si déjà assigné, ne pas proposer
            if (!this.assignedMedecins.data.some(m => m.id === medecin.id)) {
              this.searchedMedecin = medecin;
            } else {
              this.searchedMedecin = null;
            }
          },
          error: () => {
            this.searchedMedecin = null;
          }
        });
      } else {
        this.searchedMedecin = null;
      }
    });
  }

  ngAfterViewInit() {
    this.assignedMedecins.paginator = this.paginator;
  }

  private loadCurrentPatient() {
    this.authService.userInfo$.subscribe({
      next: (patient: Patient) => {
        this.currentPatient = patient;
        this.assignedMedecins.data = patient.medecins;
      },
      error: () => Swal.fire('Erreur', "Impossible de charger le patient connecté.", 'error')
      });
  }

  assignMedecin() {
    if (!this.searchedMedecin) return;

    const med = this.searchedMedecin;
    Swal.fire({
      title: `Autorisez-vous ${med.prenom} ${med.nom} à acceder à votre dossier ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.medecinService.assignPatientToMedecin(med.id!, this.currentPatient.id!)
          .subscribe({
            next: () => {
              Swal.fire('Succès', 'Médecin assigné avec succès.', 'success');
              this.assignedMedecins.data = [...this.assignedMedecins.data, med];
              this.searchControl.setValue('');
              this.searchedMedecin = null;
            },
            error: () => Swal.fire('Erreur', 'Impossible d’assigner ce médecin.', 'error')
          });
      }
    });
  }

  removeMedecin(medecin: Medecin) {
    Swal.fire({
      title: `Supprimer l'autorisation de ${medecin.prenom} ${medecin.nom} sur votre dossier ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.medecinService.removePatientFromMedecin(medecin.id!, this.currentPatient.id!)
          .subscribe({
            next: () => {
              Swal.fire('Succès', 'Médecin désassigné.', 'success');
              this.assignedMedecins.data = this.assignedMedecins.data.filter(m => m.id !== medecin.id);
            },
            error: () => Swal.fire('Erreur', 'Impossible de désassigner ce médecin.', 'error')
          });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.assignedMedecins.filter = filterValue.trim().toLowerCase();
  }
}