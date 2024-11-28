import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';
import { TypeVote } from '../models/events.model';
import { Type } from 'class-transformer';

export class EventsDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsDate({ each: true })
  @IsArray()
  @Type(() => Date)
  dates: Date[];

  @IsOptional()
  votes?: TypeVote[];
}
