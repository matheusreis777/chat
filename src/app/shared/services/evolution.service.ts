import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EvolutionService {
  private urlCreateInstance =
    'https://evolution-n8n.luvtff.easypanel.host/webhook/13770b81-57fe-4ae6-ae80-f06730408ea7';

  constructor(private http: HttpClient) {}

  createInstance(instanceName: string): Observable<Blob> {
    const data = {
      instanceName: instanceName,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.urlCreateInstance, data, {
      headers: headers,
      responseType: 'blob',
    });
  }
}
