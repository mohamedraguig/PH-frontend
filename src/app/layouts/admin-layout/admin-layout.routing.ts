import {Routes} from '@angular/router';

import {DashboardComponent} from '../../dashboard/dashboard.component';
import {UserProfileComponent} from '../../user-profile/user-profile.component';
import {EmpFormComponent} from '../../emp-form/emp-form.component';
import {EmpListComponent} from '../../emp-list/emp-list.component';
import {DeleteFormComponent} from '../../delete-form/delete-form.component';
import {CompanyFormComponent} from '../../company-form/company-form.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent},
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'formulaire-collaborateur',  component: EmpFormComponent},
    { path: 'liste-collaborateurs', component: EmpListComponent},
    { path: 'formulaire-sortie', component: DeleteFormComponent},
    { path: 'formulaire-entreprise', component: CompanyFormComponent}
];
