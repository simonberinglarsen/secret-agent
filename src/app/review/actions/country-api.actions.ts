import { createAction, props } from '@ngrx/store';
import { Country } from '../models/country';

export const countriesSuccess = createAction(
  '[country-api] countries success',
  props<{ countries: Country[] }>()
);

export const countriesFailure = createAction(
  '[country-api] countries failure',
  props<{ error: any }>()
);
