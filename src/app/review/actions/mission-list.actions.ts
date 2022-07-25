import { createAction, props } from '@ngrx/store';

export const toggleMission = createAction(
  '[mission-list] toggle mission',
  props<{ id: number }>()
);

export const clearMissionSelection = createAction(
  '[mission-list] clear mission selection'
);
