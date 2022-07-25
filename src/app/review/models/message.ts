export enum MessageStatus {
  New = 'New',
  Accepted = 'Accepted',
  Rejected = 'Rejected'
}

export interface Message {
  id: number;
  title: string;
  cityId: number;
  status: MessageStatus;
}

export interface MessageDetails {
  id: number;
  messageId: number;
  code: string;
  delivered: string;
  reliability: number;
}
