import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsDto } from './dto/events.create-or-update.dto';
import { VoteEventDto } from './dto/events.vote.dto';
import { Public } from 'src/utils/public.guard';

@Controller({
  path: 'event',
  version: 'v1',
})
export class EventsController {
  constructor(private readonly _eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() createEventDto: EventsDto) {
    return await this._eventsService.create(createEventDto);
  }

  @Public()
  @Get()
  async getAllEvents() {
    return await this._eventsService.findAll();
  }

  @Public()
  @Get(':id')
  async getEventById(@Param('id') eventId: string) {
    return await this._eventsService.findOneById(eventId);
  }

  @Public()
  @Get('/name/:name')
  async getEventByName(@Param('name') eventName: string) {
    return await this._eventsService.findOneByName(eventName);
  }

  @Get(':id/results')
  async getSuitableDates(@Param('id') eventId: string) {
    return await this._eventsService.findSuitableDates(eventId);
  }

  @Put(':id')
  async updateEvent(@Param('id') eventId: string, @Body() data: EventsDto) {
    return await this._eventsService.update(eventId, data);
  }

  @Put(':id/vote')
  async voteEvent(@Param('id') eventId: string, @Body() data: VoteEventDto) {
    return await this._eventsService.createVote(eventId, data);
  }
}
