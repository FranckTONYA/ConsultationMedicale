import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { ConsultationService } from '../../core/services/consultation.service';
import { Consultation } from '../../models/consultation';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-consultation-details',
  standalone: false,
  templateUrl: './consultation-details.component.html',
  styleUrls: ['./consultation-details.component.css']
})
export class ConsultationDetailsComponent implements OnInit {

  consultation!: Consultation;
  isLoading = true;
  currentUser!: Utilisateur;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultationService: ConsultationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.userInfo$.subscribe(user => this.currentUser = user);

    const id = +this.route.snapshot.paramMap.get('id')!;
    this.consultationService.getById(id).subscribe({
      next: data => { this.consultation = data; this.isLoading = false; },
      error: () => { Swal.fire('Erreur','Impossible de charger la consultation','error'); this.isLoading=false; }
    });
  }

  retour() {
    this.router.navigate(['/consultation/list']);
  }
}
