import {Component, OnInit, ViewChild} from '@angular/core';
import {EmployeeService} from '../services/employee.service';
import {Employee} from '../models/employee.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {ViewEmpDetailsComponent} from '../view-emp-details/view-emp-details.component';
import {DeleteConfirmDialogComponent} from '../delete-confirm-dialog/delete-confirm-dialog.component';
import {NotificationsComponent} from '../notifications/notifications.component';
import {DeleteFormComponent} from '../delete-form/delete-form.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.scss']
})
export class EmpListComponent implements OnInit {

  displayedColumns: string[] = ['profil', 'nom', 'prenom', 'telephone', 'email', 'nbrHeures', 'commentaire', 'actions'];
  dataSource = new MatTableDataSource<Employee>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  empToEdit: Employee;

  constructor(public empService: EmployeeService,
              public dialog: MatDialog,
              private notifications: NotificationsComponent,
              private router: Router) { }

  ngOnInit(): void {
    this.getAllEmployees();
  }

  getAllEmployees() {
    this.empService.getAllEmployees().subscribe(employees => {
      if (employees != null) {
        this.dataSource.data = employees;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  editEmployee(employee: Employee) {
    this.empService.changeEmployeeToEdit(employee);
    this.router.navigate(['/formulaire-collaborateur']);
  }

  deleteEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      data: {
        text: 'Vous êtes sur le point de supprimer définitivement ' +
            'le collaborateur ' + employee.nom + ' ' + employee.prenom + ', '+
            'êtes-vous sur ?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.data.confirm) {
          this.empService.deleteEmployee(employee).subscribe(() => {
            this.notifications.showNotification('success', 'Collaborateur supprimé avec succès');
            this.getAllEmployees();
          });
        }
      }
    });
  }

  deactivateEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(DeleteFormComponent, {
      width: '450px',
      data: {
        employee
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.data.deleteForm) {
          employee = this.empService.updateFromPartial(employee, result.data.deleteForm);
          this.empService.deactivateEmployee(this.empService.updateFromPartial(employee, result.data.deleteForm), result.data.piecesJointes).subscribe(() => {
            this.notifications.showNotification('success', 'La fiche de sortie à bien été enregistrée');
            this.getAllEmployees();
          });
        }
      }
    });
  }

  viewDetails(employee: Employee) {
    this.dialog.open(ViewEmpDetailsComponent, {
      width: '600px',
      data: {
        employee
      }
    });
  }
}
