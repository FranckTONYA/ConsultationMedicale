import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../models/patient';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-patient',
  standalone: false,
  templateUrl: './manage-patient.component.html',
  styleUrl: './manage-patient.component.css'
})
export class ManagePatientComponent implements OnInit {
  patients: Patient[] = [];
  displayedColumns = ['id', 'nom', 'prenom', 'niss', 'dateNaissance', 'telephone', 'adresse', 'email', 'actions'];

  constructor(private patientService: PatientService, private router: Router) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getAll().subscribe({
      next: (data) => (this.patients = data),
      error: (err) => console.error(err)
    });
  }

  addPatient() {
    this.router.navigate(['/register-patient']);
  }

  deletePatient(id: number) {
    Swal.fire({
      title: 'Supprimer ce patient ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then(result => {
      if (result.isConfirmed) {
        this.patientService.delete(id).subscribe(() => this.loadPatients());
      }
    });
  }
}
