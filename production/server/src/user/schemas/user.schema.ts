import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type UserDocument = User & Document;

function transformValue(_, ret: { [key: string]: any }) {
  delete ret._id;
}

@Schema({
  collection: 'users',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: transformValue,
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: transformValue,
  },
})
export class User {
  @Prop({
    required: [true, 'UserId cannot be empty'],
    unique: true,
    default: uuidv4,
  })
  readonly UserId: string;

  @Prop({ required: [true, 'User name cannot be empty'] })
  readonly name: string;

  @Prop({ required: [true, 'Passwords cannot be empty'] })
  password: string;

  @Prop({ required: [true, 'Role cannot be empty'], default: 'user' })
  role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);
