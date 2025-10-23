import { Component } from '@angular/core';
import { PatientService } from '../../core/services/patient.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  // Exemple de données pour les cartes
  stats = [
    { title: 'Rendez-vous à venir', value: 3, icon: 'event' },
    { title: 'Dossiers médicaux', value: 5, icon: 'folder' },
    { title: 'Messages', value: 2, icon: 'mail' }
  ];

  constructor(private patientService:  PatientService){
  }
}
