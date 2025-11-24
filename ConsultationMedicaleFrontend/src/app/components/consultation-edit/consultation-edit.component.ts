import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConsultationService } from '../../core/services/consultation.service';
import { DocumentService } from '../../core/services/document.service';
import { Consultation, StatutRDV } from '../../models/consultation';

@Component({
  selector: 'app-consultation-edit',
  standalone: false,
  templateUrl: './consultation-edit.component.html',
  styleUrls: ['./consultation-edit.component.css']
})
export class ConsultationEditComponent implements OnInit {

  form!: FormGroup;
  consultation!: Consultation;
  isLoading = true;
  statuses = Object.values(StatutRDV);

  selectedFiles: File[] = [];
  delectedFiles: File[] = [];
  existingDocs: any[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.consultationService.getById(id).subscribe({
      next: (data) => {
        this.consultation = data;
        this.buildForm();
        this.loadDocuments();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', 'Erreur lors du chargement de la consultation', 'error');
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      statut: [this.consultation.statut, Validators.required],
      compteRendu: [this.consultation.compteRendu],
    });
  }

  // ---------------- DOCUMENTS ----------------

  loadDocuments() {
    this.isLoading = true;
    this.documentService.getByConsultation(this.consultation.id!).subscribe({
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
        this.documentService.deleteConsultationFile(id).subscribe({
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
    this.documentService.getConsultationFileUrl(doc.urlStockage).then(url => {
      window.open(url, '_blank');
    }).catch(() => {
      Swal.fire('Erreur', 'Impossible de charger le document', 'error');
    });
  }


  // ---------------- FIN DOCUMENTS ----------------

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Attention', 'Veuillez remplir tous les champs obligatoires.', 'warning');
      return;
    }

    this.isLoading = true;
    const updatedData: Consultation = { ...this.consultation, ...this.form.value };

    this.consultationService.updateWithFiles(this.consultation.id!, updatedData, this.selectedFiles).subscribe({
      next: () => {
        Swal.fire('Succès', 'Consultation mise à jour avec succès', 'success');
        this.isLoading = false;
        this.router.navigate(['/consultation/list']);
      },
      error: (err) => {
         if (err.status === 413) {
            Swal.fire("Fichier trop volumineux", "Votre document dépasse la taille maximale autorisée de 5MB", "error");
          } else {
            Swal.fire('Erreur', err.error?.error ?? 'Impossible de sauvegarder la consultation', 'error');
            this.isLoading = false;
          }
      }
    });
  }

  cancel() {
    Swal.fire({
      title: 'Annuler les modifications ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText:'Non'
    }).then(result => {
      if (result.isConfirmed) this.router.navigate(['/consultation/list']);
    });
  }
}
