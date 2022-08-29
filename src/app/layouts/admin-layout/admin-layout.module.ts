import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AdminLayoutRoutes} from './admin-layout.routing';
import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {NotificationsComponent} from '../../notifications/notifications.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {EmpFormComponent} from '../../emp-form/emp-form.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {EmpListComponent} from '../../emp-list/emp-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ViewEmpDetailsComponent} from '../../view-emp-details/view-emp-details.component';
import {MatDialogModule} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../../delete-confirm-dialog/delete-confirm-dialog.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MatCardModule} from '@angular/material/card';
import {DeleteFormComponent} from '../../delete-form/delete-form.component';
import {CompanyFormComponent} from '../../company-form/company-form.component';

const MY_DATE_FORMAT = {
    parse: {
        dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
    },
    display: {
        dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY'
    }
};

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatRadioModule,
        MatListModule,
        MatIconModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        MatSnackBarModule,
        MatCardModule
    ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    NotificationsComponent,
    EmpFormComponent,
    EmpListComponent,
    ViewEmpDetailsComponent,
    DeleteConfirmDialogComponent,
    DeleteFormComponent,
    CompanyFormComponent
  ],
  providers: [
    MatDatepickerModule,
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    DatePipe,
    NotificationsComponent
  ],
  entryComponents: [
      ViewEmpDetailsComponent,
      DeleteConfirmDialogComponent,
      DeleteFormComponent
  ]
})
export class AdminLayoutModule {

}
