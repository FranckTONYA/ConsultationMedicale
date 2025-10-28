import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MedecinService } from '../../../core/services/medecin.service';
import { Medecin } from '../../../models/medecin';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-medecin',
  standalone: false,
  templateUrl: './register-medecin.component.html',
  styleUrls: ['./register-medecin.component.css']
})
export class RegisterMedecinComponent implements OnInit {
  registerForm!: FormGroup;
  isEditMode = false;
  medecinId?: number;
  hidePassword = true;
  currentMedecin = new Medecin();

  constructor(
    private fb: FormBuilder,
    private medecinService: MedecinService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.medecinId = +id;
        this.loadMedecin(this.medecinId);

        // Désactiver le validateur mot de passe en édition
        const pwdCtrl = this.registerForm.get('motDePasse');
        pwdCtrl?.clearValidators();
        pwdCtrl?.updateValueAndValidity();
      }
    });
  }

  initForm() {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      specialite: ['', Validators.required],
      // inami: ['', [Validators.required, inamiValidator()]],
      numINAMI: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  loadMedecin(id: number) {
    this.medecinService.getById(id).subscribe({
      next: (medecin: Medecin) => {
        this.currentMedecin = medecin;
        this.registerForm.patchValue({
          nom: medecin.nom,
          prenom: medecin.prenom,
          specialite: medecin.specialite,
          numINAMI: medecin.numINAMI,
          adresse: medecin.adresse,
          telephone: medecin.telephone,
          email: medecin.email,
          motDePasse: '',
        });
      },
      error: () => Swal.fire('Erreur', 'Impossible de charger le médecin', 'error'),
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire('Champs manquants', 'Merci de remplir tous les champs correctement.', 'warning');
      return;
    }

    const medecinData = this.registerForm.value;

    if (this.isEditMode && this.medecinId) {
      this.medecinService.update(this.medecinId, medecinData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Médecin mis à jour avec succès.', 'success');
          this.router.navigate(['/manage-medecin']);
        },
        error: () => Swal.fire('Erreur', 'Échec de la mise à jour du médecin.', 'error'),
      });
    } else {
      this.authService.registerMedecin(medecinData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Médecin enregistré avec succès.', 'success');
          this.router.navigate(['/manage-medecin']);
        },
        error: () => Swal.fire('Erreur', 'Échec de l’enregistrement du médecin.', 'error'),
      });
    }
  }
}
