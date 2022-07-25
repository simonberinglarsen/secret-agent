import { createAction, props } from '@ngrx/store';
import { Mission, MissionDetails } from '../models/mission';

export const missionsRequestedByCityId = createAction(
  '[mission-api] missions requested by city id',
  props<{ cityId: number }>()
);

export const missionsSuccess = createAction(
  '[mission-api] missions success',
  props<{ missions: Mission[] }>()
);

export const missionsFailure = createAction(
  '[mission-api] missions failure',
  props<{ error: any }>()
);

export const missionDetailsRequested = createAction(
  '[mission-api] mission details requested',
  props<{ id?: number; clearDetails: boolean }>()
);

export const missionDetailsSuccess = createAction(
  '[mission-api] mission details success',
  props<{ missionDetails: MissionDetails | null }>()
);

export const missionDetailsFailure = createAction(
  '[mission-api] mission details failure',
  props<{ error: any }>()
);
