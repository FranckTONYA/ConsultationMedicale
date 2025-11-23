import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageService } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth.service';
import { Utilisateur } from '../../models/utilisateur';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../core/services/utilisateur.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-messaging',
  standalone: false,
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.css'
})
export class MessagingComponent implements OnInit, AfterViewInit {

  displayedColumns = ['user', 'lastMessage', 'date', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchText = "";
  currentUser!: Utilisateur;
  isLoading = true;

  constructor(
    private msgService: MessageService,
    private authService: AuthService,
    private userService: UtilisateurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.userInfo$.subscribe(u => {
      this.currentUser = u;
      this.loadConversations();
    });

    this.dataSource.filterPredicate = (data, filter) =>
      data.userName.toLowerCase().includes(filter.toLowerCase());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadConversations() {
    this.isLoading = true;

    this.msgService.getAll().subscribe(messages => {

      const map = new Map<number, any>();

      messages.forEach(m => {
        let emetteur = new Utilisateur();
        let recepteur = new Utilisateur();
        this.userService.getById(m.emetteurId!).subscribe({
          next: (user) => {
            emetteur = user;

            this.userService.getById(m.recepteurId!).subscribe({
            next: (user) => {
              recepteur = user;

              const other = m.emetteurId === this.currentUser.id ? recepteur : emetteur;

              if (!map.has(other.id!)) {
                map.set(other.id!, {
                  user: other,
                  userName: `${other.prenom} ${other.nom}`,
                  lastMessage: m.contenu,
                  date: m.dateEnvoi
                });
              }

              this.dataSource.data = Array.from(map.values());

              this.isLoading = false;
              },
              error: () => {
                this.isLoading = false;
                Swal.fire('Erreur', "Erreur lors du chargement du recepteur", 'error');
              }
            });
          },
          error: () => {
            this.isLoading = false;
            Swal.fire('Erreur', "Erreur lors du chargement de l'émetteur", 'error');
          }
        });
      });
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  openConversation(userId: number) {
    this.router.navigate(['/messaging/conversation', userId]);
  }
}