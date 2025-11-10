export interface Booking {
  id: string;
  roomId: string;
  title: string;
  start: string; // ISO
  end: string;   // ISO (exclusive)
  priority: number; // higher = more important
}

export interface ConflictInfo {
  existingId: string;
  overlapStart: string;
  overlapEnd: string;
}

export interface BookingDecision {
  conflicts: ConflictInfo[];
  accepted: Booking[]; // final non-overlapping segments
}
