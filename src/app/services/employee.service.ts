import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Employee} from '../models/employee.model';
import {BehaviorSubject, Observable, of, tap} from 'rxjs';
import {environment} from '../../environments/environment';
import {PieceJointe} from '../models/piece-jointe.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  baseUrl = environment.baseUrl;
  employeeApiUrl = 'api/employees';
  pjApiUrl = 'api/pieces-jointes';
  addressApiUrl = 'https://api-adresse.data.gouv.fr/search/';
  private employeeSource = new BehaviorSubject<Employee>(null);
  employeeToEdit = this.employeeSource.asObservable();
  addresses = [];

  constructor(private http: HttpClient) { }

  public saveNewEmp(employee: Employee, piecesJointes: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${this.employeeApiUrl}/save`, this.setFormDataRequest(employee, piecesJointes));
  }

  public editEmp(employee: Employee, piecesJointes: any[]): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${this.employeeApiUrl}/edit`, this.setFormDataRequest(employee, piecesJointes));
  }

  public getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/${this.employeeApiUrl}`);
  }

  public deleteEmployee(employee: Employee): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${this.employeeApiUrl}/delete`, { body: employee });
  }

  public deactivateEmployee(employee: Employee, piecesJointes: any[]): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${this.employeeApiUrl}/deactivate`, this.setFormDataRequest(employee, piecesJointes));
  }

  private setFormDataRequest(employee: Employee, piecesJointes: any[]) {
    let formData: FormData = new FormData();
    const employeeJson = JSON.stringify(employee);
    const employeeBlob = new Blob([employeeJson], {
      type: 'application/json'
    });
    formData.append('employee', employeeBlob);
    for (const file of piecesJointes) {
      if (file instanceof File) {
        formData.append('pieceJointe', file, file.name);
      } else {
        // Jackson by default encode byte array to base64
        // first step is to decode the file content received from backend
        const decodedBase64 = Uint8Array.from(atob(file.content), c => c.charCodeAt(0))
        const blob = new Blob([decodedBase64], { type: file.type });
        const test = new File([blob], file.name, { type: file.type });
        formData.append('pieceJointe', test, test.name);
      }
    }
    return formData;
  }

  public updateFromPartial<T>(obj: T, updates: Partial<T>):T {
    return {...obj, ...updates};
  }

  public changeEmployeeToEdit(employee: Employee) {
    this.employeeSource.next(employee);
  }

  public getEmployeePjs(id: number): Observable<PieceJointe[]> {
    return this.http.get<PieceJointe[]>(`${this.baseUrl}/${this.employeeApiUrl}/${id}/pieces-jointes`);
  }

  public downloadPj(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${this.pjApiUrl}/${id}`, { responseType: 'blob'});
  }

  public getAddress(adresse: string): Observable<any> {
    let params = new HttpParams().set('q', adresse);
    return this.http.get<any>(`${this.addressApiUrl}`, { params: params })
  }
}
