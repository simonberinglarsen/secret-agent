import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mission } from '../../models/mission';
import { MissionService } from '../../services/mission.service';
import * as fromReview from '../../reducers';
import { Store } from '@ngrx/store';
import { MissionListActions } from '../../actions';

@Component({
  selector: 'app-mission-list',
  templateUrl: './mission-list.component.html',
  styleUrls: ['./mission-list.component.scss'],
})
export class MissionListComponent implements OnInit {
  loading$: Observable<boolean>;
  missions$: Observable<Mission[]>;
  selectedMissionId$: Observable<number | null>;

  constructor(private store: Store) {
    this.missions$ = store.select(fromReview.selectAllMissions);
    this.loading$ = store.select(fromReview.selectMissionLoading);
    this.selectedMissionId$ = store.select(fromReview.selectSelectedMissionId);
  }

  ngOnInit(): void {}

  itemClicked(item: Mission) {
    this.store.dispatch(MissionListActions.toggleMission({ id: item.id }));
  }
}
