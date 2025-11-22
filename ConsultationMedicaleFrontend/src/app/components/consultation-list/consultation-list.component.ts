import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../core/services/auth.service';
import { ConsultationService } from '../../core/services/consultation.service';
import { Consultation, StatutRDV } from '../../models/consultation';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';

@Component({
  selector: 'app-consultation-list',
  standalone: false,
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.css']
})
export class ConsultationListComponent implements OnInit, AfterViewInit {
  
  currentUser!: Utilisateur;
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<Consultation>([]);
  searchText: string = '';
  selectedStatus: string = '';
  statuses: string[] = Object.values(StatutRDV);
  isPatient = false;
  isMedecin = false;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authService: AuthService,
    private consultationService: ConsultationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Définit le predicate UNE SEULE FOIS : il attend un JSON stringifié { text, status }
    this.dataSource.filterPredicate = (data: Consultation, filter: string) => {
      let parsed: { text: string; status: string } = { text: '', status: '' };
      try {
        parsed = JSON.parse(filter);
      } catch (e) {
        // si parse échoue, considérer tout vide
        parsed = { text: '', status: '' };
      }

      const text = (parsed.text || '').trim().toLowerCase();
      const statusFilter = parsed.status || '';

      // correspondance texte selon rôle
      const textToSearch = (this.currentUser?.role === RoleUtilisateur.MEDECIN)
        ? `${data.patient?.prenom ?? ''} ${data.patient?.nom ?? ''} ${data.patient?.niss ?? ''}`
        : `${data.medecin?.prenom ?? ''} ${data.medecin?.nom ?? ''} ${data.medecin?.numINAMI ?? ''} ${data.medecin?.specialite ?? ''}`;

      const matchesText = text ? textToSearch.toLowerCase().includes(text) : true;
      const matchesStatus = statusFilter ? (data.statut === statusFilter) : true;

      return matchesText && matchesStatus;
    };

    // Récupération de l'utilisateur et chargement
    this.authService.userInfo$.subscribe(user => {
      this.currentUser = user;
      this.isPatient = user.role === RoleUtilisateur.PATIENT;
      this.isMedecin = user.role === RoleUtilisateur.MEDECIN;

      if (this.isMedecin) {
        this.displayedColumns = ['id', 'patientNom', 'patientNiss', 'debut', 'fin', 'statut', 'actions'];
        this.loadConsultationsMedecin(user.id!);
      } else if (this.isPatient) {
        this.displayedColumns = ['id', 'medecinNom', 'medecinInami', 'specialite', 'debut', 'fin', 'statut', 'actions'];
        this.loadConsultationsPatient(user.id!);
      } else {
        // rôle par défaut : afficher rien
        this.displayedColumns = ['id', 'debut', 'fin', 'statut', 'actions'];
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Chargers
  loadConsultationsMedecin(idMedecin: number) {
    this.isLoading = true;
    this.consultationService.getByMedecin(idMedecin).subscribe({
      next: data => { this.dataSource.data = data; this.isLoading = false; this.applyCombinedFilter(); },
      error: () => { Swal.fire('Erreur', 'Impossible de charger les consultations', 'error'); this.isLoading = false; }
    });
  }

  loadConsultationsPatient(idPatient: number) {
    this.isLoading = true;
    this.consultationService.getByPatient(idPatient).subscribe({
      next: data => { this.dataSource.data = data; this.isLoading = false; this.applyCombinedFilter(); },
      error: () => { Swal.fire('Erreur', 'Impossible de charger les consultations', 'error'); this.isLoading = false; }
    });
  }

  // Appliquer le filtre combiné : text + status
  applyCombinedFilter() {
    const filterObj = {
      text: this.searchText || '',
      status: this.selectedStatus || ''
    };

    this.dataSource.filter = JSON.stringify(filterObj);

    // Réactiver le paginator après filtrage
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    }
  }

  // appelé par l'input de recherche (keyup)
  applyFilter(event: Event) {
    this.searchText = (event.target as HTMLInputElement).value || '';
    this.applyCombinedFilter();
  }

  // appelé quand on change le select de statut
  onStatusChange() {
    this.applyCombinedFilter();
  }

  creerConsultation() {
    if (this.currentUser?.id) {
      this.router.navigate(['/schedule-consult', this.currentUser.id]);
    }
  }

  voirDetails(consultation: Consultation) {
    this.router.navigate(['/consultation/details', consultation.id]);
  }

  editConsultation(consultation: Consultation) {
    this.router.navigate(['/consultation/edit', consultation.id]);
  }
}
