import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../../core/services/admin.service';
import { Administrateur } from '../../../models/administrateur';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-admin',
  standalone: false,
  templateUrl: './register-admin.component.html',
  styleUrls: ['./register-admin.component.css']
})
export class RegisterAdminComponent implements OnInit {
  registerForm!: FormGroup;
  isEditMode = false;
  adminId?: number;
  hidePassword = true;
  currentAdmin = new Administrateur();
  modeAdmin = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    this.modeAdmin = nav?.extras?.state?.['modeAdmin'] || false;
  }

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.adminId = +id;
        this.loadAdmin(this.adminId);
      }
    });
  }

  initForm() {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      role: [''],
    });
  }

  loadAdmin(id: number) {
    this.adminService.getById(id).subscribe({
      next: (admin: Administrateur) => {
        this.currentAdmin = admin;
        this.registerForm.patchValue({
          nom: admin.nom,
          prenom: admin.prenom,
          email: admin.email,
          adresse: admin.adresse,
          telephone: admin.telephone,
          motDePasse: admin.motDePasse,
          role: admin.role,
        });
      },
      error: () => Swal.fire('Erreur', 'Impossible de charger l’administrateur', 'error'),
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Swal.fire('Champs manquants', 'Merci de remplir tous les champs correctement.', 'warning');
      return;
    }

    const adminData = this.registerForm.value;

    if (this.isEditMode && this.adminId) {
      this.adminService.update(this.adminId, adminData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Administrateur modifié avec succès.', 'success');

          if(this.modeAdmin) // Si modification faite par un administrateur
            this.router.navigate(['/manage-admin']);
          else
            this.router.navigate(['/profil']);

        },
        error: () => Swal.fire('Erreur', 'Échec de la mise à jour.', 'error'),
      });
    } else {
      this.authService.registerAdmin(adminData).subscribe({
        next: () => {
          Swal.fire('Succès', 'Administrateur ajouté avec succès.', 'success');
          this.router.navigate(['/manage-admin']);
        },
        error: () => Swal.fire('Erreur', 'Échec de l’enregistrement.', 'error'),
      });
    }
  }
}
