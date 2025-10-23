import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterPatientComponent } from './components/register-patient/register-patient.component';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoleUtilisateur } from './models/utilisateur';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterPatientComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], 
    data: { roles: [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.MEDECIN, RoleUtilisateur.PATIENT ]} 
  },
  // {
  //   path: 'patient',
  //   canActivate: [AuthGuard],
  //   // component: Patien
  // },
  // {
  //   path: 'medecin',
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard],
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
