import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  CityListActions,
  CountryApiActions,
  CountryListActions,
  ReviewPageActions,
} from '../actions';
import { EMPTY, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { CountryService } from '../services/country.service';
import { Country } from '../models/country';

@Injectable()
export class CountryListEffects {
  constructor(
    private countryService: CountryService,
    private actions$: Actions
  ) {}

  loadCountries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryListActions.enter),
      switchMap(() =>
        this.countryService.getCountries().pipe(
          map((countries: Country[]) =>
            CountryApiActions.countriesSuccess({ countries })
          ),
          catchError((error) =>
            of(CountryApiActions.countriesFailure({ error }))
          )
        )
      )
    )
  );

  selectFirstCountry$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CountryApiActions.countriesSuccess),
      map((action) => {
        const id = action.countries[0].id;
        return CountryListActions.selectCountry({ id });
      })
    )
  );
}
