import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DossierMedical } from '../../models/dossier-medical';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medical-file-edit',
  standalone: false,
  templateUrl: './medical-file-edit.component.html',
  styleUrl: './medical-file-edit.component.css'
})
export class MedicalFileEditComponent implements OnInit {

  form!: FormGroup;
  dossier!: DossierMedical;
  isLoading = true;

  groupesSanguins = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dossierService: DossierMedicalService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.dossierService.getById(id).subscribe({
      next: (data) => {
        this.dossier = data;
        this.buildForm();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', 'Erreur lors du chargement du dossier', 'error');
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      groupeSanguin: [this.dossier.groupeSanguin],
      allergies: this.fb.array(this.dossier.allergies || []),
      vaccinations: this.fb.array(this.dossier.vaccinations || []),
      antecedentsMedicaux: this.fb.array(this.dossier.antecedentsMedicaux || []),
      remarques: this.fb.array(this.dossier.remarques || []),
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
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Force l’affichage des erreurs
      Swal.fire('Attention', 'Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    this.dossierService.update(this.dossier.id!, this.form.value).subscribe({
      next: () => {
        Swal.fire('Succès', 'Le dossier a bien été mis à jour.', 'success');
        this.router.navigate(['/dossiers-medicaux']);
      },
      error: () => Swal.fire('Erreur', 'Impossible de sauvegarder le dossier.', 'error')
    });
  }

  cancel() {
    Swal.fire({
      title: 'Annuler les modifications ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText:'Non',
    }).then(result => {
      if (result.isConfirmed)
         this.router.navigate(['/dossiers-medicaux']);
    });
  }
}
