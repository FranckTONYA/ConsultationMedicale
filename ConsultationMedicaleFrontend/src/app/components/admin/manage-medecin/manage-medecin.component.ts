import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MedecinService } from '../../../core/services/medecin.service';
import { Medecin } from '../../../models/medecin';

@Component({
  selector: 'app-manage-medecin',
  standalone: false,
  templateUrl: './manage-medecin.component.html',
  styleUrls: ['./manage-medecin.component.css']
})
export class ManageMedecinComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'nom', 'prenom', 'specialite', 'numINAMI', 'telephone', 'email', 'actions'];
  dataSource = new MatTableDataSource<Medecin>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private medecinService: MedecinService, private router: Router) {}

  ngOnInit() {
    this.loadMedecins();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadMedecins() {
    this.medecinService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error(err)
    });
  }

  addMedecin() {
    this.router.navigate(['/register-medecin'], { state: { modeAdmin: true }});
  }

  editMedecin(id: number) {
    this.router.navigate(['/edit-medecin', id], { state: { modeAdmin: true }});
  }

  deleteMedecin(id: number) {
    Swal.fire({
      title: 'Supprimer ce médecin ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Suppréssion réussie',
          text: "Le médecin a bien été supprimé !",
          timer: 1500,
          showConfirmButton: false
        });
        this.medecinService.delete(id).subscribe(() => this.loadMedecins());
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
