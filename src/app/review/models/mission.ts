export enum MissionStatus {
  Active = 'Active',
  Aborted = 'Aborted',
  Completed = 'Completed',
}

export interface Mission {
  id: number;
  cityId: number;
  title: string;
  status?: MissionStatus;
}

export interface MissionDetails {
  id: number;
  missionId: number;
  agent: string;
  dangerRate: number;
  potential: number;
  expectedCompletionDate: string;
}
