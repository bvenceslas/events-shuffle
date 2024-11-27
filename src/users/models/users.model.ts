import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'users' })
export class User {
  @Prop({ type: String, required: true, trim: true })
  username: string;

  @Prop({ type: String, required: true, trim: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
