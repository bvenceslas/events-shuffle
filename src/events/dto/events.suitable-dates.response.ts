export class SuitableDatesResponse {
  id: any;
  name: string;
  suitableDates: Array<{
    date: Date;
    people: string[];
  }>;
}
