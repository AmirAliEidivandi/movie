import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletDocument = Wallet & Document;

export enum WalletCurrency {
  IRR = 'IRR',
}

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({
    type: String,
    enum: Object.values(WalletCurrency),
    default: WalletCurrency.IRR,
  })
  currency: WalletCurrency;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.index({ userId: 1 }, { unique: true });
