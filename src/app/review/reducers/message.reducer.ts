import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { MessageApiActions, MessageListActions } from '../actions';
import { Message, MessageDetails } from '../models/message';

export const messagesFeatureKey = 'messages';

/**
 * @ngrx/entity provides a predefined interface for handling
 * a structured dictionary of records. This interface
 * includes an array of ids, and a dictionary of the provided
 * model type by id. This interface is extended to include
 * any additional interface properties.
 */
export interface State extends EntityState<Message> {
  selectedMessageIds: number[];
  messageDetails: MessageDetails | null;
  messageDetailsLoading: boolean;
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
export const adapter: EntityAdapter<Message> = createEntityAdapter<Message>({
  selectId: (message: Message) => message.id,
  sortComparer: false,
});

/**
 * getInitialState returns the default initial state
 * for the generated entity state. Initial state
 * additional properties can also be defined.
 */
export const initialState: State = adapter.getInitialState({
  selectedMessageIds: [],
  loading: false,
  messageDetails: null,
  messageDetailsLoading: false,
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
  on(MessageApiActions.messagesSuccess, (state, { messages }) =>
    adapter.setAll(messages, { ...state, loading: false })
  ),
  on(MessageApiActions.messagesUpdateSuccess, (state, { messages }) =>
    adapter.updateMany(messages, { ...state, loading: false })
  ),
  on(MessageApiActions.messagesRequestByCityId, (state) => ({
    ...state,
    loading: true,
  })),
  on(MessageListActions.toggleMessage, (state, { id }) => {
    const exists = state.selectedMessageIds.some((x) => x === id);
    if (exists) {
      return {
        ...state,
        messageDetailsLoading: true,
        selectedMessageIds: state.selectedMessageIds.filter((x) => x !== id),
      };
    }
    return {
      ...state,
      messageDetailsLoading: true,
      selectedMessageIds: [...state.selectedMessageIds, id],
    };
  }),
  on(MessageApiActions.messageDetailsSuccess, (state, { messageDetails }) => ({
    ...state,
    messageDetails: messageDetails === null ? null : { ...messageDetails },
    messageDetailsLoading: false,
  })),
  on(MessageListActions.clearMessageSelection, (state) => ({
    ...state,
    selectedMessageIds: [],
    messageDetails: null,
    messageDetailsLoading: false,
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

export const selectedIds = (state: State) => state.selectedMessageIds;
export const getLoading = (state: State) => state.loading;
export const getMessageDetailsLoading = (state: State) =>
  state.messageDetailsLoading;
export const getMessageDetails = (state: State) => state.messageDetails;
