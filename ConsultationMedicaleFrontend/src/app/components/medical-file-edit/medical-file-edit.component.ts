import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DossierMedical } from '../../models/dossier-medical';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';
import Swal from 'sweetalert2';
import { Patient } from '../../models/patient';
import { response } from 'express';

@Component({
  selector: 'app-medical-file-edit',
  standalone: false,
  templateUrl: './medical-file-edit.component.html',
  styleUrl: './medical-file-edit.component.css'
})
export class MedicalFileEditComponent implements OnInit {

  form!: FormGroup;
  dossier!: DossierMedical;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dossierService: DossierMedicalService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.dossierService.getById(id).subscribe(response => {
      this.dossier = response;
      this.buildForm();
    });
  }

  buildForm() {
    this.form = this.fb.group({
      groupeSanguin: this.dossier.groupeSanguin,
      allergies: this.fb.array(this.dossier.allergies),
      vaccinations: this.fb.array(this.dossier.vaccinations),
      antecedentsMedicaux: this.fb.array(this.dossier.antecedentsMedicaux),
      remarques: this.fb.array(this.dossier.remarques),
      patient: this.dossier.patient,
    });
  }

  get allergies() { return this.form.get('allergies') as FormArray; }
  get vaccinations() { return this.form.get('vaccinations') as FormArray; }
  get antecedentsMedicaux() { return this.form.get('antecedentsMedicaux') as FormArray; }
  get remarques() { return this.form.get('remarques') as FormArray; }

  addItem(formArray: FormArray) {
    formArray.push(this.fb.control(''));
  }

  removeItem(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }

  save() {
    if (this.form.invalid) return;

    this.dossierService.update(this.dossier.id!, this.form.value).subscribe({
      next: () => {
        Swal.fire('Succès', 'Dossier mis à jour', 'success');
        this.router.navigate(['/dossiers-medicaux']);
      },
      error: () => Swal.fire('Erreur', 'Impossible de sauvegarder', 'error')
    });
  }
}
