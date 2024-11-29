import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsDto } from './dto/events.create-or-update.dto';
import { VoteEventDto } from './dto/events.vote.dto';
import { Public } from 'src/utils/public.guard';
import { processEventData } from 'src/utils/date.process';
import { Events } from './models/events.model';
import { SuitableDatesResponse } from './dto/events.suitable-dates.response';

@Controller({
  path: 'event',
  version: 'v1',
})
export class EventsController {
  constructor(private readonly _eventsService: EventsService) {}

  @Post()
  async createEvent(
    @Body() createEventDto: EventsDto,
    @Req() req,
  ): Promise<{ id: any }> {
    return await this._eventsService.create(
      processEventData(createEventDto),
      req,
    );
  }

  @Public()
  @Get('list')
  async getAllEvents(): Promise<Events[]> {
    return await this._eventsService.findAll();
  }

  @Public()
  @Get(':id')
  async getEventById(@Param('id') eventId: string): Promise<Events | null> {
    return await this._eventsService.findOneById(eventId);
  }

  @Public()
  @Get('/name/:name')
  async getEventByName(
    @Param('name') eventName: string,
  ): Promise<Events | null> {
    return await this._eventsService.findOneByName(eventName);
  }

  @Get(':id/results')
  async getSuitableDates(
    @Param('id') eventId: string,
  ): Promise<SuitableDatesResponse> {
    return await this._eventsService.findSuitableDates(eventId);
  }

  @Put(':id')
  async updateEvent(
    @Param('id') eventId: string,
    @Body() data: EventsDto,
  ): Promise<Events | null> {
    return await this._eventsService.update(eventId, data);
  }

  @Put(':id/vote')
  async voteEvent(
    @Param('id') eventId: string,
    @Body() data: VoteEventDto,
    @Req() req,
  ): Promise<Events | null> {
    return await this._eventsService.createVote(eventId, data, req);
  }
}
