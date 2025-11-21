import { Component, OnInit } from '@angular/core';
import { ConsultationService } from '../../core/services/consultation.service';
import { PlanningMedecinService } from '../../core/services/planning-medecin.service';
import { AuthService } from '../../core/services/auth.service';
import { PlanningMedecin, StatutPlanning } from '../../models/planning-medecin';
import { Consultation, StatutRDV } from '../../models/consultation';
import { PatientService } from '../../core/services/patient.service';
import Swal from 'sweetalert2';
import frLocale from '@fullcalendar/core/locales/fr';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ActivatedRoute } from '@angular/router';
import { Medecin } from '../../models/medecin';
import { MedecinService } from '../../core/services/medecin.service';
import { RoleUtilisateur } from '../../models/utilisateur';

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
  currentUser!: any;
  medecinId!: any;
  medecin: Medecin = new Medecin();
  plannings!: PlanningMedecin[];
  isPatient = false;
  isMedecin = false;

  isLoading = true;

  constructor(
    private medecinService: MedecinService,
    private planningService: PlanningMedecinService,
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe(params => {
      this.medecinId = params.get('id');
    });
  }

  ngOnInit(): void {
    if (this.medecinId) {
      this.medecinService.getById(this.medecinId).subscribe({
        next: (response: Medecin) => {
          this.medecin = response;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Erreur', "Impossible de charger le médecin", 'error');
        }
      });
    }

    this.authService.userInfo$.subscribe({
      next: (info) => {
        if (info) {
          this.currentUser = info;
          this.patientId = info.id;
          this.isPatient = info.role === RoleUtilisateur.PATIENT;
          this.isMedecin = info.role === RoleUtilisateur.MEDECIN;
          this.initCalendar();
          this.loadEvents();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', "Impossible de charger le planning", 'error');
      }
    });
  }

  initCalendar() {
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
      selectable: false,
      editable: false,
      height: 'auto',
      eventClick: (info: any) => this.bookSlot(info.event),
      events: []
    };
    this.calendarReady = true;
  }

  loadEvents() {
    this.isLoading = true;
    if (!this.medecinId) return;

    this.planningService.getByMedecin(this.medecinId).subscribe({
      next: (plannings) => {
        this.plannings = plannings;
        this.events = [];

        plannings.forEach((p: PlanningMedecin) => {
          if (p.statut === StatutPlanning.DISPONIBLE) {
            let start = new Date(p.startDate);
            const end = new Date(p.endDate);

            while (start < end) {
              const slotEnd = new Date(start.getTime() + 30 * 60000);
              if (slotEnd > end) break;
              this.events.push({
                id: `${p.id}-${start.toISOString()}`,
                title: 'Disponible',
                start: start,
                end: slotEnd,
                color: '#4CAF50',
                extendedProps: { statut: StatutPlanning.DISPONIBLE },
                allDay: false
              });
              start = slotEnd;
            }
          } else {
            this.events.push({
              id: p.id,
              title: 'Indisponible',
              start: new Date(p.startDate),
              end: new Date(p.endDate),
              color: '#F44336',
              extendedProps: { statut: StatutPlanning.INDISPONIBLE },
              allDay: false
            });
          }
        });

        this.calendarOptions = { ...this.calendarOptions, events: this.events };
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Erreur', "Impossible de charger le planning", 'error');
      }
    });
  }

  bookSlot(event: any) {
    if (event.extendedProps.statut !== StatutPlanning.DISPONIBLE) {
      Swal.fire('Indisponible', 'Cette plage n’est pas disponible pour une consultation.', 'warning');
      return;
    }

    if (this.isPatient) {
      // Cas patient : demande classique
      Swal.fire({
        title: 'Confirmer la demande de consultation ?',
        text: `Le ${event.start.toLocaleString()} - ${event.end.toLocaleString()}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Oui, réserver'
      }).then(result => {
        if (result.isConfirmed) {
          this.isLoading = true;
          const consultation: Consultation = new Consultation();
          const localISODebut = new Date(event.start.getTime() - event.start.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
          const localISOFin = new Date(event.end.getTime() - event.end.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
          consultation.debut = localISODebut;
          consultation.fin = localISOFin;
          consultation.statut = StatutRDV.EN_ATTENTE;
          consultation.patient = { id: this.patientId } as any;
          consultation.medecin = { id: this.medecinId } as any;

          this.consultationService.add(consultation).subscribe({
            next: () => {
              Swal.fire('Demande effectuée', 'Votre demande de consultation est en attente de confirmation du médecin.', 'success');
              this.loadEvents();
              this.isLoading = false;
            },
            error: () => {
              Swal.fire('Erreur', "Impossible d'éffectuer la demande de consultation", 'error');
              this.isLoading = false;
            }
          });
        }
      });
    } else if (this.isMedecin) {
      // Cas médecin : saisir NISS du patient
      Swal.fire({
        title: 'Créer une consultation',
        input: 'text',
        inputLabel: 'NISS du patient',
        inputPlaceholder: 'Saisir le NISS',
        showCancelButton: true
      }).then(result => {
        if (result.isConfirmed && result.value) {
          const niss = result.value;
          this.isLoading = true;
          this.patientService.getByNISS(niss).subscribe({
            next: (patient) => {
              if (!patient || !patient.id) {
                this.isLoading = false;
                Swal.fire("Inexistant", "Aucun patient avec cet NISS n'a été trouvé.", 'error');
                return;
              }

              const consultation: Consultation = new Consultation();
              const localISODebut = new Date(event.start.getTime() - event.start.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
              const localISOFin = new Date(event.end.getTime() - event.end.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
              consultation.debut = localISODebut;
              consultation.fin = localISOFin;
              consultation.statut = StatutRDV.CONFIRMER;
              consultation.patient = { id: patient.id } as any;
              consultation.medecin = { id: this.currentUser.id } as any;

              this.consultationService.add(consultation).subscribe({
                next: () => {
                  Swal.fire('Consultation créée', 'La consultation a été confirmée.', 'success');
                  this.loadEvents();
                  this.isLoading = false;
                },
                error: () => {
                  Swal.fire('Erreur', 'Impossible de créer la consultation.', 'error');
                  this.isLoading = false;
                }
              });
            },
            error: () => {
              this.isLoading = false;
              Swal.fire('Erreur', 'Impossible de récupérer le patient.', 'error');
            }
          });
        }
      });
    }
  }
}
