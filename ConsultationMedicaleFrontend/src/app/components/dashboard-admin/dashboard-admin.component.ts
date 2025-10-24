import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-admin',
  standalone: false,
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

  users: any[] = [];
  displayedColumns: string[] = ['id', 'nom', 'prenom', 'email', 'role', 'actions'];
  apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  addUser(role: 'admin' | 'medecin') {
    Swal.fire({
      title: `Inscrire un ${role}`,
      html: `
        <input id="nom" class="swal2-input" placeholder="Nom">
        <input id="prenom" class="swal2-input" placeholder="Prénom">
        <input id="email" class="swal2-input" placeholder="Email">
        <input id="password" type="password" class="swal2-input" placeholder="Mot de passe">
      `,
      confirmButtonText: 'Créer',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const nom = (document.getElementById('nom') as HTMLInputElement).value;
        const prenom = (document.getElementById('prenom') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        return { nom, prenom, email, password };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`${this.apiUrl}/register/${role}`, result.value).subscribe({
          next: () => {
            Swal.fire('Succès', `${role} ajouté avec succès`, 'success');
            this.loadUsers();
          },
          error: (err) => {
            Swal.fire('Erreur', 'Impossible de créer cet utilisateur', 'error');
            console.error(err);
          }
        });
      }
    });
  }

  deleteUser(id: number) {
    Swal.fire({
      title: 'Supprimer cet utilisateur ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.apiUrl}/${id}`).subscribe({
          next: () => {
            Swal.fire('Supprimé', 'Utilisateur supprimé', 'success');
            this.loadUsers();
          },
          error: (err) => {
            Swal.fire('Erreur', 'Suppression impossible', 'error');
            console.error(err);
          }
        });
      }
    });
  }

}
