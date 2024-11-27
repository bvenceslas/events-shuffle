import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsDto } from './dto/events.create-or-update.dto';
import { VoteEventDto } from './dto/events.vote.dto';

@Controller({
  path: 'event',
  version: 'v1',
})
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async createEvent(@Body() createEventDto: EventsDto) {
    return await this.eventsService.create(createEventDto);
  }

  @Get()
  async getAllEvents() {
    return await this.eventsService.findAll();
  }

  @Get(':id')
  async getEventById(@Param('id') eventId: string) {
    return await this.eventsService.findOneById(eventId);
  }

  @Get('/name/:name')
  async getEventByName(@Param('name') eventName: string) {
    return await this.eventsService.findOneByName(eventName);
  }

  @Get(':id/results')
  async getSuitableDates(@Param('id') eventId: string) {
    return await this.eventsService.findSuitableDates(eventId);
  }

  @Put(':id')
  async updateEvent(@Param('id') eventId: string, @Body() data: EventsDto) {
    return await this.eventsService.update(eventId, data);
  }

  @Put(':id/vote')
  async voteEvent(@Param('id') eventId: string, @Body() data: VoteEventDto) {
    return await this.eventsService.createVote(eventId, data);
  }
}
