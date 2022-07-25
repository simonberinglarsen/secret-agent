import { createReducer, on } from '@ngrx/store';
import { StatsApiActions } from '../actions';
import { Stats } from '../models/stats';

export const statsFeatureKey = 'stats';

export interface State {
  stats: Stats | null;
  loading: boolean;
}

export const initialState: State = {
  stats: null,
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(StatsApiActions.statsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
  })),
  on(StatsApiActions.statsRequested, (state) => ({
    ...state,
    loading: true,
  }))
);

export const getStats = (state: State) => state.stats;
export const getLoading = (state: State) => state.loading;
