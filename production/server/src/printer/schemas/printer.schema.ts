import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { PrinterType } from '../dto/create-printer.dto';

export type PrinterDocument = Printer & Document;

function transformValue(_, ret: { [key: string]: any }) {
  delete ret._id;
}

@Schema({
  collection: 'printers',
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
export class Printer {
  @Prop({ required: [true, 'Printer name cannot be empty'] })
  name: string;

  @Prop({
    required: [true, 'PrinterId cannot be empty'],
    unique: true,
    default: uuidv4,
  })
  readonly PrinterId: string;

  @Prop({ required: true })
  ip: string;

  @Prop()
  proto: 'http' | 'https';

  @Prop({ required: true })
  port: number;

  @Prop({ required: true })
  apiKey: string;

  @Prop()
  type: PrinterType;

  @Prop({ type: Number, default: Date.now() })
  createdAt: number;

  @Prop({ type: Number })
  lastPrintAt: number;
}

export const PrinterSchema = SchemaFactory.createForClass(Printer);
