import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { CountryApiActions, CountryListActions } from '../actions';
import { Country } from '../models/country';

export const countriesFeatureKey = 'countries';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Country> {
  selectedCountryId: number | null;
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
export const adapter: EntityAdapter<Country> = createEntityAdapter<Country>({
  selectId: (country: Country) => country.id,
  sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  selectedCountryId: null,
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
  on(CountryApiActions.countriesSuccess, (state, { countries }) =>
    adapter.addMany(countries, { ...state, loading: false })
  ),
  on(CountryListActions.enter, (state) => ({
    ...state,
    loading: true,
  })),
  on(CountryListActions.selectCountry, (state, { id }) => ({
    ...state,
    selectedCountryId: id,
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

export const selectId = (state: State) => state.selectedCountryId;
export const getLoading = (state: State) => state.loading;
