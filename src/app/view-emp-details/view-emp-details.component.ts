import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Employee} from '../models/employee.model';
import {EmployeeService} from '../services/employee.service';
import {NotificationsComponent} from '../notifications/notifications.component';

@Component({
  selector: 'app-view-emp-details',
  templateUrl: './view-emp-details.component.html',
  styleUrls: ['./view-emp-details.component.scss', '../layouts/admin-layout/admin-layout.component.scss']
})
export class ViewEmpDetailsComponent implements OnInit{
  employee: Employee;
  piecesJointes = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private empService: EmployeeService,
              private notification: NotificationsComponent) {
    if (data) {
      this.employee = data.employee;
    }
  }

  ngOnInit(): void {
    this.empService.getEmployeePjs(this.employee.id).subscribe(pjs => {
      this.piecesJointes = pjs
    }, () => {
      this.notification.showNotification('error', 'Une erreur est survenue lors de la récupèration des pièces jointes');
    });
  }

  downloadPj(pieceJointe) {
    this.empService.downloadPj(pieceJointe.id).subscribe(result => {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(result);
      a.download = pieceJointe.name;
      a.click();
    });
  }


}
