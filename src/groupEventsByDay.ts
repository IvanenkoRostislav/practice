
export interface Event {
  id: number;
  date: string;
}

export type EventsByDay = Record<string, Event[]>;

export function groupEventsByDay(
  events: Event[],
  timeZone: string = 'Europe/Kyiv',
): EventsByDay {
  const result: EventsByDay = {};

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  for (const event of events) {
    const date = new Date(event.date);

    if (Number.isNaN(date.getTime())) {
      throw new RangeError('Invalid event date');
    }

    const parts = formatter.formatToParts(date);

    const year = parts.find(part => part.type === 'year')!.value;
    const month = parts.find(part => part.type === 'month')!.value;
    const day = parts.find(part => part.type === 'day')!.value;

    const key = `${year}-${month}-${day}`;

    if (!result[key]) {
      result[key] = [];
    }

    result[key].push(event);
  }

  return result;
}
