import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Administrateur } from '../../../models/administrateur';
import { AdminService } from '../../../core/services/admin.service';
import { RoleUtilisateur, Utilisateur } from '../../../models/utilisateur';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manage-admin',
  standalone: false,
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.css']
})
export class ManageAdminComponent implements OnInit, AfterViewInit {

  displayedColumns = ['id', 'nom', 'prenom', 'sexe', 'email', 'telephone', 'actions'];
  dataSource = new MatTableDataSource<Administrateur>([]);
  currentUser = new Utilisateur();
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private adminService: AdminService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Récupération de l'utilisateur connecté
    this.authService.userInfo$.subscribe(user => {
      this.currentUser = user;
    });
    
    // PREDICATE AJOUTÉ (nécessaire pour filtre correct + pagination)
    this.dataSource.filterPredicate = (admin: Administrateur, filter: string) => {
      const text = filter.trim().toLowerCase();
      return (
        admin.nom?.toLowerCase().includes(text) ||
        admin.prenom?.toLowerCase().includes(text) ||
        admin.sexe?.toLowerCase().includes(text) ||
        admin.email?.toLowerCase().includes(text) ||
        admin.telephone?.toLowerCase().includes(text)
      );
    };

    this.loadAdmins();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadAdmins() {
    this.isLoading = true;

    this.adminService.getAll().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  addAdmin() {
    this.router.navigate(['/register-admin'], { state: { modeAdmin: true } });
  }

  editAdmin(id: number) {
    this.router.navigate(['/edit-admin', id], { state: { modeAdmin: true } });
  }

  voirDetails(userId: number) {
    this.router.navigate(
      ['/user-details', userId],
      { state: { role :  RoleUtilisateur.ADMINISTRATEUR} }
    );
  }

  deleteAdmin(id: number) {
    if (id === this.currentUser.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Action interdite',
        text: 'Vous ne pouvez pas supprimer votre propre compte.',
      });
      return;
    }

    Swal.fire({
      title: 'Supprimer cet administrateur ?',
      icon: 'warning',
      text: "Cette opération supprimera également tous les éléments liés à cet administrateur" ,
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then(result => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.adminService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Suppréssion réussie',
              text: "L'administrateur a bien été supprimé !",
              timer: 1500,
              showConfirmButton: false
            });
            this.isLoading = false;
            this.loadAdmins();
          },
          error: () => {
            this.isLoading = false;
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
    const filterValue = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // AJOUT IDENTIQUE À consultation-list
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    }
  }

  openConversation(userId: number) {
    this.router.navigate(['/messaging/conversation', userId]);
  }
}
