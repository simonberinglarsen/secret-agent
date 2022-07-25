import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MissionApiActions, MissionListActions } from '../actions';
import { Mission, MissionDetails } from '../models/mission';

export const missionsFeatureKey = 'missions';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Mission> {
  selectedMissionId: number | null;
  missionDetails: MissionDetails | null;
  missionDetailsLoading: boolean;
  loading: boolean;
}

/**
 * createEntityAdapter creates an object of many helper
 * functions for single or multiple operations
 * against the dictionary of records. The configuration
 * object takes a record id selector function and
 * a sortComparer option which is set to a compare
 * function if the records are to be sorted.
 */
export const adapter: EntityAdapter<Mission> = createEntityAdapter<Mission>({
  selectId: (mission: Mission) => mission.id,
  sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  selectedMissionId: null,
  loading: false,
  missionDetails: null,
  missionDetailsLoading: false,
});

export const reducer = createReducer(
  initialState,
  /**
   * The addMany function provided by the created adapter
   * adds many records to the entity dictionary
   * and returns a new state including those records. If
   * the collection is to be sorted, the adapter will
   * sort each record upon entry into the sorted array.
   */
  on(MissionApiActions.missionsSuccess, (state, { missions }) =>
    adapter.setAll(missions, { ...state, loading: false })
  ),
  on(MissionApiActions.missionsRequestedByCityId, (state) => ({
    ...state,
    loading: true,
  })),
  on(MissionListActions.toggleMission, (state, { id }) => ({
    ...state,
    missionDetailsLoading: true,
    selectedMissionId: state.selectedMissionId === id ? null : id,
  })),
  on(MissionApiActions.missionDetailsSuccess, (state, { missionDetails }) => ({
    ...state,
    missionDetails: missionDetails === null ? null : { ...missionDetails },
    missionDetailsLoading: false,
  })),
  on(MissionListActions.clearMissionSelection, (state) => ({
    ...state,
    selectedMissionIds: null,
    missionDetails: null,
    missionDetailsLoading: false,
  }))
);

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const selectedId = (state: State) => state.selectedMissionId;
export const getLoading = (state: State) => state.loading;
export const getMissionDetailsLoading = (state: State) =>
  state.missionDetailsLoading;
export const getMissionDetails = (state: State) => state.missionDetails;
