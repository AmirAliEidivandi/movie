import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: false })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  nickname?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  occupation?: string;

  @Prop()
  location?: string;

  @Prop()
  bio?: string;

  @Prop({ type: [String], default: [] })
  favoriteGenres: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
