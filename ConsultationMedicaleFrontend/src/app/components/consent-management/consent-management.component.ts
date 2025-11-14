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
  assignedMedecins: MatTableDataSource<Medecin> = new MatTableDataSource<Medecin>([]);
  displayedColumns: string[] = ['nom', 'inami', 'specialite', 'actions'];
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

    this.searchControl.valueChanges.subscribe(value => {
      this.isLoading = true;
      if (value && value.length >= 3) {
        this.medecinService.getByINAMI(Number(value)).subscribe({
          next: (medecin: Medecin) => {
            console.log(medecin);
            // Si déjà assigné, ne pas proposer
            // if (!this.assignedMedecins.data.some(m => m.id === medecin.id)) {
            //   this.searchedMedecin = medecin;
            // } else {
            //   this.searchedMedecin = null;
            // }

            this.searchedMedecin = medecin;
            this.isLoading = false;
          },
          error: () => {
            this.searchedMedecin = null;
            this.isLoading = false;
          }
        });
      } else {
        this.searchedMedecin = null;
        this.isLoading = false;
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
        this.patientService.getMedecinsOfPatient(patient.id!).subscribe({
            next: (result) => {
              this.assignedMedecins.data = result;
              this.isLoading = false;
            },
            error: () => {
              Swal.fire('Erreur', 'Impossible de récuperer les médecins autorisés.', 'error');
              this.isLoading = false;
            }
          });
      },
      error: () =>{
        Swal.fire('Erreur', "Impossible de charger le patient connecté.", 'error');
        this.isLoading = false;
      }
      });
  }

  assignMedecin() {
    this.isLoading = true;
    if (!this.searchedMedecin) return;
    const med = this.searchedMedecin;
    console.log(med);
    Swal.fire({
      title: `Autorisez-vous ${med.prenom} ${med.nom} à acceder à votre dossier ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      console.log(result);
      if (result.isConfirmed) {
        this.medecinService.assignPatientToMedecin(med.id!, this.currentPatient.id!)
          .subscribe({
            next: () => {
              Swal.fire('Succès', 'Médecin autorisé avec succès.', 'success');
              this.assignedMedecins.data = [...this.assignedMedecins.data, med];
              this.searchControl.setValue('');
              this.searchedMedecin = null;
              this.isLoading = false;
            },
            error: (err) => {
              Swal.fire('Erreur', err.error?.error ?? "Impossible d'autoriser ce médecin.", 'error');
              this.isLoading = false;
            }
          });
      }
    });
  }

  removeMedecin(medecin: Medecin) {
    this.isLoading = true;
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
              this.isLoading = false;
            },
            error: (err) => {
              Swal.fire('Erreur', err.error?.error ?? 'Impossible de désassigner ce médecin.', 'error');
              this.isLoading = false;
            }
          });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.assignedMedecins.filter = filterValue.trim().toLowerCase();
  }
}