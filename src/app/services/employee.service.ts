import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Employee} from '../models/employee.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {Company} from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  employeeApiUrl = '/api/employees';
  pjApiUrl = '/api/pieces-jointes';
  private employeeSource = new BehaviorSubject<Employee>(null);
  employeeToEdit = this.employeeSource.asObservable();

  constructor(private http: HttpClient) { }

  public saveNewEmp(employee: Employee, piecesJointes: File[]): Observable<any> {
    return this.http.post<any>(`${this.employeeApiUrl}/save`, this.setFormDataRequest(employee, piecesJointes));
  }

  public editEmp(employee: Employee, piecesJointes: File[]): Observable<any> {
    return this.http.put<any>(`${this.employeeApiUrl}/edit`, this.setFormDataRequest(employee, piecesJointes));
  }

  public getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.employeeApiUrl}`);
  }

  public deleteEmployee(employee: Employee): Observable<any> {
    return this.http.delete<any>(`${this.employeeApiUrl}/delete`, { body: employee });
  }

  //TODO implement company
  public deactivateEmployee(employee: Employee, piecesJointes: File[]): Observable<any> {
    return this.http.post<any>(`${this.employeeApiUrl}/deactivate`, this.setFormDataRequest(employee, piecesJointes));
  }

  private setFormDataRequest(employee: Employee, piecesJointes: File[]) {
    let formData: FormData = new FormData();
    const employeeJson = JSON.stringify(employee);
    const employeeBlob = new Blob([employeeJson], {
      type: 'application/json'
    });
    formData.append('employee', employeeBlob);
    for (const file of piecesJointes) {
      formData.append('pieceJointe', file, file.name);
    }
    return formData;
  }

  public updateFromPartial<T>(obj: T, updates: Partial<T>):T {
    return {...obj, ...updates};
  }

  public changeEmployeeToEdit(employee: Employee) {
    this.employeeSource.next(employee);
  }

  public getEmployeePjs(id: number): Observable<any> {
    return this.http.get(`${this.employeeApiUrl}/${id}/pieces-jointes`);
  }

  public downloadPj(id: number): Observable<any> {
    return this.http.get(`${this.pjApiUrl}/${id}`, { responseType: 'blob'});
  }
}
