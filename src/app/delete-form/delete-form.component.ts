import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Employee} from '../models/employee.model';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-delete-form',
  templateUrl: './delete-form.component.html',
  styleUrls: ['./delete-form.component.scss', '../layouts/admin-layout/admin-layout.component.scss']
})
export class DeleteFormComponent implements OnInit {

  deleteForm: FormGroup;
  employee: Employee;
  piecesJointes = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public fb: FormBuilder,
              public dialogRef: MatDialogRef<DeleteFormComponent>) {
    if (data) {
      this.employee = data.employee;
    }
  }

  ngOnInit(): void {
    this.deleteForm = this.fb.group({
      dateSortie: new FormControl(''),
      causeSortie: new FormControl(''),
      dernierJrTravaille: new FormControl(''),
      pieceJointe: new FormControl(''),
      actif: false
    });
  }

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.piecesJointes.push(event.target.files[i]);
    }
  }

  enleverPJ(pj: any) {
    this.piecesJointes = this.piecesJointes.filter(pieceJointe => pieceJointe !== pj);
  }

  confirmSortie() {
    this.dialogRef.close({
      data: {
        deleteForm : this.deleteForm.value,
        piecesJointes: this.piecesJointes
      }
    });
  }
}
