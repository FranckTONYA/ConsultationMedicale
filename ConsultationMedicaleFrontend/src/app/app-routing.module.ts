import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterPatientComponent } from './components/register-patient/register-patient.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardPatientComponent } from './components/dashboard-patient/dashboard-patient.component';
import { RoleUtilisateur } from './models/utilisateur';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { DashboardMedecinComponent } from './components/dashboard-medecin/dashboard-medecin.component';
import { ManagePatientComponent } from './components/admin/manage-patient/manage-patient.component';
import { ManageMedecinComponent } from './components/admin/manage-medecin/manage-medecin.component';
import { ManageAdminComponent } from './components/admin/manage-admin/manage-admin.component';
import { RegisterMedecinComponent } from './components/admin/register-medecin/register-medecin.component';
import { RegisterAdminComponent } from './components/admin/register-admin/register-admin.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ProfilComponent } from './components/profil/profil.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
import { MedicalFileComponent } from './components/medical-file/medical-file.component';
import { MedicalFileDetailsComponent } from './components/medical-file-details/medical-file-details.component';
import { MedicalFileEditComponent } from './components/medical-file-edit/medical-file-edit.component';
import { ConsentManagementComponent } from './components/consent-management/consent-management.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { ScheduleConsultComponent } from './components/schedule-consult/schedule-consult.component';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';
import { ConsultationDetailsComponent } from './components/consultation-details/consultation-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register-patient', component: RegisterPatientComponent },
  { path: 'verify-code', component: VerifyCodeComponent },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MEDECIN, RoleUtilisateur.PATIENT ]} 
  },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MEDECIN, RoleUtilisateur.PATIENT ]} 
  },

  // Dossiers médicaux
  { path: 'dossiers-medicaux', component: MedicalFileComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MEDECIN ]} 
  },

  { path: 'dossier-medical/details/:id', component: MedicalFileDetailsComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MEDECIN, RoleUtilisateur.PATIENT ]} 
  },

  { path: 'dossier-medical/edit/:id', component: MedicalFileEditComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MEDECIN, RoleUtilisateur.PATIENT ]} 
  },

  // Consultations
  { path: 'consultation/details/:id', component: ConsultationDetailsComponent, canActivate: [AuthGuard], 
    data: { roles: [ RoleUtilisateur.MEDECIN, RoleUtilisateur.PATIENT ]} 
  },

  { path: 'consultation/list', component: ConsultationListComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.PATIENT, RoleUtilisateur.MEDECIN ]} 
  },

  { path: 'schedule-consult/:id', component: ScheduleConsultComponent, canActivate: [AuthGuard], 
    data: { roles:  [RoleUtilisateur.PATIENT, RoleUtilisateur.MEDECIN ] } 
  },

  // Dashboard PATIENT
  { path: 'dashboard-patient', component: DashboardPatientComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.PATIENT } 
  },
  { path: 'consent-management', component: ConsentManagementComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.PATIENT } 
  },
  { path: 'doctors-list', component: DoctorsListComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.PATIENT } 
  },

  // Dashboard ADMINISTRATEUR
  { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'manage-patient', component: ManagePatientComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'edit-patient/:id', component: RegisterPatientComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.PATIENT ]} 
  },

  { path: 'manage-medecin', component: ManageMedecinComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'register-medecin', component: RegisterMedecinComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'edit-medecin/:id', component: RegisterMedecinComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MEDECIN ]}
  },

  { path: 'manage-admin', component: ManageAdminComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'register-admin', component: RegisterAdminComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'edit-admin/:id', component: RegisterAdminComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  
    // Dashboard MEDECIN
  { path: 'dashboard-medecin', component: DashboardMedecinComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.MEDECIN } 
  },
  { path: 'schedule-medecin', component: ScheduleComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.MEDECIN } 
  },
  // { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [AuthGuard], 
  //   data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MEDECIN, RoleUtilisateur.PATIENT ]} 
  // },
  // {

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
