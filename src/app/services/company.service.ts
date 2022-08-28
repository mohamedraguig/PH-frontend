import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Company} from '../models/company.model';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  baseUrl = environment.baseUrl;
  companyApiUrl = '/api/companies';
  constructor(private http: HttpClient) { }

  public saveCompany(company: Company): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.companyApiUrl}/save`, company);
  }

  public getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/${this.companyApiUrl}`);
  }

  public editCompany(company: Company): Observable<any> {
    return this.http.put(`${this.baseUrl}/${this.companyApiUrl}/edit`, company);
  }

  public deleteCompany(company: Company): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${this.companyApiUrl}/delete`, { body: company });
  }
}
