import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as fromCountry from './country.reducer';
import * as fromCity from './city.reducer';
import * as fromMessage from './message.reducer';
import * as fromMission from './mission.reducer';
import { Message } from '../models/message';
export const reviewFeatureKey = 'review';

export interface ReviewState {
  [fromCountry.countriesFeatureKey]: fromCountry.State;
  [fromCity.citiesFeatureKey]: fromCity.State;
  [fromMessage.messagesFeatureKey]: fromMessage.State;
  [fromMission.missionsFeatureKey]: fromMission.State;
}

export interface State extends fromRoot.State {
  [reviewFeatureKey]: ReviewState;
}

/** Provide reducer in AoT-compilation happy way */
export function reducers(state: ReviewState | undefined, action: Action) {
  return combineReducers({
    [fromCountry.countriesFeatureKey]: fromCountry.reducer,
    [fromCity.citiesFeatureKey]: fromCity.reducer,
    [fromMessage.messagesFeatureKey]: fromMessage.reducer,
    [fromMission.missionsFeatureKey]: fromMission.reducer,
  })(state, action);
}

export const selectReviewState =
  createFeatureSelector<ReviewState>(reviewFeatureKey);

export const selectCountryEntitiesState = createSelector(
  selectReviewState,
  (state) => state.countries
);

export const selectCityEntitiesState = createSelector(
  selectReviewState,
  (state) => state.cities
);
export const selectMessageEntitiesState = createSelector(
  selectReviewState,
  (state) => state.messages
);
export const selectMissionEntitiesState = createSelector(
  selectReviewState,
  (state) => state.missions
);
export const selectSelectedCountryId = createSelector(
  selectCountryEntitiesState,
  fromCountry.selectId
);
export const selectCountryLoading = createSelector(
  selectCountryEntitiesState,
  fromCountry.getLoading
);

export const selectCityLoading = createSelector(
  selectCityEntitiesState,
  fromCity.getLoading
);

export const selectSelectedCityId = createSelector(
  selectCityEntitiesState,
  fromCity.selectId
);

export const {
  selectIds: selectCountryIds,
  selectEntities: selectCountryEntities,
  selectAll: selectAllCountries,
} = fromCountry.adapter.getSelectors(selectCountryEntitiesState);

export const {
  selectIds: selectCityIds,
  selectEntities: selectCityEntities,
  selectAll: selectAllCities,
} = fromCity.adapter.getSelectors(selectCityEntitiesState);

export const {
  selectIds: selectMessageIds,
  selectEntities: selectMessageEntities,
  selectAll: selectAllMessages,
} = fromMessage.adapter.getSelectors(selectMessageEntitiesState);

export const {
  selectIds: selectMissionIds,
  selectEntities: selectMissionEntities,
  selectAll: selectAllMissions,
} = fromMission.adapter.getSelectors(selectMissionEntitiesState);

export const selectMessageLoading = createSelector(
  selectMessageEntitiesState,
  fromMessage.getLoading
);

export const selectMessageDetailsLoading = createSelector(
  selectMessageEntitiesState,
  fromMessage.getMessageDetailsLoading
);

export const selectMessageDetails = createSelector(
  selectMessageEntitiesState,
  fromMessage.getMessageDetails
);

export const selectSelectedMessageIds = createSelector(
  selectMessageEntitiesState,
  fromMessage.selectedIds
);

export const selectAllMessagesWithSelectionInfo = createSelector(
  selectAllMessages,
  selectSelectedMessageIds,
  (messages, selectedIds) => {
    return messages.map((x) => ({
      ...x,
      selected: selectedIds.some((ids) => ids === x.id),
    }));
  }
);

export const selectSelectedMessages = createSelector(
  selectMessageEntities,
  selectSelectedMessageIds,
  (messages, selectedIds) => selectedIds.map((id) => <Message>messages[id])
);

export const selectMissionLoading = createSelector(
  selectMissionEntitiesState,
  fromMission.getLoading
);

export const selectMissionDetailsLoading = createSelector(
  selectMissionEntitiesState,
  fromMission.getMissionDetailsLoading
);

export const selectMissionDetails = createSelector(
  selectMissionEntitiesState,
  fromMission.getMissionDetails
);

export const selectSelectedMissionId = createSelector(
  selectMissionEntitiesState,
  fromMission.selectedId
);
