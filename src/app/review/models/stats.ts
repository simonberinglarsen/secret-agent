export interface StatusStats {
  id : number,
  newCount: number,
  acceptedCount: number,
  rejectedCount: number,
}

export interface Stats {
  countryStats: StatusStats[];
  cityStats: StatusStats[];
}
