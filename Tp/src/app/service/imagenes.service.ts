import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HeroImageResponse {
  id: string;
  name: string;
  image: string; // Base64
}

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  private baseUrl = 'http://localhost:3000/api'; // ⚠️ Cambiar al deploy de backend en producción

  constructor(private http: HttpClient) {}

  getRandomHero(): Observable<HeroImageResponse> {
    return this.http.get<HeroImageResponse>(`${this.baseUrl}/random`);
  }

  getMultipleRandomHeroes(count: number): Observable<HeroImageResponse[]> {
    const requests: Observable<HeroImageResponse>[] = [];
    for (let i = 0; i < count; i++) {
      requests.push(this.getRandomHero());
    }
    return new Observable<HeroImageResponse[]>(subscriber => {
      Promise.all(requests.map(r => r.toPromise()))
        .then(results => {
          subscriber.next(results as HeroImageResponse[]);
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }
}
