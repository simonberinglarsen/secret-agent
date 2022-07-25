import { createAction, props } from '@ngrx/store';

export const selectCity = createAction(
  '[city-list] select city',
  props<{ id: number }>()
);
