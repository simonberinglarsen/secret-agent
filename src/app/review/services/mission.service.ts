import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Mission, MissionDetails } from '../models/mission';

@Injectable({
  providedIn: 'root',
})
export class MissionService {
  constructor(private http: HttpClient) {}

  getMissions(cityId: number) {
    return this.http.get<Mission[]>(`/missions?cityId=${cityId}`);
  }

  getMissionDetails(missionId: number): Observable<MissionDetails> {
    return this.http.get<MissionDetails>(
      `/missions/details?missionId=${missionId}`
    );
  }
}
