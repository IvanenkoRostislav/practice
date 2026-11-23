export interface Event {
  id: number;
  date: string;
}

export type EventsByDay = Record<string, Event[]>;

export function groupEventsByDay(
  events: Event[],
  timeZone: string = 'Europe/Kyiv',
): EventsByDay {
  return {};
}
