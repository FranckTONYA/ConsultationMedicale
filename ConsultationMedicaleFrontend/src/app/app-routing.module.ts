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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterPatientComponent },
  { path: 'dashboard-patient', component: DashboardPatientComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.PATIENT } 
  },
  { path: 'dashboard-admin', component: DashboardAdminComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'manage-patient', component: ManagePatientComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'manage-medecin', component: ManageMedecinComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  { path: 'manage-admin', component: ManageAdminComponent, canActivate: [AuthGuard], 
    data: { role: RoleUtilisateur.ADMINISTRATEUR } 
  },
  
  { path: 'dashboard-medecin', component: DashboardMedecinComponent, canActivate: [AuthGuard], 
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
