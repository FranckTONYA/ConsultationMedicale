import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { PlanningMedecinService } from '../../core/services/planning-medecin.service';
import { PlanningMedecin, StatutPlanning } from '../../models/planning-medecin';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  medecinId!: number;
  events: any[] = [];
  calendarOptions: any;
  calendarReady = false;

  constructor(
    private planningService: PlanningMedecinService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.userInfo$.subscribe(info => {
      if (info) {
        this.medecinId = info.id;
        this.initCalendar();    // on initialise d’abord les plugins
        this.loadEvents();      // puis on charge les events async
      }
    });
  }

  initCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',  // <-- permet la sélection horaire
      locale: frLocale,
      slotMinTime: '06:00:00',      // optionnel : début journée
      // slotMaxTime: '20:00:00',      // optionnel : fin journée
      slotDuration: '00:30:00',     // durée d'un créneau
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [], 
      selectable: true,
      editable: false,
      height: 'auto',
      select: (info: any) => this.askSlotType(info.startStr, info.endStr),
      eventClick: (info: any) => this.confirmDelete(info.event.id)
    };

    this.calendarReady = true; // maintenant on peut afficher le composant
  }

loadEvents(): void {
  if (!this.medecinId) return;

  this.planningService.getByMedecin(this.medecinId).subscribe(data => {

    this.events = data.map(item => {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);

      // Détecte si c'est un événement "allDay" (heure à minuit)
      const allDay = start.getHours() === 0 && start.getMinutes() === 0 &&
                     end.getHours() === 0 && end.getMinutes() === 0;

      return {
        id: item.id,
        title: item.statut === 'DISPONIBLE' ? 'Disponible' : 'Indisponible',
        start,
        end,
        color: item.statut === 'DISPONIBLE' ? '#4CAF50' : '#F44336',
        allDay
      };
    });

      // this.events = data.map(item => ({
      //   id: item.id,
      //   title: item.statut === StatutPlanning.DISPONIBLE ? 'Disponible' : 'Indisponible',
      //   start: new Date(item.startDate),
      //   end: new Date(item.endDate),
      //   color: item.statut === StatutPlanning.DISPONIBLE ? '#4CAF50' : '#F44336',
      //   allDay: false
      // }));

    // Mise à jour des events dans le calendrier
    if (this.calendarOptions) {
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    }

  });
}


  askSlotType(start: string, end: string) {
    Swal.fire({
      title: 'Type de créneau',
      input: 'select',
      inputOptions: {
        DISPONIBLE: 'Disponible',
        INDISPONIBLE: 'Indisponible'
      },
      confirmButtonText: 'Créer',
      showCancelButton: true
    }).then(result => {
      if (result.value) {
        this.addSlot(start, end, result.value);
      }
    });
  }

  addSlot(start: string, end: string, type: string) {
    const statut = type === 'DISPONIBLE' ? StatutPlanning.DISPONIBLE : StatutPlanning.INDISPONIBLE;
    const slot: PlanningMedecin = new PlanningMedecin();
    slot.startDate = new Date(start);
    slot.endDate = new Date(end);
    slot.statut = statut;

    this.planningService.add(this.medecinId, slot).subscribe(() => {
      Swal.fire('Ajouté', 'Créneau ajouté avec succès', 'success');
      this.loadEvents();
    });
  }

  confirmDelete(eventId: number) {
    Swal.fire({
      title: 'Supprimer ce créneau ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer'
    }).then(result => {
      if (result.isConfirmed) {
        this.deleteSlot(eventId);
      }
    });
  }

  deleteSlot(id: number) {
    this.planningService.delete(id).subscribe(() => {
      Swal.fire('Supprimé', 'Créneau supprimé', 'success');
      this.loadEvents();
    });
  }

}
