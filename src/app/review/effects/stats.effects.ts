import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  CityApiActions,
  CityListActions,
  CountryApiActions,
  CountryListActions,
  MessageApiActions,
  MessageListActions,
  MissionApiActions,
  MissionListActions,
  ReviewPageActions,
  StatsApiActions,
} from '../actions';
import { EMPTY, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Country } from '../models/country';
import { StatsService } from '../services/stats.service';

@Injectable()
export class StatsListEffects {
  constructor(private statsService: StatsService, private actions$: Actions) {}

  statsCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatsApiActions.statsRequested),
      switchMap(() =>
        this.statsService.getStats().pipe(
          map((stats) => StatsApiActions.statsSuccess({ stats })),
          catchError((error) => of(StatsApiActions.statsFailure({ error })))
        )
      )
    )
  );

  statsRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageApiActions.messagesStatusUpdateSuccess),
      map(() => StatsApiActions.statsRequested())
    )
  );
}
