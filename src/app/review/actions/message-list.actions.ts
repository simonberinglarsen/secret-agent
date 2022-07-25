import { createAction, props } from '@ngrx/store';
import { MessageStatus } from '../models/message';

export const toggleMessage = createAction(
  '[message-list] toggle message',
  props<{ id: number }>()
);

export const clearMessageSelection = createAction(
  '[message-list] clear message selection'
);

export const setSelectedStatus = createAction(
  '[message-list] set selected status',
  props<{ updatedStatus: MessageStatus }>()
);
