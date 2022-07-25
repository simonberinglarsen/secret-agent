import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { MessageDetails } from '../../models/message';
import * as fromReview from '../../reducers'

@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.scss'],
})
export class MessageDetailsComponent implements OnInit {
  messageDetails$: Observable<MessageDetails |null>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.messageDetails$ = store.select(fromReview.selectMessageDetails)
    this.loading$ = store.select(fromReview.selectMessageDetailsLoading)
  }

  ngOnInit(): void {}
}
