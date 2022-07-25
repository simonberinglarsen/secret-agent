import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Message, MessageDetails, MessageStatus } from '../models/message';

export const messagesRequestByCityId = createAction(
  '[message-api] messages request by city id',
  props<{ cityId: number }>()
);

export const messagesSuccess = createAction(
  '[message-api] messages success',
  props<{ messages: Message[] }>()
);

export const messagesFailure = createAction(
  '[message-api] messages failure',
  props<{ error: any }>()
);

export const messageDetailsRequest = createAction(
  '[message-api] message details request',
  props<{ id?: number; clearDetails: boolean }>()
);

export const messageDetailsSuccess = createAction(
  '[message-api] message details success',
  props<{ messageDetails: MessageDetails | null }>()
);

export const messageDetailsFailure = createAction(
  '[message-api] message details failure',
  props<{ error: any }>()
);

export const messagesStatusUpdateRequest = createAction(
  '[message-api] messages status update request',
  props<{ ids: number[]; status: MessageStatus }>()
);

export const messagesStatusUpdateSuccess = createAction(
  '[message-api] messages status update success',
  props<{ messages: Update<Message>[] }>()
);

export const messagesStatusUpdateFailure = createAction(
  '[message-api] message status details failure',
  props<{ error: any }>()
);
