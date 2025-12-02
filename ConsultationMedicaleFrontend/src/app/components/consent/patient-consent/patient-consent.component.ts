import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Consentement } from '../../../models/consentement';
import { ConsentService } from '../../../core/services/consent.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { RoleUtilisateur } from '../../../models/utilisateur';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-consent',
  standalone: false,
  templateUrl: './patient-consent.component.html',
  styleUrls: ['./patient-consent.component.css']
})
export class PatientConsentComponent implements OnInit, AfterViewInit {

  demandes = new MatTableDataSource<Consentement>([]);
  displayedColumns = ['id', 'medecin', 'inami', 'date', 'statut', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  textFilter = new FormControl('');
  statusFilter: 'ALL' | 'EN_ATTENTE' | 'ACCEPTER' | 'REFUSER' = "ALL";

  patientId!: number;
  isLoading = true;
  RoleUtilisateur = RoleUtilisateur;

  constructor(
    private consentService: ConsentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.userInfo$.subscribe(info => {
      this.patientId = info.id!;
      this.loadRequests();
    });

    // Définir filterPredicate
    this.demandes.filterPredicate = (d: Consentement) => {
      const txt = (this.textFilter.value ?? '').trim().toLowerCase();
      const matchTxt =
        d.medecin.nom.toLowerCase().includes(txt) ||
        d.medecin.prenom.toLowerCase().includes(txt) ||
        d.medecin.numINAMI.includes(txt);

      const matchStatus = this.statusFilter === 'ALL' ? true : d.statut === this.statusFilter;
      return matchTxt && matchStatus;
    };

    this.setupFiltering();
  }

  ngAfterViewInit() {
    this.demandes.paginator = this.paginator;
  }

  /** Traduction statut */
  getLabel(statut: string): string {
    switch (statut) {
      case 'ACCEPTER': return 'Acceptée';
      case 'REFUSER': return 'Refusée';
      case 'EN_ATTENTE': return 'En attente';
      default: return statut;
    }
  }

  /** Mise en place du filtrage synchronisé */
  private setupFiltering() {
    this.textFilter.valueChanges.subscribe(() => {
      this.demandes.filter = JSON.stringify({
        text: this.textFilter.value,
        status: this.statusFilter
      });
      if (this.demandes.paginator) this.demandes.paginator.firstPage();
    });
  }

  /** Click du toggle */
  setStatusFilter(value: 'ALL' | 'EN_ATTENTE' | 'ACCEPTER' | 'REFUSER') {
    this.statusFilter = value;
    this.demandes.filter = JSON.stringify({
      text: this.textFilter.value,
      status: this.statusFilter
    });
    if (this.demandes.paginator) this.demandes.paginator.firstPage();
  }

  /** Chargement des demandes */
  loadRequests() {
    this.isLoading = true;

    this.consentService.findByPatient(this.patientId).subscribe({
      next: (data) => {
        this.demandes.data = data;
        // Déclenchement initial du filtre
        this.demandes.filter = JSON.stringify({
          text: this.textFilter.value,
          status: this.statusFilter
        });

        if (this.paginator) {
          this.demandes.paginator = this.paginator;
        }

        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Erreur', 'Erreur lors du chargement.', 'error');
        this.isLoading = false;
      }
    });
  }

  /** Patient accepte / refuse */
  updateRequest(id: number, statut: string) {
    this.isLoading = true;

    this.consentService.updateStatus(id, statut).subscribe({
      next: () => {
        Swal.fire('Succès', 'Décision enregistrée.', 'success');
        this.loadRequests();
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de mettre à jour.', 'error');
        this.isLoading = false;
      }
    });
  }

  /** Vérifie si le bouton Refuser doit être affiché */
  canRefuse(d: Consentement) {
    return d.statut === 'EN_ATTENTE' || d.statut === 'ACCEPTER';
  }

  /** Vérifie si le bouton Accepter doit être affiché */
  canAccept(d: Consentement) {
    return d.statut === 'EN_ATTENTE';
  }

  goToUser(userId: number, role: RoleUtilisateur) {
    this.router.navigate(
      ['/user-details', userId],
      { state: { role } }
    );
  }
}
