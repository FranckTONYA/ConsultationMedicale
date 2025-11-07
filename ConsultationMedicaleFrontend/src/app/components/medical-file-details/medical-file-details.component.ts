import { Component, OnInit } from '@angular/core';
import { DossierMedical } from '../../models/dossier-medical';
import { ActivatedRoute } from '@angular/router';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';

@Component({
  selector: 'app-medical-file-details',
  standalone: false,
  templateUrl: './medical-file-details.component.html',
  styleUrl: './medical-file-details.component.css'
})
export class MedicalFileDetailsComponent implements OnInit {

  dossier!: DossierMedical;

  constructor(
    private route: ActivatedRoute,
    private dossierService: DossierMedicalService,
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.dossierService.getById(id).subscribe(d => this.dossier = d);
  }
}
