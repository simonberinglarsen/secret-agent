import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { MissionDetails } from '../../models/mission';
import * as fromReview from '../../reducers';

@Component({
  selector: 'app-mission-details',
  templateUrl: './mission-details.component.html',
  styleUrls: ['./mission-details.component.scss'],
})
export class MissionDetailsComponent implements OnInit {
  missionDetails$: Observable<MissionDetails | null>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.missionDetails$ = store.select(fromReview.selectMissionDetails);
    this.loading$ = store.select(fromReview.selectMissionDetailsLoading);
  }

  ngOnInit(): void {}
}
