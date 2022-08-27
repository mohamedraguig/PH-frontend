import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.scss']
})
export class DeleteConfirmDialogComponent {

  textToDisplay: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>) {
    if (this.data) {
      this.textToDisplay = this.data.text;
    }
  }

  confirmDelete() {
    this.dialogRef.close({
      data: {
        confirm: true
      }
    })
  }
}
