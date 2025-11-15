import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Medecin } from '../../models/medecin';
import { MedecinService } from '../../core/services/medecin.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  pageSize: number = 6;
  currentPage: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private medecinService: MedecinService, private router: Router) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.medecinService.getAll().subscribe({
      next: (data) => {
        this.doctors = data;
        this.filteredDoctors = [...this.doctors];
        this.setPaginatedDoctors();
        this.isLoading = false;
      },
      error: (err) =>{
        Swal.fire('Erreur', 'Impossible de récupérer les médecins.', 'error')
        this.isLoading = false;
      } 
    });

  }

  applyFilter() {
    const filter = this.searchKey.trim().toLowerCase();
    this.filteredDoctors = this.doctors.filter(d =>
      d.nom.toLowerCase().includes(filter) ||
      d.prenom.toLowerCase().includes(filter) ||
      d.specialite.toLowerCase().includes(filter)
    );
    this.currentPage = 0;
    this.setPaginatedDoctors();
  }

  clearFilter() {
    this.searchKey = '';
    this.filteredDoctors = [...this.doctors];
    this.setPaginatedDoctors();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.setPaginatedDoctors();
  }

  setPaginatedDoctors() {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedDoctors = this.filteredDoctors.slice(start, end);
  }

  viewDetails(doctor: Medecin) {
    this.router.navigate(['/doctor-details', doctor.id]);
  }

  viewAgenda(doctor: Medecin) {
    this.router.navigate(['/schedule-consult', doctor.id]);
  }
}