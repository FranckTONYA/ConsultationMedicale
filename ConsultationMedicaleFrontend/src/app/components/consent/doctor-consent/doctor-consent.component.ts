import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { Consentement } from '../../../models/consentement';
import { ConsentService } from '../../../core/services/consent.service';
import { PatientService } from '../../../core/services/patient.service';
import { AuthService } from '../../../core/services/auth.service';
import { RoleUtilisateur, Utilisateur } from '../../../models/utilisateur';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-consent',
  standalone: false,
  templateUrl: './doctor-consent.component.html',
  styleUrls: ['./doctor-consent.component.css']
})
export class DoctorConsentComponent implements OnInit, AfterViewInit {

  searchNiss = new FormControl('');
  textFilter = new FormControl('');
  statusFilter = "ALL";

  foundPatient: any = null;

  demandes = new MatTableDataSource<Consentement>([]);
  displayedColumns = ['id', 'patient', 'niss', 'date', 'statut', 'action'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  medecinId!: number;
  currentUser!: Utilisateur;
  isLoading = true;
  RoleUtilisateur = RoleUtilisateur;

  constructor(
    private consentService: ConsentService,
    private patientService: PatientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.userInfo$.subscribe(info => {
      this.currentUser = info;
      this.medecinId = info.id!;
      this.loadMyRequests();
    });

    this.listenNissSearch();
    this.applyFiltering();
  }

  ngAfterViewInit() {
    this.demandes.paginator = this.paginator;
  }

  // Recherche NISS
  private listenNissSearch() {
    this.searchNiss.valueChanges.subscribe(niss => {
      if (!niss || niss.length !== 11) {
        this.foundPatient = null;
        return;
      }

      this.isLoading = true;

      this.patientService.getByNISS(Number(niss)).subscribe({
        next: res => {
          this.foundPatient = res;
          this.isLoading = false;
        },
        error: () => {
          this.foundPatient = null;
          this.isLoading = false;
        }
      });
    });
  }

  // Filtres synchronisés
  private applyFiltering() {
    const updateFilter = () => {
      this.demandes.filterPredicate = this.buildPredicate();
      this.demandes.filter = Math.random().toString();
    };

    this.textFilter.valueChanges.subscribe(() => updateFilter());
  }

  // Appelé quand toggle est changé
  setStatusFilter(value: string) {
    this.statusFilter = value;
    this.demandes.filterPredicate = this.buildPredicate();
    this.demandes.filter = Math.random().toString();
  }

  loadMyRequests() {
    this.isLoading = true;

    this.consentService.findByMedecin(this.medecinId).subscribe({
      next: res => {
        this.demandes.data = res;

        // Réappliquer le filterPredicate
        this.demandes.filterPredicate = this.buildPredicate();

        // Réappliquer le filtre actuel
        this.demandes.filter = Math.random().toString();

        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Erreur', 'Erreur lors du chargement.', 'error');
        this.isLoading = false;
      }
    });
  }

  private buildPredicate() {
    return (d: Consentement) => {
      const txt = (this.textFilter.value ?? '').trim().toLowerCase();
      const statut = this.statusFilter;

      const matchTxt =
        d.patient.nom.toLowerCase().includes(txt) ||
        d.patient.prenom.toLowerCase().includes(txt) ||
        d.patient.niss.includes(txt);

      const matchStatus =
        statut === "ALL" ? true : d.statut === statut;

      return matchTxt && matchStatus;
    };
  }

  /** Vérifie si une demande existe déjà pour ce patient */
  hasActiveRequest(patientId: number): boolean {
    return this.demandes.data.some(d =>
      d.patient.id === patientId &&
      (d.statut === 'EN_ATTENTE' || d.statut === 'ACCEPTER')
    );
  }

  sendRequest() {
    if (!this.foundPatient) return;

    // Bloque si une demande existe déjà
    if (this.hasActiveRequest(this.foundPatient.id)) {
      Swal.fire(
        'Demande impossible',
        'Vous avez déjà une demande en attente ou acceptée pour ce patient.',
        'warning'
      );
      return;
    }

    Swal.fire({
      title: "Confirmez-vous la demande ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.consentService.createConsent(this.foundPatient.id, this.medecinId).subscribe({
          next: () => {
            Swal.fire('Envoyé', 'La demande a été envoyée.', 'success');
            this.loadMyRequests();
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible d’envoyer la demande.', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }


  clickSuggestion() {
    if (this.foundPatient) this.sendRequest();
  }

  cancelRequest(id: number) {
    Swal.fire({
      title: 'Supprimer la demande ?',
      text: 'Cette action est définitive.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.consentService.delete(id).subscribe({
          next: () => {
            Swal.fire('Supprimée', 'La demande a été supprimée.', 'success');
            this.loadMyRequests();
          },
          error: () => {
            Swal.fire('Erreur', 'Impossible de supprimer.', 'error');
            this.isLoading = false;
          }
        });
      }
    });
  }

  getLabel(statut: string): string {
    switch (statut) {
      case 'ACCEPTER': return 'Acceptée';
      case 'REFUSER': return 'Refusée';
      case 'EN_ATTENTE': return 'En attente';
      default: return statut;
    }
  }

  goToUser(userId: number, role: RoleUtilisateur) {
    this.router.navigate(
      ['/user-details', userId],
      { state: { role } }
    );
  }
}
