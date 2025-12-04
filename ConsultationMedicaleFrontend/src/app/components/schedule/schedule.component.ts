import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';
import 'tippy.js/dist/tippy.css';
import tippy from 'tippy.js';

import { PlanningMedecinService } from '../../core/services/planning-medecin.service';
import { ConsultationService } from '../../core/services/consultation.service';
import { PlanningMedecin, StatutPlanning } from '../../models/planning-medecin';
import { Consultation, getLabelRDV, getLabelStatut, StatutRDV } from '../../models/consultation';

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
  isLoading = true;

  plannings: PlanningMedecin[] = [];
  consultations: Consultation[] = [];

  constructor(
    private planningService: PlanningMedecinService,
    private consultationService: ConsultationService,
    public authService: AuthService
  ) { this.isLoading = true; }

  ngOnInit(): void {
    this.authService.userInfo$.subscribe({
      next: (info) => {
        if (info) {
          this.medecinId = info.id;
          this.initCalendar();
          this.loadPlannings();
          this.loadConsultations();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', "Impossible de charger le planning", 'error');
      }
    });
  }

  initCalendar(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      locale: frLocale,
      slotMinTime: '06:00:00',
      slotDuration: '00:30:00',
      timeZone: 'local',
      allDaySlot: false,
      displayEventTime: true,
      forceEventDuration: true,
      eventDisplay: 'block',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [],
      selectable: true,
      editable: false,
      height: 'auto',
      contentHeight: 'auto',
      aspectRatio: window.innerWidth > 768 ? 1.8 : 1.2, // ratio large pour desktop, plus compact pour mobile
      select: (info: any) => this.askSlotType(info.startStr, info.endStr),
      eventClick: (info: any) => this.handleEventClick(info.event),
      eventDidMount: (info: any) => {
        if (info.event.extendedProps.patientName) {
          const labelStatut = getLabelRDV(info.event.extendedProps.statut as StatutRDV);
          tippy(info.el, {
            content: `${info.event.extendedProps.patientName} (${labelStatut})`,
            placement: 'top',
            arrow: true,
            theme: 'light',
          });
        }
      }
    };
    this.calendarReady = true;
  }

  loadPlannings(): void {
    if (!this.medecinId) return;
    this.isLoading = true;
    this.planningService.getByMedecin(this.medecinId).subscribe({
      next: (data) => {
        this.plannings = data;
        this.generateEvents();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', "Impossible de charger le planning", 'error');
      }
    });
  }

  loadConsultations(): void {
    if (!this.medecinId) return;
    this.consultationService.getByMedecin(this.medecinId).subscribe({
      next: (data) => {
        // Inclure EN_ATTENTE, CONFIRMER et TERMINER
        this.consultations = data.filter(c =>
          c.statut === StatutRDV.EN_ATTENTE ||
          c.statut === StatutRDV.CONFIRMER ||
          c.statut === StatutRDV.TERMINER
        );
        this.generateEvents();
      },
      error: () => {}
    });
  }

  generateEvents(): void {
    this.events = [];

    this.consultations.forEach(c => {
      let color = '#cca20aff'; // EN_ATTENTE marron
      if (c.statut === StatutRDV.CONFIRMER) color = '#2196F3'; // CONFIRMER vert foncé
      if (c.statut === StatutRDV.TERMINER) color = '#000000'; // TERMINER noir

      this.events.push({
        id: `consult-${c.id}`,
        title: 'RDV',
        start: new Date(c.debut),
        end: new Date(c.fin),
        color: color,
        allDay: false,
        extendedProps: {
          statut: c.statut,
          patientName: `${c.patient?.nom} ${c.patient?.prenom} ${c.patient?.niss}`
        }
      });
    });

    this.plannings.forEach(p => {
      const hasSameConsult = this.consultations.some(c =>
        new Date(c.debut).getTime() === new Date(p.startDate).getTime() &&
        new Date(c.fin).getTime() === new Date(p.endDate).getTime()
      );

      if (p.statut === StatutPlanning.INDISPONIBLE && hasSameConsult) return;

      this.events.push({
        id: p.id,
        title: p.statut === StatutPlanning.DISPONIBLE ? 'Disponible' : 'Indisponible',
        start: new Date(p.startDate),
        end: new Date(p.endDate),
        color: p.statut === StatutPlanning.DISPONIBLE ? '#4CAF50' : '#F44336',
        allDay: false,
        extendedProps: { statut: p.statut }
      });
    });

    if (this.calendarOptions) {
      this.calendarOptions = { ...this.calendarOptions, events: this.events };
    }
  }

  askSlotType(start: string, end: string) {
    Swal.fire({
      title: 'Choisissez la disponibilité du créneau horaire.',
      input: 'select',
      inputOptions: { DISPONIBLE: 'Disponible', INDISPONIBLE: 'Indisponible' },
      confirmButtonText: 'Créer',
      showCancelButton: true
    }).then(result => {
      if (result.value) this.addSlot(start, end, result.value);
    });
  }

  addSlot(start: string, end: string, type: string) {
    this.isLoading = true;
    const statut = type === 'DISPONIBLE' ? StatutPlanning.DISPONIBLE : StatutPlanning.INDISPONIBLE;
    const slot: PlanningMedecin = new PlanningMedecin();
    slot.startDate = start.slice(0,19);
    slot.endDate = end.slice(0,19);
    slot.statut = statut;

    this.planningService.add(this.medecinId, slot).subscribe({
      next: () => { Swal.fire('Ajouté', 'Créneau ajouté avec succès', 'success'); this.loadPlannings(); this.isLoading = false; },
      error: () => { this.isLoading = false; Swal.fire('Erreur', "Erreur lors de l'ajout du créneau", 'error'); }
    });
  }

  handleEventClick(event: any) {
    if (typeof event.id === 'string' && event.id.startsWith('consult-')) {
      const consultId = parseInt(event.id.replace('consult-', ''), 10);
      const consultation = this.consultations.find(c => c.id === consultId);
      if (!consultation) return;

      if (consultation.statut === StatutRDV.EN_ATTENTE) {
        Swal.fire({
          title: 'Consultation en attente de confirmation. Voulez-vous ?',
          text: `Patient : ${consultation.patient?.nom} ${consultation.patient?.prenom}`,
          icon: 'question',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'La confirmer',
          denyButtonText: 'La refuser',
          cancelButtonText: 'Retour'
        }).then(result => {
          if (result.isConfirmed) this.updateConsultationStatus(consultId, StatutRDV.CONFIRMER);
          else if (result.isDenied) this.updateConsultationStatus(consultId, StatutRDV.REFUSER);
        });
      } else if (consultation.statut === StatutRDV.CONFIRMER) {
        Swal.fire({
          title: 'Consultation confirmée. Voulez-vous ?',
          text: `Patient : ${consultation.patient?.nom} ${consultation.patient?.prenom}`,
          icon: 'question',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'La terminer',
          denyButtonText: "L'annuler",
          cancelButtonText: 'Retour'
        }).then(result => {
          if (result.isConfirmed) this.updateConsultationStatus(consultId, StatutRDV.TERMINER);
          else if (result.isDenied) this.updateConsultationStatus(consultId, StatutRDV.ANNULER);
        });
      }

    } else {
      this.confirmDelete(event.id);
    }
  }

  updateConsultationStatus(id: number, statut: StatutRDV) {
    this.isLoading = true;
    const consultation = this.consultations.find(c => c.id === id);
    if (!consultation) return;

    let obs$;

    if (statut === StatutRDV.ANNULER) {
      obs$ = this.consultationService.cancelConsultation(id);
    } else if (statut === StatutRDV.REFUSER) {
      obs$ = this.consultationService.refuseConsultation(id);
    } else {
      consultation.statut = statut;
      obs$ = this.consultationService.update(id, consultation);
    }

    obs$.subscribe({
      next: () => {
        Swal.fire('OK', `Consultation ${getLabelStatut(statut)}`, 'success');
        this.initCalendar();
        this.loadPlannings();
        this.loadConsultations();
        this.isLoading = false;
      },
      error: (err) => {
        Swal.fire('Erreur', err.error?.error ?? "Impossible de mettre à jour la consultation", 'error');
        this.loadConsultations();
        this.isLoading = false;
      }
    });
  }


  confirmDelete(eventId: any) {
    Swal.fire({
      title: 'Supprimer ce créneau ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer'
    }).then(result => {
      if (result.isConfirmed) this.deleteSlot(eventId);
    });
  }

  deleteSlot(id: number) {
    this.isLoading = true;
    this.planningService.delete(id).subscribe({
      next: () => { Swal.fire('Supprimé', 'Créneau supprimé', 'success'); this.loadPlannings(); this.isLoading = false; },
      error: () => { this.isLoading = false; Swal.fire('Erreur', "Erreur lors de la suppression du créneau", 'error'); }
    });
  }
}
