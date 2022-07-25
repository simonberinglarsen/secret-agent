import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/city';



@Injectable({
  providedIn: 'root'
})
export class CityService {

  constructor(private http: HttpClient) {}
  
  getCitiesByCountry(countryId: number): Observable<City[]> {
    return this.http.get<City[]>(`/cities?countryId=${countryId}`);
  }

  getCityIds() : Observable<number[]> {
    return this.http.get<number[]>(`/cities/ids`);
  }

}
