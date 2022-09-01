import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../services/company.service';
import {Company} from '../models/company.model';
import {EmployeeService} from '../services/employee.service';
import {NotificationsComponent} from '../notifications/notifications.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {DeleteConfirmDialogComponent} from '../delete-confirm-dialog/delete-confirm-dialog.component';
import {debounceTime, distinctUntilChanged, filter, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {

  companyForm: FormGroup;
  company: Company;
  displayedColumns: string[] = ['nom', 'numSIRET', 'adresse', 'actions'];
  dataSource = new MatTableDataSource<Company>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  editMode = false;
  companyToEditId : number;
  filteredAddresses: any;
  minLengthTerm = 3;

  constructor(private fb: FormBuilder,
              private companyService: CompanyService,
              private empService: EmployeeService,
              private notification: NotificationsComponent,
              public dialog: MatDialog,) { }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      nom: new FormControl('', Validators.required),
      numSiret: new FormControl('', Validators.required),
      adresse: new FormControl('', Validators.required)
    });
    this.getAllCompanies();
    // Address autocomplete value change event
    this.companyForm.controls['adresse'].valueChanges
        .pipe(
           filter( value => {
                 return value !== null && value.length >= this.minLengthTerm
              }),
           distinctUntilChanged(),
           debounceTime(1000),
           tap(() => {
                this.filteredAddresses = [];
           }),
           switchMap(value => this.empService.getAddress(value))
          )
          .subscribe((data: any) => {
              if (Object.keys(data.features).length > 0) {
                  this.filteredAddresses = data.features.map((feature) => {
                      return feature.properties.label;
                  })
              }
       });

  }

  saveCompany() {
    this.company = this.empService.updateFromPartial(this.company, this.companyForm.value);
    if (!this.editMode) {
      this.companyService.saveCompany(this.company)
          .subscribe(() => {
                this.notification.showNotification('success', 'Entreprise ajoutée avec succès');
                this.getAllCompanies();
                this.clearForm();
              },
              () => this.notification.showNotification('error', 'Erreur survenue lors de la sauvegarde'));
    } else {
      this.company.id = this.companyToEditId;
      this.companyService.editCompany(this.company)
          .subscribe(() => {
            this.notification.showNotification('success', 'Entreprise modifiée avec succès');
            this.getAllCompanies();
            this.clearForm();
            this.editMode = false;
          }, () => this.notification.showNotification('error', 'Erreur survenue lors de la modification'));
    }
  }

  getAllCompanies() {
    this.companyService.getAllCompanies().subscribe(companies => {
      if (companies != null) {
       this.dataSource.data = companies;
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
      }
    });
  }

  editCompany(company: Company) {
    this.editMode = true;
    this.companyToEditId = company.id;
    this.companyForm.patchValue({
      nom: company.nom,
      numSiret: company.numSiret,
      adresse: company.adresse
    });
    this.companyForm.markAsDirty();
  }

  deleteCompany(company: Company) {
      const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
          data: {
              text: 'Vous êtes sur le point de supprimer définitivement ' +
                  'l\'entreprise ' + company.nom + ', '+
                  'êtes-vous sur ?'
          }
      });
      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              if (result.data.confirm) {
                  this.companyService.deleteCompany(company).subscribe(
                      () => {
                          this.notification.showNotification('success', 'Entreprise supprimée avec succès');
                          this.getAllCompanies();
                      },
                      () => this.notification.showNotification('error', 'Erreur survenue lors de la suppression')
                  );
              }
          }
      });
  }

  clearForm() {
      this.companyForm.reset();
  }


  search(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
      }
  }

}
