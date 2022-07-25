import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  CityApiActions,
  CityListActions,
  MessageListActions,
  MessageApiActions,
  ReviewPageActions,
  MissionApiActions,
  MissionListActions,
} from '../actions';
import { combineLatest, EMPTY, of } from 'rxjs';
import {
  switchMap,
  map,
  catchError,
  withLatestFrom,
  filter,
} from 'rxjs/operators';
import { Country } from '../models/country';
import { CityService } from '../services/city.service';
import { MessageService } from '../services/message.service';
import { Store } from '@ngrx/store';
import * as fromReview from '../reducers';
import { MessageStatus } from '../models/message';
import { Update } from '@ngrx/entity';

@Injectable()
export class MessageListEffects {
  constructor(
    private messageService: MessageService,
    private actions$: Actions,
    private store: Store
  ) {}

  messagesRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CityListActions.selectCity),
      switchMap((action) => [
        MessageApiActions.messagesRequestByCityId({ cityId: action.id }),
      ])
    )
  );

  messagesCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageApiActions.messagesRequestByCityId),
      switchMap((action) =>
        this.messageService.getMessages(action.cityId).pipe(
          map((messages) => MessageApiActions.messagesSuccess({ messages })),
          catchError((error) =>
            of(MessageApiActions.messagesFailure({ error }))
          )
        )
      )
    )
  );

  afterToggleMessageMissionsDetailsUpdated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageListActions.toggleMessage),
      withLatestFrom(this.store.select(fromReview.selectSelectedMessageIds)),
      map(([action, ids]) =>
        ids.length === 1
          ? MessageApiActions.messageDetailsRequest({
              id: ids[0],
              clearDetails: false,
            })
          : MessageApiActions.messageDetailsRequest({
              clearDetails: true,
            })
      )
    )
  );

  statusUpdatesCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageListActions.setSelectedStatus),
      withLatestFrom(this.store.select(fromReview.selectSelectedMessages)),
      map(([action, messages]) =>
        MessageApiActions.messagesUpdateSuccess({
          messages: messages.map((m) => ({
            id: m.id,
            changes: { status: action.updatedStatus },
          })),
        })
      )
    )
  );

  messageDetailsCompleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MessageApiActions.messageDetailsRequest),
      switchMap((action) => {
        const onClearDetails = () => [
          MessageApiActions.messageDetailsSuccess({
            messageDetails: null,
          }),
        ];

        const onRequestNewDetails = () =>
          this.messageService.getMessageDetails(<number>action.id).pipe(
            map((messageDetails) =>
              MessageApiActions.messageDetailsSuccess({
                messageDetails: messageDetails,
              })
            ),
            catchError((error) =>
              of(MessageApiActions.messageDetailsFailure({ error }))
            )
          );

        return action.clearDetails ? onClearDetails() : onRequestNewDetails();
      })
    )
  );
}
