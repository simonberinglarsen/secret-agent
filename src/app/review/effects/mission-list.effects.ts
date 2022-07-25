import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  CityApiActions,
  CityListActions,
  MissionListActions,
  MissionApiActions,
  ReviewPageActions,
} from '../actions';
import { EMPTY, of } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  withLatestFrom,
  filter,
} from 'rxjs/operators';
import { Country } from '../models/country';
import { CityService } from '../services/city.service';
import { MissionService } from '../services/mission.service';
import { Store } from '@ngrx/store';
import * as fromReview from '../reducers';

@Injectable()
export class MissionListEffects {
  constructor(
    private missionService: MissionService,
    private actions$: Actions,
    private store: Store
  ) {}

  missionsRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityListActions.selectCity),
      switchMap((action) => [
        MissionApiActions.missionsRequestedByCityId({ cityId: action.id }),
      ])
    )
  );

  missionsCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MissionApiActions.missionsRequestedByCityId),
      switchMap((action) =>
        this.missionService.getMissions(action.cityId).pipe(
          map((missions) => MissionApiActions.missionsSuccess({ missions })),
          catchError((error) =>
            of(MissionApiActions.missionsFailure({ error }))
          )
        )
      )
    )
  );

  afterToggleMissionMissionsDetailsUpdated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MissionListActions.toggleMission),
      withLatestFrom(this.store.select(fromReview.selectSelectedMissionId)),
      map(([action, id]) =>
        id !== null
          ? MissionApiActions.missionDetailsRequested({
              id,
              clearDetails: false,
            })
          : MissionApiActions.missionDetailsRequested({ clearDetails: true })
      )
    )
  );

  missionDetailsCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MissionApiActions.missionDetailsRequested),
      switchMap((action) => {
        const clearDetails = () => [
          MissionApiActions.missionDetailsSuccess({
            missionDetails: null,
          }),
        ];
        const requestNewDetails = () =>
          this.missionService.getMissionDetails(<number>action.id).pipe(
            map((missionDetails) =>
              MissionApiActions.missionDetailsSuccess({
                missionDetails: missionDetails,
              })
            ),
            catchError((error) =>
              of(MissionApiActions.missionDetailsFailure({ error }))
            )
          );
        return action.clearDetails ? clearDetails() : requestNewDetails();
      })
    )
  );
}
