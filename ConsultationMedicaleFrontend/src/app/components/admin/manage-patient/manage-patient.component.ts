import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../models/patient';

@Component({
  selector: 'app-manage-patient',
  standalone: false,
  templateUrl: './manage-patient.component.html',
  styleUrls: ['./manage-patient.component.css']
})
export class ManagePatientComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'nom', 'prenom', 'niss', 'dateNaissance', 'telephone', 'adresse', 'email', 'actions'];
  dataSource = new MatTableDataSource<Patient>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit() {
    this.loadPatients();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadPatients() {
    this.patientService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error(err)
    });
  }

  addPatient() {
    this.router.navigate(['/register-patient'], { state: { modeAdmin: true }});
  }

  editPatient(id: number) {
    this.router.navigate(['/edit-patient', id], { state: { modeAdmin: true }});
  }

  deletePatient(id: number) {
    Swal.fire({
      title: 'Supprimer ce patient ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then(result => {
      if (result.isConfirmed) {
        this.patientService.delete(id).subscribe({
          next: () => {
            Swal.fire({
            icon: 'success',
            title: 'Suppréssion réussie',
            text: "Le patient a bien été supprimé !",
            timer: 1500,
            showConfirmButton: false
          });
          this.loadPatients()
          },
          error: () =>{
            Swal.fire({
              icon: 'error',
              title: "Erreur de suppression",
              text: "La suppression du patient a rencontré un erreur.",
              showConfirmButton: true,
            });
          } 
        });
      }
    });
  }

  /** Filtrage instantané **/
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
