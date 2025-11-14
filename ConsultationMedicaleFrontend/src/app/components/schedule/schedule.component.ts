import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import { PlanningMedecinService } from '../../core/services/planning-medecin.service';
import { PlanningMedecin, StatutPlanning } from '../../models/planning-medecin';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

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
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [], // vide pour l'instant
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
      this.events = data.map(item => ({
        id: item.id,
        title: item.statut === StatutPlanning.DISPONIBLE ? 'Disponible' : 'Indisponible',
        start: item.start,
        end: item.end,
        color: item.statut === StatutPlanning.DISPONIBLE ? '#4CAF50' : '#F44336'
      }));

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
    console.log(type);
    const statut = type === 'DISPONIBLE' ? StatutPlanning.DISPONIBLE : StatutPlanning.INDISPONIBLE;
    const slot: PlanningMedecin = new PlanningMedecin();
    slot.start = start;
    slot.end = end;
    slot.statut = statut;
    console.log(slot);
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
