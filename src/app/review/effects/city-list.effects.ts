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
import { CityService } from '../services/city.service';

@Injectable()
export class CityListEffects {
  constructor(private cityService: CityService, private actions$: Actions) {}

  citiesRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryListActions.selectCountry),
      switchMap((action) => [
        CityApiActions.citiesRequestedByCountryId({ countryId: action.id }),
        StatsApiActions.statsRequested()
      ])
    )
  );

  citiesCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityApiActions.citiesRequestedByCountryId),
      switchMap((action) =>
        this.cityService.getCitiesByCountry(action.countryId).pipe(
          map((cities) => CityApiActions.citiesSuccess({ cities })),
          catchError((error) => of(CityApiActions.citiesFailure({ error })))
        )
      )
    )
  );

  defaultCitySelected$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityApiActions.citiesSuccess),
      map((action) => CityListActions.selectCity({ id: action.cities[0].id }))
    )
  );

  allSelectionsCleared$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityListActions.selectCity),
      switchMap(() => [
        MessageApiActions.messageDetailsRequest({
          clearDetails: true,
        }),
        MessageListActions.clearMessageSelection(),
        MissionApiActions.missionDetailsRequested({
          clearDetails: true,
        }),
        MissionListActions.clearMissionSelection(),
      ])
    )
  );
}
