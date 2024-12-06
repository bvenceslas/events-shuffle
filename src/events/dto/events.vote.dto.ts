// import { IsArray, IsDate } from 'class-validator';

export class VoteEventDto {
  // @IsArray()
  // @IsDate({ each: true })
  votingDates: Date[];
}
