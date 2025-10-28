import { NgModule, importProvidersFrom } from '@angular/core';
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
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getFrenchPaginatorIntl } from './core/i18n/french-paginator-intl';

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
    ChangePasswordComponent
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
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    // provideClientHydration(withEventReplay())
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
       { provide: MatPaginatorIntl, useValue: getFrenchPaginatorIntl() }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
