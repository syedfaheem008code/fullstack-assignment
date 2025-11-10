import { Booking, BookingDecision, ConflictInfo } from './types';

function maxISO(a: string, b: string) { return a > b ? a : b; }
function minISO(a: string, b: string) { return a < b ? a : b; }

export function evaluateBooking(existing: Booking[], candidate: Booking): BookingDecision {
  const sameRoom = existing
    .filter(e => e.roomId === candidate.roomId)
    .slice()
    .sort((a, b) => a.start.localeCompare(b.start) || a.id.localeCompare(b.id));

  const conflicts: ConflictInfo[] = [];
  let segments: Array<{ start: string; end: string }> = [{ start: candidate.start, end: candidate.end }];

  const overlap = (aS: string, aE: string, bS: string, bE: string) => aS < bE && aE > bS;

  for (const e of sameRoom) {
    const next: Array<{ start: string; end: string }> = [];
    for (const seg of segments) {
      if (!overlap(seg.start, seg.end, e.start, e.end)) { next.push(seg); continue; }
      const overlapStart = maxISO(seg.start, e.start);
      const overlapEnd = minISO(seg.end, e.end);
      conflicts.push({ existingId: e.id, overlapStart, overlapEnd });

      if (candidate.priority > e.priority) {
        next.push(seg);
      } else {
        if (seg.start < overlapStart) next.push({ start: seg.start, end: overlapStart });
        if (overlapEnd < seg.end) next.push({ start: overlapEnd, end: seg.end });
      }
    }
    segments = normalize(next);
  }

  const accepted = segments
    .filter(s => s.start < s.end)
    .map((s, i) => ({ ...candidate, id: `${candidate.id}#${i+1}`, start: s.start, end: s.end }));

  return { conflicts, accepted };
}

function normalize(segs: Array<{ start: string; end: string }>) {
  const arr = segs.filter(s => s.start < s.end)
    .sort((a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end));
  const out: typeof arr = [];
  for (const s of arr) {
    if (!out.length) { out.push({ ...s }); continue; }
    const last = out[out.length - 1];
    if (s.start <= last.end) {
      if (s.end > last.end) last.end = s.end;
    } else {
      out.push({ ...s });
    }
  }
  return out;
}
