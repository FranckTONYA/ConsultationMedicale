import { Component, Input, OnInit } from '@angular/core';
import { ConsultationService } from '../../core/services/consultation.service';
import { PlanningMedecinService } from '../../core/services/planning-medecin.service';
import { AuthService } from '../../core/services/auth.service';
import { PlanningMedecin, StatutPlanning } from '../../models/planning-medecin';
import { Consultation, StatutRDV } from '../../models/consultation';
import Swal from 'sweetalert2';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-schedule-consult',
  standalone: false,
  templateUrl: './schedule-consult.component.html',
  styleUrls: ['./schedule-consult.component.css']
})
export class ScheduleConsultComponent implements OnInit {


  calendarOptions: any;
  events: any[] = [];
  calendarReady = false;
  patientId!: number;
  medecinId!: any;

  isLoading = true;

  constructor(
    private planningService: PlanningMedecinService,
    private consultationService: ConsultationService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
      this.route.paramMap.subscribe(params => {
        this.medecinId = params.get('id');
        console.log(this.medecinId);
      });
  }

  ngOnInit(): void {
    this.authService.userInfo$.subscribe(info => {
      if (info) {
        this.patientId = info.id;
        this.initCalendar();
        this.loadEvents();
      }
      this.isLoading = false;
    });
    
  }

  initCalendar() {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: false,
      editable: false,
      height: 'auto',
      eventClick: (info: any) => this.bookSlot(info.event),
      events: []
    };
    this.calendarReady = true;
  }

  loadEvents() {
    if (!this.medecinId) return;

    this.planningService.getByMedecin(this.medecinId).subscribe(plannings => {
      console.log(this.medecinId);
      console.log(plannings);
      this.events = plannings.map((p: PlanningMedecin) => ({
        id: p.id,
        start: new Date(p.startDate),
        end: new Date(p.endDate),
        title: p.statut === StatutPlanning.DISPONIBLE ? 'Disponible' : 'Indisponible',
        color: p.statut === StatutPlanning.DISPONIBLE ? '#4CAF50' : '#F44336',
        extendedProps: { statut: p.statut }
      }));

      if (this.calendarOptions) {
        this.calendarOptions = { ...this.calendarOptions, events: this.events };
      }
    });
  }

  bookSlot(event: any) {
    if (event.extendedProps.statut !== StatutPlanning.DISPONIBLE) {
      Swal.fire('Indisponible', 'Cette plage n’est pas disponible pour une consultation.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Confirmer votre consultation ?',
      text: `Le ${event.start.toLocaleString()}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, réserver'
    }).then(result => {
      if (result.isConfirmed) {
        const consultation: Consultation = new Consultation();
        consultation.dateHeure = event.start;
        consultation.statut = StatutRDV.EN_ATTENTE;
        consultation.patient = { id: this.patientId } as any;
        consultation.medecin = { id: this.medecinId } as any;

        this.consultationService.add(consultation).subscribe(() => {
          Swal.fire('Réservé', 'Votre consultation a été créée.', 'success');
          this.loadEvents(); // recharge les events pour rafraîchir le planning
        });
      }
    });
  }
}
