import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Administrateur } from '../../../models/administrateur';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-manage-admin',
  standalone: false,
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit, AfterViewInit {
  // displayedColumns = ['id', 'nom', 'prenom', 'email', 'telephone', 'niveauAcces', 'actions'];
  displayedColumns = ['id', 'nom', 'prenom', 'email', 'telephone', 'actions'];
  dataSource = new MatTableDataSource<Administrateur>([]);
  numColumns = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.loadAdmins();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadAdmins() {
    this.adminService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => console.error(err)
    });
  }

  addAdmin() {
    this.router.navigate(['/register-admin'], { state: { modeAdmin: true }});
  }

  editAdmin(id: number) {
    this.router.navigate(['/edit-admin', id], { state: { modeAdmin: true }});
  }


deleteAdmin(id: number) {
    Swal.fire({
      title: 'Supprimer cet administrateur ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then(result => {
      if (result.isConfirmed) {
        this.adminService.delete(id).subscribe({
          next: () => {
            Swal.fire({
            icon: 'success',
            title: 'Suppréssion réussie',
            text: "L'administrateur a bien été supprimé !",
            timer: 1500,
            showConfirmButton: false
          });
          this.loadAdmins()
          },
          error: () =>{
            Swal.fire({
              icon: 'error',
              title: "Erreur de suppression",
              text: "La suppression de l'administrateur a rencontré un erreur.",
              showConfirmButton: true,
            });
          } 
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
