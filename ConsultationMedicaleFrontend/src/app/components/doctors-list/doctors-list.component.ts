import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Medecin } from '../../models/medecin';
import { MedecinService } from '../../core/services/medecin.service';

@Component({
  selector: 'app-doctors-list',
  standalone: false,
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {

  doctors: Medecin[] = [];
  filteredDoctors: Medecin[] = [];
  paginatedDoctors: Medecin[] = [];

  isLoading = true;
  searchKey: string = '';

  pageSize = 6;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private medecinService: MedecinService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.isLoading = true;

    this.medecinService.getAll().subscribe({
      next: (data) => {
        this.doctors = data;
        this.filteredDoctors = [...this.doctors];
        this.updatePaginatedDoctors();
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de récupérer les médecins.', 'error');
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    const filter = this.searchKey.trim().toLowerCase();

    this.filteredDoctors = this.doctors.filter(doctor =>
      (`${doctor.prenom} ${doctor.nom} ${doctor.specialite}`)
        .toLowerCase()
        .includes(filter)
    );

    this.currentPage = 0; // reset pagination
    this.updatePaginatedDoctors();
  }

  clearFilter() {
    this.searchKey = '';
    this.filteredDoctors = [...this.doctors];
    this.currentPage = 0;
    this.updatePaginatedDoctors();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePaginatedDoctors();
  }

  updatePaginatedDoctors() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDoctors = this.filteredDoctors.slice(startIndex, endIndex);
  }

  viewDetails(doctor: Medecin) {
    this.router.navigate(['/user-details', doctor.id], { state: { role: doctor.role }});
  }

  viewAgenda(doctor: Medecin) {
    this.router.navigate(['/schedule-consult', doctor.id]);
  }

  openConversation(doctor: Medecin) {
    this.router.navigate(['/messaging/conversation', doctor.id ]);
  }
}
