import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Mongoose, Types } from 'mongoose';
import { User } from 'src/users/models/users.model';

export type TypeVote = {
  date: Date;
  people: string[];
};

@Schema()
class Vote {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: [String], required: true })
  people: string[];
}

export const VoteSchema = SchemaFactory.createForClass(Vote);

export type EventsDocument = HydratedDocument<Events>;

@Schema({ collection: 'events' })
export class Events {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: [Date],
    required: true,
  })
  dates: Date[];

  @Prop({ type: [VoteSchema], required: false })
  votes: TypeVote[] | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
  })
  creator: User | null;
}

export const EventsSchema = SchemaFactory.createForClass(Events);
