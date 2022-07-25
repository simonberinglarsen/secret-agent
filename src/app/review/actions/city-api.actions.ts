import { createAction, props } from '@ngrx/store';
import { City } from '../models/city';

export const citiesSuccess = createAction(
  '[city-api] cities success',
  props<{ cities: City[] }>()
);

export const citiesFailure = createAction(
  '[city-api] cities failure',
  props<{ error: any }>()
);

export const citiesRequestedByCountryId = createAction(
  '[city-api] cities requested by country id',
  props<{ countryId: number }>()
);
