import { evaluateBooking, Booking } from '../src';

const base = (overrides: Partial<Booking> = {}): Booking => ({
  id: overrides.id || 'c1',
  roomId: overrides.roomId || 'r1',
  title: overrides.title || 'candidate',
  start: overrides.start || '2025-01-01T10:00:00.000Z',
  end: overrides.end || '2025-01-01T11:00:00.000Z',
  priority: overrides.priority ?? 5
});

test('No overlap -> whole candidate accepted', () => {
  const existing: Booking[] = [{
    id: 'e1', roomId: 'r1', title: 'existing', start: '2025-01-01T12:00:00.000Z', end: '2025-01-01T13:00:00.000Z', priority: 1
  }];
  const res = evaluateBooking(existing, base());
  expect(res.conflicts).toHaveLength(0);
  expect(res.accepted).toHaveLength(1);
});

test('Partial overlap with lower priority -> split accepted', () => {
  const existing: Booking[] = [{
    id: 'e1', roomId: 'r1', title: 'existing', start: '2025-01-01T10:15:00.000Z', end: '2025-01-01T10:45:00.000Z', priority: 5
  }];
  const res = evaluateBooking(existing, base({ priority: 4 }));
  expect(res.conflicts).toHaveLength(1);
  expect(res.accepted.length).toBe(2);
});

test('Partial overlap with equal priority -> split accepted', () => {
  const existing: Booking[] = [{
    id: 'e1', roomId: 'r1', title: 'existing', start: '2025-01-01T10:15:00.000Z', end: '2025-01-01T10:45:00.000Z', priority: 5
  }];
  const res = evaluateBooking(existing, base({ priority: 5 }));
  expect(res.accepted.length).toBe(2);
});

test('Partial overlap with higher priority -> keep entire candidate', () => {
  const existing: Booking[] = [{
    id: 'e1', roomId: 'r1', title: 'existing', start: '2025-01-01T10:15:00.000Z', end: '2025-01-01T10:45:00.000Z', priority: 3
  }];
  const res = evaluateBooking(existing, base({ priority: 5 }));
  expect(res.accepted).toHaveLength(1);
});

test('Full overlap lower priority -> fully rejected', () => {
  const existing: Booking[] = [{
    id: 'e1', roomId: 'r1', title: 'existing', start: '2025-01-01T09:00:00.000Z', end: '2025-01-01T12:00:00.000Z', priority: 7
  }];
  const res = evaluateBooking(existing, base({ priority: 3 }));
  expect(res.accepted).toHaveLength(0);
});

test('Full overlap higher priority -> fully accepted', () => {
  const existing: Booking[] = [{
    id: 'e1', roomId: 'r1', title: 'existing', start: '2025-01-01T09:00:00.000Z', end: '2025-01-01T12:00:00.000Z', priority: 1
  }];
  const res = evaluateBooking(existing, base({ priority: 5 }));
  expect(res.accepted).toHaveLength(1);
});

test('Two overlaps with mixed priorities', () => {
  const existing: Booking[] = [
    { id: 'e1', roomId: 'r1', title: 'A', start: '2025-01-01T10:10:00.000Z', end: '2025-01-01T10:20:00.000Z', priority: 6 },
    { id: 'e2', roomId: 'r1', title: 'B', start: '2025-01-01T10:40:00.000Z', end: '2025-01-01T10:50:00.000Z', priority: 4 }
  ];
  const res = evaluateBooking(existing, base({ priority: 6 }));
  expect(res.conflicts).toHaveLength(2);
  expect(res.accepted.length).toBe(2);
});

test('Edge adjacency [a,b) vs [b,c) -> no overlap', () => {
  const existing: Booking[] = [{
    id: 'e1', roomId: 'r1', title: 'existing', start: '2025-01-01T09:00:00.000Z', end: '2025-01-01T10:00:00.000Z', priority: 5
  }];
  const res = evaluateBooking(existing, base({ start: '2025-01-01T10:00:00.000Z' }));
  expect(res.conflicts).toHaveLength(0);
  expect(res.accepted).toHaveLength(1);
});
