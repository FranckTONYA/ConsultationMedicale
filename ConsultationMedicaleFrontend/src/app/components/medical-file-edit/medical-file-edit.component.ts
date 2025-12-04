import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DossierMedical } from '../../models/dossier-medical';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierMedicalService } from '../../core/services/dossier-medical.service';
import Swal from 'sweetalert2';
import { PatientService } from '../../core/services/patient.service';
import { DocumentService } from '../../core/services/document.service';

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
  selectedFiles: File[] = [];
  delectedFiles: File[] = [];
  existingDocs: any[] = [];

  groupesSanguins = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dossierService: DossierMedicalService,
    private patientService: PatientService,
    private documentService: DocumentService,
  ) {}

  ngOnInit(): void {
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
              this.buildForm();
              this.loadDocuments();
              this.isLoading = false;
            },
            error: () => {
              this.isLoading = false;
              Swal.fire('Erreur', 'Impossible de récupérer le patient du dossier', 'error');
            }
          });
        } else {
          this.buildForm();
          this.loadDocuments();
          this.isLoading = false;
        }
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

  // ---------------- DOCUMENTS ----------------
  
  loadDocuments() {
    this.isLoading = true;
    this.documentService.getByDossierMedical(this.dossier.id!).subscribe({
      next: docs => {
        this.existingDocs = docs;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', 'Impossible de charger les documents', 'error');
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let f of files) this.selectedFiles.push(f);
  }

  removeSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  deleteDoc(id: number) {
    this.isLoading = true;
    Swal.fire({
      title: 'Supprimer ce document ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non'
    }).then(result => {
      if (result.isConfirmed) {
        this.documentService.deleteDossierMedicalFile(id).subscribe({
          next: () => {
            Swal.fire('Succès', 'Document supprimé avec succès', 'success');
            this.loadDocuments();
            this.isLoading = false;
          },
          error: (err) =>{
            Swal.fire('Erreur', err.error?.error ?? 'Échec lors de la suppréssion.', 'error');
            this.isLoading = false;

          } 
        });
      }
    });
  }

  viewDocument(doc: any) {
    this.documentService.getDossierMedicalFileUrl(doc.urlStockage).then(url => {
      window.open(url, '_blank');
    }).catch(() => {
      Swal.fire('Erreur', 'Impossible de charger le document', 'error');
    });
  }
  
  // ---------------- FIN DOCUMENTS ----------------



  save() {
    this.isLoading = true;
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Force l’affichage des erreurs
      Swal.fire('Attention', 'Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    this.dossierService.updateWithFiles(this.dossier.id!, this.form.value, this.selectedFiles).subscribe({
      next: () => {
        Swal.fire('Succès', 'Le dossier a bien été mis à jour.', 'success');
        this.isLoading = false;
        this.router.navigate(['/dossiers-medicaux']);
      },
      error: (err) =>{
        Swal.fire('Erreur', err.error?.error ?? "Impossible de sauvegarder le dossier", 'error')
        this.isLoading = false;
      } 
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
