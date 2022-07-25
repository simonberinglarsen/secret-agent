import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CityApiActions, CityListActions } from '../actions';
import { City } from '../models/city';

export const citiesFeatureKey = 'cities';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<City> {
  selectedCityId: number | null;
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
export const adapter: EntityAdapter<City> = createEntityAdapter<City>({
  selectId: (city: City) => city.id,
  sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  selectedCityId: null,
  loading: false,
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
  on(CityApiActions.citiesSuccess, (state, { cities }) =>
    adapter.setAll(cities, { ...state, loading: false })
  ),
  on(CityApiActions.citiesRequestedByCountryId, (state) => ({
    ...state,
    loading: true,
  })),
  on(CityListActions.selectCity, (state, { id }) => ({
    ...state,
    selectedCityId: id,
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

export const selectId = (state: State) => state.selectedCityId;
export const getLoading = (state: State) => state.loading;
