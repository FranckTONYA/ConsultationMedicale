import { Component, OnInit } from '@angular/core';
import { DossierMedical } from '../../models/dossier-medical';
import { ActivatedRoute } from '@angular/router';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';
import Swal from 'sweetalert2';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-medical-file-details',
  standalone: false,
  templateUrl: './medical-file-details.component.html',
  styleUrl: './medical-file-details.component.css'
})
export class MedicalFileDetailsComponent implements OnInit {

  dossier!: DossierMedical;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private dossierService: DossierMedicalService,
    private patientService: PatientService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.dossierService.getById(id).subscribe({
      next: (data) => {
        this.dossier = data;

        // Vérifie si le patient est déjà présent
        if (!this.dossier.patient?.id) {
          // Si le patient n’est pas présent, on le charge via son endpoint
          this.patientService.getByDossier(id).subscribe({
            next: (patient) => {
              this.dossier.patient = patient;
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              Swal.fire('Erreur', 'Impossible de récupérer le patient du dossier', 'error');
            }
          });
        } else {
          this.isLoading = false
        }
      },
      error: (err) =>{
        Swal.fire('Erreur', "Erreur rencontrée lors de l'opération", 'error')
        this.isLoading = false;
      } 
    });
  }
}
