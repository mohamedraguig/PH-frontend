import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {map, Observable, startWith, Subscription} from 'rxjs';
import {Employee} from '../models/employee.model';
import {DatePipe} from '@angular/common';
import {EmployeeService} from '../services/employee.service';
import * as i18nIsoCountries from 'i18n-iso-countries';
import {NotificationsComponent} from '../notifications/notifications.component';
import {CompanyService} from '../services/company.service';
import {Company} from '../models/company.model';

@Component({
  selector: 'app-emp-form',
  templateUrl: './emp-form.component.html',
  styleUrls: ['./emp-form.component.scss', '../layouts/admin-layout/admin-layout.component.scss']
})
export class EmpFormComponent implements OnInit, OnDestroy {
  empForm: FormGroup;
  partialTime = false;
  weekDays = [
    {name: 'Lundi'},
    {name: 'Mardi'},
    {name: 'Mercredi'},
    {name: 'Jeudi'},
    {name: 'Vendredi'},
    {name: 'Samedi'},
    {name: 'Dimanche'}
  ];
  countries = [] as Array<string>;
  filteredCountries: Observable<string[]>;
  employee: Employee;
  piecesJointes = [];
  empToEdit: Employee;
  subscription: Subscription;
  editMode = false;
  companies = Company[0];

  constructor(public fb: FormBuilder,
              private datePipe: DatePipe,
              public empService: EmployeeService,
              private notification: NotificationsComponent,
              private companyService: CompanyService) {}

  ngOnInit(): void {
    // set countries list
    i18nIsoCountries.registerLocale(require("i18n-iso-countries/langs/fr.json"));
    let indexedArray = i18nIsoCountries.getNames('fr');

    for (let key in indexedArray) {
      let value = indexedArray[key];
      this.countries.push(value);
    }

    // get employee to edit
    this.subscription = this.empService.employeeToEdit.subscribe(emp => {
      if (emp) {
        this.editMode = true;
        this.empToEdit = emp
        this.partialTime = this.empToEdit.tempsPartiel;
        this.empService.getEmployeePjs(emp.id).subscribe(pjs => {
          this.piecesJointes = pjs;
        })
      }
    });

    // set employee form
    this.empForm = this.fb.group({
      nom: new FormControl(this.empToEdit ? this.empToEdit.nom : '', Validators.required),
      prenom: new FormControl(this.empToEdit ? this.empToEdit.prenom : '', Validators.required),
      adresse: new FormControl(this.empToEdit ? this.empToEdit.adresse : ''),
      email: new FormControl(this.empToEdit ? this.empToEdit.email : '', [Validators.required, Validators.email]),
      dateNaissance: new FormControl(this.empToEdit ? this.empToEdit.dateNaissance : ''),
      telephone: new FormControl(this.empToEdit ? this.empToEdit.telephone : '', Validators.required),
      numSecuriteSociale: new FormControl(this.empToEdit ? this.empToEdit.numSecuriteSociale : '', [
          Validators.required, Validators.pattern('^(\\d{15})?$')]),
      nationalite: new FormControl(this.empToEdit ? this.empToEdit.nationalite : '', Validators.required),
      dateEmbauche: new FormControl(this.empToEdit ? this.empToEdit.dateEmbauche : '', Validators.required),
      poste: new FormControl(this.empToEdit ? this.empToEdit.poste : '', Validators.required),
      tauxHoraire: new FormControl(this.empToEdit ? this.empToEdit.tauxHoraire : '', Validators.required),
      nbrHeures: new FormControl(this.empToEdit ? this.empToEdit.nbrHeures : '', Validators.required),
      mutuelle: new FormControl(this.empToEdit ? this.empToEdit.mutuelle : '', Validators.required),
      tempsPartiel: new FormControl(this.empToEdit ? this.empToEdit.tempsPartiel : false),
      jrsSemaine: new FormControl(this.empToEdit ? this.empToEdit.jrsSemaine : []),
      pieceJointe: new FormControl([]),
      commentaire: new FormControl(this.empToEdit ? this.empToEdit.commentaire : ''),
      company: new FormControl(this.empToEdit ? this.empToEdit.company : null)
    });

    // Nationality autocomplete value change event
    this.filteredCountries = this.empForm.controls['nationalite'].valueChanges
        .pipe(
            startWith(''),
            map(value => this.filter(value))
        );

    // Autofill companies select
    this.companyService.getAllCompanies().subscribe(companies => this.companies = companies);
  }

  ngOnDestroy(): void {
    this.clearForm();
    this.subscription.unsubscribe();
  }

  updatePartialTime() {
    this.partialTime = !this.partialTime;
  }

  submitForm() {
    this.employee = this.empService.updateFromPartial(this.employee, this.empForm.value);
    this.employee.actif = true;
    if (!this.editMode) {
      this.empService.saveNewEmp(this.employee, this.piecesJointes).subscribe(() => {
        this.notification.showNotification('success', 'Collaborateur ajouté avec succès');
        // empty form and array of files
        this.clearForm();
      });
    } else {
      // set emp id before updating
      this.employee.id = this.empToEdit.id;
      console.log('piece jointe ', this.piecesJointes);
      this.empService.editEmp(this.employee, this.piecesJointes).subscribe(() => {
        this.notification.showNotification('success', 'Collaborateur modifié avec succès');
        // empty form and array of files
        this.clearForm();
      })
    }
  }

  private filter(value: string): string[] {
    let filteredValue: string;
    if (value) {
      filteredValue = value.toLowerCase();
    } else {
      filteredValue = "";
    }
    return this.countries.filter(option => option.toLowerCase().startsWith(filteredValue));
  }

  onFileChange(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.piecesJointes.push(event.target.files[i]);
    }
  }

  compareCompanyObjects(company1: Company, company2: Company) {
    return company1 && company2 && company1.id == company2.id;
  }

  enleverPJ(pj: any) {
    this.piecesJointes = this.piecesJointes.filter(pieceJointe => pieceJointe !== pj);
  }

  clearForm() {
    this.piecesJointes = [];
    this.partialTime = false;
    this.empForm.reset();
  }
}
