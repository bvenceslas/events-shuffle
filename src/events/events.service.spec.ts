import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Events } from './models/events.model';
import { UsersService } from '../users/users.service';
import { Model } from 'mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

describe('EventsService', () => {
  let service: EventsService;
  let eventsModel: Model<Events>;
  let usersService: UsersService;

  const mockEventsModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    save: jest.fn(),
  };

  const mockUsersService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getModelToken(Events.name),
          useValue: mockEventsModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsModel = module.get<Model<Events>>(getModelToken(Events.name));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if event name already exists', async () => {
      const mockDto = { name: 'Test Event', dates: [new Date()] };
      const mockReq = { user: { username: 'testuser' } };

      jest
        .spyOn(service, 'findOneByName')
        .mockResolvedValue({ name: 'Test Event' } as any);

      await expect(service.create(mockDto, mockReq)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const mockEvents = [
        { name: 'Event 1', creator: 'userId' },
        { name: 'Event 2', creator: 'userId' },
      ];

      jest.spyOn(eventsModel, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockEvents),
        }),
      } as any);

      const result = await service.findAll();

      expect(eventsModel.find).toHaveBeenCalledWith({}, { dates: 0, __v: 0 });
      expect(result).toEqual(mockEvents);
    });
  });

  describe('findSuitableDates', () => {
    it('should return the most suitable dates for an event', async () => {
      const mockEvent = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test Event',
        dates: [new Date('2024-12-25'), new Date('2024-12-26')],
        votes: [
          { date: new Date('2024-12-25'), people: ['user1', 'user2'] },
          { date: new Date('2024-12-26'), people: ['user1', 'user2', 'user3'] },
        ],
        creator: { username: 'testuser', password: 'password123' },
        __v: 0,
      };

      jest.spyOn(service, 'findOneById').mockResolvedValue(mockEvent);

      const result = await service.findSuitableDates('eventId');

      expect(service.findOneById).toHaveBeenCalledWith('eventId');
      expect(result).toEqual({
        id: mockEvent._id,
        name: 'Test Event',
        suitableDates: [
          { date: new Date('2024-12-26'), people: ['user1', 'user2', 'user3'] },
        ],
      });
    });

    it('should throw NotFoundException if event is not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);

      await expect(service.findSuitableDates('eventId')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const mockEvent = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test Event',
        dates: [new Date('2024-12-20'), new Date('2024-12-30')],
        votes: [
          { date: new Date('2024-12-20'), people: ['user1', 'user2'] },
          { date: new Date('2024-12-30'), people: ['user1', 'user2', 'user3'] },
        ],
        creator: { username: 'testuser', password: 'password123' },
        __v: 0,
      };

      const mockUpdatedEvent = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Updated Event',
        dates: [new Date('2024-12-25'), new Date('2024-12-26')],
      };

      jest.spyOn(service, 'findOneById').mockResolvedValue(mockEvent);
      jest
        .spyOn(eventsModel, 'findByIdAndUpdate')
        .mockResolvedValue(mockUpdatedEvent);

      const eventId = new Types.ObjectId('507f1f77bcf86cd799439011');

      const result = await service.update(eventId.toString(), {
        name: 'Updated Event',
        dates: [new Date('2024-12-25'), new Date('2024-12-26')],
      });

      expect(service.findOneById).toHaveBeenCalledWith(eventId.toString());
      expect(eventsModel.findByIdAndUpdate).toHaveBeenCalledWith(
        eventId.toString(),
        {
          name: 'Updated Event',
          dates: [new Date('2024-12-25'), new Date('2024-12-26')],
        },
        { new: true },
      );
      expect(result).toEqual(mockUpdatedEvent);
    });

    it('should throw NotFoundException if event is not found', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);

      await expect(
        service.update('eventId', {
          name: 'Updated Event',
          dates: [new Date('2024-12-25'), new Date('2024-12-26')],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createVote', () => {
    it('should add a vote to an event', async () => {
      const mockEvent = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test Event',
        dates: [new Date('2024-12-20'), new Date('2024-12-30')],
        votes: [
          { date: new Date('2024-12-20'), people: ['user1', 'user2'] },
          { date: new Date('2024-12-30'), people: ['user1', 'user2', 'user3'] },
        ],
        creator: { username: 'testuser', password: 'password123' },
        __v: 0,
        save: jest.fn().mockResolvedValue(this),
      };

      const mockUser = {
        _id: 'userId',
        username: 'testuser',
        password: 'password123',
      };

      const mockReq = { user: { username: 'testuser' } };

      jest.spyOn(service, 'findOneById').mockResolvedValue(mockEvent);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

      const eventId = new Types.ObjectId('507f1f77bcf86cd799439011');
      const result = await service.createVote(
        eventId.toString(),
        { votingDates: [new Date('2024-12-25')] },
        mockReq,
      );

      expect(service.findOneById).toHaveBeenCalledWith(eventId.toString());
      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if event is not found', async () => {
      const eventId = new Types.ObjectId('507f1f77bcf86cd799439011');
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);

      await expect(
        service.createVote(
          eventId.toString(),
          { votingDates: [new Date()] },
          {},
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const mockEvent = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        name: 'Test Event',
        dates: [new Date('2024-12-20')],
        votes: [],
        creator: { username: 'testuser', password: 'password123' },
        __v: 0,
      };
      jest.spyOn(service, 'findOneById').mockResolvedValue(mockEvent);
      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      await expect(
        service.createVote(
          mockEvent._id.toString(),
          { votingDates: [new Date()] },
          { user: { username: 'testuser' } },
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
