import { EventsDto } from '../events/dto/events.create-or-update.dto';

export const processEventData = (eventData: EventsDto): EventsDto => {
  const processedDates = eventData.dates.map((date) => new Date(date));
  return {
    ...eventData,
    dates: processedDates,
  };
};
