import { describe, expect, it } from 'vitest';
import { groupEventsByDay, type Event } from '../src/groupEventsByDay';

describe('groupEventsByDay', () => {
  it('повертає порожній об’єкт для порожнього масиву', () => {
    expect(groupEventsByDay([])).toEqual({});
  });

  it('групує одну подію', () => {
    const event: Event = { id: 1, date: '2026-01-15T10:00:00Z' };

    expect(groupEventsByDay([event])).toEqual({
      '2026-01-15': [event],
    });
  });

  it('об’єднує декілька подій за один день', () => {
    const events: Event[] = [
      { id: 1, date: '2026-01-15T08:00:00Z' },
      { id: 2, date: '2026-01-15T16:00:00Z' },
    ];

    expect(groupEventsByDay(events)).toEqual({
      '2026-01-15': [events[0], events[1]],
    });
  });

  it('розподіляє події за різними днями', () => {
    const events: Event[] = [
      { id: 1, date: '2026-01-15T10:00:00Z' },
      { id: 2, date: '2026-01-16T10:00:00Z' },
    ];

    expect(groupEventsByDay(events)).toEqual({
      '2026-01-15': [events[0]],
      '2026-01-16': [events[1]],
    });
  });

  it('враховує Europe/Kyiv поблизу опівночі та переданий часовий пояс', () => {
    // У Києві взимку це вже 16 січня, 00:30 (UTC+02:00).
    const event: Event = { id: 1, date: '2026-01-15T22:30:00Z' };

    expect(groupEventsByDay([event])).toEqual({
      '2026-01-16': [event],
    });
    expect(groupEventsByDay([event], 'Europe/Kyiv')).toEqual({
      '2026-01-16': [event],
    });
    expect(groupEventsByDay([event], 'UTC')).toEqual({
      '2026-01-15': [event],
    });
  });

  it('викидає RangeError для некоректної дати', () => {
    const event: Event = { id: 1, date: 'not-a-date' };

    expect(() => groupEventsByDay([event])).toThrow(RangeError);
  });
});
