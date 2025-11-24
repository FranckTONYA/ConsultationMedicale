import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MessageService } from '../../core/services/message.service';
import { AuthService } from '../../core/services/auth.service';
import { RoleUtilisateur, Utilisateur } from '../../models/utilisateur';
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

  displayedColumns = ['id', 'user', 'lastMessage', 'date', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchText = "";
  statusFilter: 'all' | 'read' | 'unread' = 'all';

  currentUser!: Utilisateur;
  RoleUtilisateur = RoleUtilisateur;
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

    // Filtre basé sur un objet JSON { text , status }
    this.dataSource.filterPredicate = (data, rawFilter) => {
      const filter = JSON.parse(rawFilter);

      const matchesText = data.userName
        .toLowerCase()
        .includes(filter.text.toLowerCase());

      const matchesStatus =
        filter.status === 'all' ||
        (filter.status === 'read' && !data.unread) ||
        (filter.status === 'unread' && data.unread);

      return matchesText && matchesStatus;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Mise à jour unique du filtre global JSON
  applyFilter() {
    this.dataSource.filter = JSON.stringify({
      text: this.searchText.trim(),
      status: this.statusFilter
    });

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

  setStatusFilter(filter: 'all' | 'read' | 'unread') {
    this.statusFilter = filter;
    this.applyFilter();
  }

  loadConversations() {
    this.isLoading = true;

    this.msgService.getAll().subscribe(messages => {

      // filtrage par utilisateur
      const filtered = messages.filter(m =>
        m.emetteurId === this.currentUser.id ||
        m.recepteurId === this.currentUser.id
      );

      const map = new Map<number, any>();

      filtered.forEach(m => {
        this.userService.getById(m.emetteurId!).subscribe(emetteur => {
          this.userService.getById(m.recepteurId!).subscribe(recepteur => {

            const other = m.emetteurId === this.currentUser.id ? recepteur : emetteur;
            const key = other.id!;

            const isUnread = m.recepteurId === this.currentUser.id && !m.lu;

            if (!map.has(key)) {
              map.set(key, {
                user: other,
                userName: `${other.prenom} ${other.nom}`,
                lastMessage: m.document ? m.document.nom : m.contenu,
                date: m.dateEnvoi,
                unread: isUnread
              });
            } else {
              const existing = map.get(key);

              if (new Date(m.dateEnvoi) > new Date(existing.date)) {
                existing.lastMessage = m.document ? m.document.nom : m.contenu;
                existing.date = m.dateEnvoi;
              }

              if (isUnread) existing.unread = true;
            }

            const list = Array.from(map.values());

            // TRI PAR DATE DÉCROISSANTE
            list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            this.dataSource.data = list;
            this.applyFilter();
            this.isLoading = false;

          }, () => { this.error("Erreur chargement recepteur"); });
        }, () => { this.error("Erreur chargement émetteur"); });
      });

    }, () => this.error("Erreur lors du chargement des messages"));
  }

  error(msg: string) {
    Swal.fire('Erreur', msg, 'error');
    this.isLoading = false;
  }

  openConversation(userId: number) {
    this.router.navigate(['/messaging/conversation', userId]);
  }

  goToUser(userId: number, role: RoleUtilisateur) {
    this.router.navigate(['/user-details', userId], { state: { role } });
  }
}
