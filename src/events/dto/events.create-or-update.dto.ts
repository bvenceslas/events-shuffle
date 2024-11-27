import { TypeVote } from '../models/events.model';

export class EventsDto {
  id?: string;
  name: string;
  dates: Date[];
  votes?: TypeVote[];
}
