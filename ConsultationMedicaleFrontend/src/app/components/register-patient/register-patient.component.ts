import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../core/services/patient.service';
import { Patient } from '../../models/patient';

@Component({
  selector: 'app-register-patient',
  standalone: false,
  templateUrl: './register-patient.component.html',
  styleUrls: ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  isEditMode = false;
  patientId?: number;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Vérifie si un ID est passé en paramètre (mode édition)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.patientId = +id;
        this.loadPatient(this.patientId);

        // Supprimer les validateurs du mot de passe en mode édition
        const passwordControl = this.registerForm.get('motDePasse');
        passwordControl?.clearValidators();
        passwordControl?.updateValueAndValidity();
      }
    });
  }

  initForm() {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      niss: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      dateNaissance: ['', Validators.required],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loadPatient(id: number) {
    this.patientService.getById(id).subscribe({
      next: (patient: Patient) => {
        this.registerForm.patchValue({
          nom: patient.nom,
          prenom: patient.prenom,
          niss: patient.niss,
          dateNaissance: patient.dateNaissance,
          adresse: patient.adresse,
          telephone: patient.telephone,
          email: patient.email,
          motDePasse: '', // On laisse vide pour sécurité
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Erreur', 'Impossible de charger le patient', 'error');
      }
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Merci de remplir correctement tous les champs.',
      });
      return;
    }

    const patientData = this.registerForm.value;

    if (this.isEditMode && this.patientId) {
      // MODE ÉDITION
      this.patientService.update(this.patientId, patientData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Modification réussie',
            text: 'Les informations du patient ont été mises à jour.',
            timer: 2000,
            showConfirmButton: false,
          });
          this.router.navigate(['/manage-patient']);
        },
        error: (err) => {
          Swal.fire('Erreur', 'Impossible de modifier le patient.', 'error');
          console.error(err);
        },
      });
    } else {
      // MODE CRÉATION
      this.authService.registerPatient(patientData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Inscription réussie',
            text: 'Le patient a été ajouté avec succès.',
            timer: 2000,
            showConfirmButton: false,
          });
          this.router.navigate(['/manage-patient']);
        },
        error: (err) => {
          Swal.fire('Erreur', 'Une erreur est survenue lors de l’inscription.', 'error');
          console.error(err);
        },
      });
    }
  }
}
