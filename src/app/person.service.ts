import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class PersonService {
  // backend URL (adjust if backend runs on a different host/port)
  base = 'http://localhost:5000/person';
  constructor(private http: HttpClient) {}

  private handleError(err: HttpErrorResponse) {
    let msg = 'Unknown error';
    if (err.error) {
      if (typeof err.error === 'string') msg = err.error;
      else if (err.error.error) msg = err.error.error;
      else if (err.message) msg = err.message;
    } else if (err.message) msg = err.message;
    return throwError(() => ({ status: err.status, message: msg, original: err }));
  }

  getPeople(): Observable<any> {
    return this.http.get(this.base).pipe(catchError(err => this.handleError(err)));
  }

  getPersonById(id: string): Observable<any> {
    return this.http.get(`${this.base}/${id}`).pipe(catchError(err => this.handleError(err)));
  }

  createPerson(person: any): Observable<any> {
    return this.http.post(this.base, person).pipe(catchError(err => this.handleError(err)));
  }

  updatePerson(id: string, body: any): Observable<any> {
    return this.http.put(`${this.base}/${id}`, body).pipe(catchError(err => this.handleError(err)));
  }

  deletePerson(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`).pipe(catchError(err => this.handleError(err)));
  }
}
