import { LOCALE_ID, NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatList, MatListModule } from '@angular/material/list';
import { FullCalendarModule } from '@fullcalendar/angular';

import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getFrenchPaginatorIntl } from './core/i18n/french-paginator-intl';

import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr);


import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

import { LoginComponent } from './components/login/login.component';
import { RegisterPatientComponent } from './components/register-patient/register-patient.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardPatientComponent } from './components/dashboard-patient/dashboard-patient.component';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { DashboardMedecinComponent } from './components/dashboard-medecin/dashboard-medecin.component';
import { ManagePatientComponent } from './components/admin/manage-patient/manage-patient.component';
import { ManageMedecinComponent } from './components/admin/manage-medecin/manage-medecin.component';
import { ManageAdminComponent } from './components/admin/manage-admin/manage-admin.component';
import { RegisterAdminComponent } from './components/admin/register-admin/register-admin.component';
import { RegisterMedecinComponent } from './components/admin/register-medecin/register-medecin.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { VerifyCodeComponent } from './components/verify-code/verify-code.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { MedicalFileComponent } from './components/medical-file/medical-file.component';
import { MedicalFileDetailsComponent } from './components/medical-file-details/medical-file-details.component';
import { MedicalFileEditComponent } from './components/medical-file-edit/medical-file-edit.component';
import { ConsentManagementComponent } from './components/consent-management/consent-management.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ScheduleConsultComponent } from './components/schedule-consult/schedule-consult.component';
import { DoctorsListComponent } from './components/doctors-list/doctors-list.component';
import { ConsultationListComponent } from './components/consultation-list/consultation-list.component';
import { ConsultationDetailsComponent } from './components/consultation-details/consultation-details.component';
import { ConsultationEditComponent } from './components/consultation-edit/consultation-edit.component';
import { ConsultDocumentsComponent } from './components/consult-documents/consult-documents.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterPatientComponent,
    NavbarComponent,
    DashboardPatientComponent,
    DashboardAdminComponent,
    DashboardMedecinComponent,
    ManagePatientComponent,
    ManageMedecinComponent,
    ManageAdminComponent,
    RegisterAdminComponent,
    RegisterMedecinComponent,
    ProfilComponent,
    ChangePasswordComponent,
    VerifyCodeComponent,
    ResetPasswordComponent,
    MedicalFileComponent,
    MedicalFileDetailsComponent,
    MedicalFileEditComponent,
    ConsentManagementComponent,
    ScheduleComponent,
    ScheduleConsultComponent,
    DoctorsListComponent,
    ConsultationListComponent,
    ConsultationDetailsComponent,
    ConsultationEditComponent,
    ConsultDocumentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    // HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatOption,
    MatSelectModule,
    MatListModule,
    FullCalendarModule,
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    // provideClientHydration(withEventReplay())
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
       { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() },
        { provide: LOCALE_ID, useValue: 'fr-FR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
