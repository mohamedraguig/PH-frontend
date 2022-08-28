import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Company} from '../models/company.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  companyApiUrl = '/api/companies';
  constructor(private http: HttpClient) { }

  public saveCompany(company: Company): Observable<any> {
    return this.http.post(`${this.companyApiUrl}/save`, company);
  }

  public getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.companyApiUrl}`);
  }

  public editCompany(company: Company): Observable<any> {
    return this.http.put(`${this.companyApiUrl}/edit`, company);
  }

  public deleteCompany(company: Company): Observable<any> {
    return this.http.delete(`${this.companyApiUrl}/delete`, { body: company });
  }
}
