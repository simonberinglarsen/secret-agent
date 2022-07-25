import { createAction, props } from '@ngrx/store';
import { Stats } from '../models/stats';

export const statsRequested = createAction(
  '[stats-api] stats requested',
);

export const statsSuccess = createAction(
  '[stats-api] stats success',
  props<{ stats: Stats }>()
);

export const statsFailure = createAction(
  '[stats-api] stats failure',
  props<{ error: any }>()
);
