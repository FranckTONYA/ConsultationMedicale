import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MedecinService } from '../../core/services/medecin.service';
import { Medecin } from '../../models/medecin';
import { Patient } from '../../models/patient';
import { AuthService } from '../../core/services/auth.service';
import { FormControl } from '@angular/forms';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-consent-management',
  standalone: false,
  templateUrl: './consent-management.component.html',
  styleUrl: './consent-management.component.css'
})
export class ConsentManagementComponent implements OnInit, AfterViewInit {

  currentPatient = new Patient();
  assignedMedecins = new MatTableDataSource<Medecin>([]);
  displayedColumns: string[] = ['id', 'nom', 'inami', 'specialite', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchControl = new FormControl('');
  searchedMedecin: Medecin | null = null;
  isLoading = true;

  constructor(
    private patientService: PatientService,
    private medecinService: MedecinService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentPatient();

    // 🔍 Recherche INAMI
    this.searchControl.valueChanges.subscribe(value => {
      if (!value || value.length < 3) {
        this.searchedMedecin = null;
        return;
      }

      this.isLoading = true;

      this.medecinService.getByINAMI(Number(value)).subscribe({
        next: (medecin: Medecin) => {
          // éviter de proposer un médecin déjà assigné
          if (!this.assignedMedecins.data.some(m => m.id === medecin.id)) {
            this.searchedMedecin = medecin;
          } else {
            this.searchedMedecin = null;
          }
          this.isLoading = false;
        },
        error: () => {
          this.searchedMedecin = null;
          this.isLoading = false;
        }
      });
    });
  }

  ngAfterViewInit() {
    this.assignedMedecins.paginator = this.paginator;
  }

  /** Chargement du patient connecté + médecins autorisés **/
  private loadCurrentPatient() {
    this.authService.userInfo$.subscribe({
      next: (patient: Patient) => {
        this.currentPatient = patient;

        this.patientService.getMedecinsOfPatient(patient.id!).subscribe({
          next: (result) => {
            this.assignedMedecins.data = result;
            this.isLoading = false;
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible de récupérer les médecins autorisés.', 'error');
            this.isLoading = false;
          }
        });
      },
      error: () => {
        Swal.fire('Erreur', "Impossible de charger le patient connecté.", 'error');
        this.isLoading = false;
      }
    });
  }

  /** Ajout d'un médecin **/
  assignMedecin() {
    if (!this.searchedMedecin) return;

    const med = this.searchedMedecin;
    this.isLoading = true;

    Swal.fire({
      title: `Autoriser ${med.prenom} ${med.nom} ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {

        this.medecinService.assignPatientToMedecin(med.id!, this.currentPatient.id!).subscribe({
          next: () => {
            Swal.fire('Succès', 'Médecin autorisé.', 'success');

            // mise à jour tableau
            this.assignedMedecins.data = [...this.assignedMedecins.data, med];

            // reset zone de recherche
            this.searchControl.setValue('');
            this.searchedMedecin = null;
            this.isLoading = false;
          },
          error: (err) => {
            Swal.fire('Erreur', err.error?.error ?? "Impossible d'autoriser ce médecin.", 'error');
            this.isLoading = false;
          }
        });

      } else {
        this.isLoading = false;
      }
    });
  }

  /** Suppression d'un médecin **/
  removeMedecin(medecin: Medecin) {
    this.isLoading = true;

    Swal.fire({
      title: `Retirer l'accès de ${medecin.prenom} ${medecin.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {

        this.medecinService.removePatientFromMedecin(medecin.id!, this.currentPatient.id!).subscribe({
          next: () => {
            Swal.fire('Succès', 'Accès retiré.', 'success');

            this.assignedMedecins.data =
              this.assignedMedecins.data.filter(m => m.id !== medecin.id);

            this.isLoading = false;
          },
          error: (err) => {
            Swal.fire('Erreur', err.error?.error ?? 'Impossible de retirer cet accès.', 'error');
            this.isLoading = false;
          }
        });

      } else {
        this.isLoading = false;
      }
    });
  }

  /** Filtrage tableau **/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.assignedMedecins.filter = filterValue.trim().toLowerCase();

    if (this.assignedMedecins.paginator) {
      this.assignedMedecins.paginator.firstPage();
    }
  }
}
