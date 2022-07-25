import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  filter,
  map,
  tap,
  Observable,
  withLatestFrom,
  UnaryFunction,
  OperatorFunction,
  pipe,
} from 'rxjs';
import { Message, MessageStatus } from '../../models/message';
import * as fromReview from '../../reducers';
import { MessageListActions } from '../../actions';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {
  loading$: Observable<boolean>;
  messages$: Observable<
    {
      selected: boolean;
      id: number;
      title: string;
      cityId: number;
      status: MessageStatus;
    }[]
  >;
  setAsNewDisabled$: Observable<boolean>;
  setAsRejectedDisabled$: Observable<boolean>;
  setAsAcceptedDisabled$: Observable<boolean>;
  MessageStatus = MessageStatus;

  constructor(private store: Store) {
    this.messages$ = store.select(
      fromReview.selectAllMessagesWithSelectionInfo
    );
    this.loading$ = store.select(fromReview.selectMessageLoading);
    this.setAsNewDisabled$ = this.allSelectedHasStatus(MessageStatus.New);
    this.setAsRejectedDisabled$ = this.allSelectedHasStatus(
      MessageStatus.Rejected
    );
    this.setAsAcceptedDisabled$ = this.allSelectedHasStatus(
      MessageStatus.Accepted
    );
  }

  allSelectedHasStatus(messageStatus: MessageStatus) {
    return this.store
      .select(fromReview.selectSelectedMessages)
      .pipe(
        map((messages: Message[]) =>
          messages && messages.length > 0
            ? !messages.find(({ status }) => status !== messageStatus)
            : true
        )
      );
  }

  ngOnInit(): void {}

  itemClicked(item: Message) {
    this.store.dispatch(MessageListActions.toggleMessage({ id: item.id }));
  }

  action(messageStatus: MessageStatus) {
    this.store.dispatch(
      MessageListActions.setSelectedStatus({
        updatedStatus: messageStatus,
      })
    );
  }
}
