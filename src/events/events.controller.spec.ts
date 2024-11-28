import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { processEventData } from '../utils/date.process';
import { EventsDto } from './dto/events.create-or-update.dto';
import { VoteEventDto } from './dto/events.vote.dto';
import { Events } from './models/events.model';
import { EventsService } from './events.service';

// Mocking dependencies
jest.mock('../utils/date.process', () => ({
  processEventData: jest.fn(),
}));

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    findOneByName: jest.fn(),
    findSuitableDates: jest.fn(),
    update: jest.fn(),
    createVote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    it('should create a new event and return its ID', async () => {
      const mockDto: EventsDto = {
        name: 'Test Event',
        dates: [new Date('2024-12-25')],
      };
      const mockReq = { user: { username: 'testuser' } };
      const processedData = { ...mockDto, dates: [new Date('2024-12-25')] };
      const mockResult = { id: 'mockId' };

      (processEventData as jest.Mock).mockReturnValue(processedData);
      mockEventsService.create.mockResolvedValue(mockResult);

      const result = await controller.createEvent(mockDto, mockReq);

      expect(processEventData).toHaveBeenCalledWith(mockDto);
      expect(mockEventsService.create).toHaveBeenCalledWith(
        processedData,
        mockReq,
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getAllEvents', () => {
    it('should return all events', async () => {
      const mockEvents: Events[] = [
        { name: 'Event1', dates: [], votes: null, creator: null },
        { name: 'Event2', dates: [], votes: null, creator: null },
      ];

      mockEventsService.findAll.mockResolvedValue(mockEvents);

      const result = await controller.getAllEvents();

      expect(mockEventsService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });
  });

  describe('getEventById', () => {
    it('should return a single event by ID', async () => {
      const mockEvent = {
        name: 'Test Event',
        dates: [],
        votes: null,
        creator: null,
      };

      mockEventsService.findOneById.mockResolvedValue(mockEvent);

      const result = await controller.getEventById('mockId');

      expect(mockEventsService.findOneById).toHaveBeenCalledWith('mockId');
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getEventByName', () => {
    it('should return a single event by name', async () => {
      const mockEvent = {
        name: 'Test Event',
        dates: [],
        votes: null,
        creator: null,
      };

      mockEventsService.findOneByName.mockResolvedValue(mockEvent);

      const result = await controller.getEventByName('Test Event');

      expect(mockEventsService.findOneByName).toHaveBeenCalledWith(
        'Test Event',
      );
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getSuitableDates', () => {
    it('should return suitable dates for an event', async () => {
      const mockResponse = {
        id: 'mockId',
        name: 'Test Event',
        suitableDates: [
          { date: new Date('2024-12-25'), people: ['user1', 'user2'] },
        ],
      };

      mockEventsService.findSuitableDates.mockResolvedValue(mockResponse);

      const result = await controller.getSuitableDates('mockId');

      expect(mockEventsService.findSuitableDates).toHaveBeenCalledWith(
        'mockId',
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateEvent', () => {
    it('should update an event and return the updated data', async () => {
      const mockDto: EventsDto = {
        name: 'Updated Event',
        dates: [new Date('2024-12-31')],
      };
      const mockUpdatedEvent = {
        name: 'Updated Event',
        dates: [new Date('2024-12-31')],
        votes: null,
        creator: null,
      };

      mockEventsService.update.mockResolvedValue(mockUpdatedEvent);

      const result = await controller.updateEvent('mockId', mockDto);

      expect(mockEventsService.update).toHaveBeenCalledWith('mockId', mockDto);
      expect(result).toEqual(mockUpdatedEvent);
    });
  });

  describe('voteEvent', () => {
    it('should create a vote for an event and return the updated event', async () => {
      const mockDto: VoteEventDto = {
        votingDates: [new Date('2024-12-25')],
      };
      const mockReq = { user: { username: 'testuser' } };
      const mockUpdatedEvent = {
        name: 'Test Event',
        dates: [new Date('2024-12-25')],
        votes: [{ date: new Date('2024-12-25'), people: ['testuser'] }],
        creator: null,
      };

      mockEventsService.createVote.mockResolvedValue(mockUpdatedEvent);

      const result = await controller.voteEvent('mockId', mockDto, mockReq);

      expect(mockEventsService.createVote).toHaveBeenCalledWith(
        'mockId',
        mockDto,
        mockReq,
      );
      expect(result).toEqual(mockUpdatedEvent);
    });
  });
});
