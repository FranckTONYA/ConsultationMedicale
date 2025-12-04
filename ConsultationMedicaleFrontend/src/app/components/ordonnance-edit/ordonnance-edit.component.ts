import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrdonnanceService } from '../../core/services/ordonnance.service';
import { DocumentService } from '../../core/services/document.service';
import { Ordonnance } from '../../models/ordonnance';
import { Patient } from '../../models/patient';
import { PatientService } from '../../core/services/patient.service';
import { AuthService } from '../../core/services/auth.service';
import { Medecin } from '../../models/medecin';

@Component({
  selector: 'app-ordonnance-edit',
  standalone: false,
  templateUrl: './ordonnance-edit.component.html',
  styleUrls: ['./ordonnance-edit.component.css']
})
export class OrdonnanceEditComponent implements OnInit {

  form!: FormGroup;
  ordonnance!: Ordonnance;
  medecin!: Medecin;
  patient = new Patient();
  isLoading = true;
  selectedFiles: File[] = [];
  existingDocs: any[] = [];
  isEdit = false;
  filteredPatient: Patient | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ordonnanceService: OrdonnanceService,
    private documentService: DocumentService,
    private patientService: PatientService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    
    if (this.isEdit) {
      const id = +idParam!;
      this.ordonnanceService.getById(id).subscribe({
        next: data => {
          this.ordonnance = data;
          this.buildForm();
          this.loadDocuments();
          this.isLoading = false;
        },
        error: () => { 
          this.isLoading = false; 
          Swal.fire('Erreur','Impossible de charger l\'ordonnance','error'); 
        }
      });

    } else {
      this.authService.userInfo$.subscribe({
        next: (user) => {
          this.medecin = user;
          this.ordonnance = new Ordonnance();
          this.buildForm();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Erreur', "Impossible de récupérer le médecin connecté", 'error');
        }
      });
    }
  }

  buildForm() {
    this.form = this.fb.group({
      contenu: [this.ordonnance.contenu, Validators.required],
      // Patient visible et obligatoire UNIQUEMENT en mode création
      patientNiss: [
        this.isEdit ? '' : '',
        this.isEdit ? [] : [Validators.required]
      ]
    });

    // Recherche patient via NISS
    this.form.get('patientNiss')?.valueChanges.subscribe(value => {
      if (value && value.length >= 3) {
        this.isLoading = true;
        this.patientService.getByNISS(value).subscribe({
          next: (patient) => {
            this.filteredPatient = patient;
            this.isLoading = false;
          },
          error: () => {
            this.filteredPatient = null;
            this.isLoading = false;
          }
        });
      } else {
        this.filteredPatient = null;
      }
    });
  }

  selectPatient(patient: Patient) {
    this.filteredPatient = null;   // Masque la suggestion
     // Stocke le patient sélectionné
    this.ordonnance.patient = { id: patient.id } as any;
    this.patient = patient;

    // Remet juste le NISS dans le champ
    this.form.patchValue({ patientNiss: patient.niss });
  }

  loadDocuments() {
    this.isLoading = true;
    if (!this.ordonnance.id) return;
    this.documentService.getByOrdonnance(this.ordonnance.id).subscribe({
      next: docs => {
        this.existingDocs = docs;
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Erreur','Impossible de charger les documents','error');
        this.isLoading = false;
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
      confirmButtonText: 'Oui', cancelButtonText:'Non'
    }).then(result => {
      if(result.isConfirmed) {
        this.documentService.deleteOrdonnanceFile(id).subscribe({
          next: () => {
            Swal.fire('Succès','Document supprimé','success');
            this.loadDocuments();
            this.isLoading = false;
          },
          error: () => {
            Swal.fire('Erreur','Impossible de supprimer','error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewDocument(doc: any) {
    this.isLoading = true;
    this.documentService.getOrdonnanceFileUrl(doc.urlStockage).then(url => {
      window.open(url, '_blank');
      this.isLoading = false;
    }).catch(() => {
      Swal.fire('Erreur', 'Impossible de charger le document', 'error');
      this.isLoading = false;
    });
  }


  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire('Attention', 'Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }

    // Vérification stricte : en création, patient OBLIGATOIREMENT sélectionné
    if (!this.isEdit && !this.ordonnance.patient.id) {
      Swal.fire(
        'Attention',
        'Veuillez sélectionner un patient existant en cliquant sur le résultat de recherche',
        'warning'
      );
      return;
    }

    this.isLoading = true;

    if (!this.isEdit) {
      this.ordonnance.medecin = { id: this.medecin.id } as Medecin;
      const data: Ordonnance = { ...this.ordonnance, ...this.form.value };
      this.ordonnanceService.createWithFile(data, this.selectedFiles).subscribe({
        next: () => {
          Swal.fire('Succès', 'Ordonnance créée', 'success');
          this.isLoading = false;
          this.router.navigate(['/ordonnance/list']);
        },
        error: err => {
          if (err.status === 413) {
              Swal.fire("Fichier trop volumineux", "Votre document dépasse la taille maximale autorisée de 5MB", "error");
            } else {
              Swal.fire('Erreur', err.error?.error || "Erreur lors de l'enregistrement de l'ordonnance", 'error');
            }
        
          this.isLoading = false;
        }
      });

    } else {
      const data: Ordonnance = { ...this.ordonnance, ...this.form.value };
      this.ordonnanceService.updateWithFiles(this.ordonnance.id!, data, this.selectedFiles).subscribe({
        next: () => {
          Swal.fire('Succès', 'Ordonnance mise à jour', 'success');
          this.isLoading = false;
          this.router.navigate(['/ordonnance/list']);
        },
        error: err => {
          if (err.status === 413) {
              Swal.fire("Fichier trop volumineux", "Votre document dépasse la taille maximale autorisée de 5MB", "error");
            } else {
              Swal.fire('Erreur', err.error?.error || 'Erreur serveur', 'error');
            }
          this.isLoading = false;
        }
      });
    }
  }


  cancel() {
    Swal.fire({
        title: 'Annuler les modifications ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText:'Non'
      }).then(result => {
        if (result.isConfirmed) this.router.navigate(['/ordonnance/list']);
      });
  }
}
