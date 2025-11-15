import { Component, OnInit } from '@angular/core';
import { DossierMedical } from '../../models/dossier-medical';
import { ActivatedRoute } from '@angular/router';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';
import Swal from 'sweetalert2';

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
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.dossierService.getById(id).subscribe({
      next: (data) => {
        this.dossier = data;
        this.isLoading = false
      },
      error: (err) =>{
        Swal.fire('Erreur', "Erreur rencontrée lors de l'opération", 'error')
        this.isLoading = false;
      } 
    });
  }
}
