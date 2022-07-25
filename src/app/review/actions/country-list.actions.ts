import { createAction, props } from '@ngrx/store';

export const enter = createAction('[country-list] enter');
export const selectCountry = createAction(
  '[country-list] select country',
  props<{ id: number }>()
);
