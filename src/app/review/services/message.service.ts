import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message, MessageDetails, MessageStatus } from '../models/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private http: HttpClient) {}

  getMessages(cityId: number) {
    return this.http.get<Message[]>(`/messages?cityId=${cityId}`);
  }
  getMessageDetails(messageId: number): Observable<MessageDetails> {
    return this.http.get<MessageDetails>(
      `/messages/details?messageId=${messageId}`
    );
  }

  updateStatusByIds(ids: number[], status: MessageStatus): Observable<Message[]> {
    return this.http.post<Message[]>(`/messages/status`, {ids, status});
  }
}
