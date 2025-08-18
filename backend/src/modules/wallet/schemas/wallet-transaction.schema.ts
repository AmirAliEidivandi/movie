import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WalletTransactionDocument = WalletTransaction & Document;

export enum WalletTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  PURCHASE = 'PURCHASE',
  REFUND = 'REFUND',
}

export enum WalletTransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

@Schema({ timestamps: true })
export class WalletTransaction {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ type: String, required: true, index: true })
  walletId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({
    type: String,
    enum: Object.values(WalletTransactionType),
    required: true,
  })
  type: WalletTransactionType;

  @Prop({
    type: String,
    enum: Object.values(WalletTransactionStatus),
    default: WalletTransactionStatus.PENDING,
  })
  status: WalletTransactionStatus;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  gateway?: string;

  @Prop({ type: String })
  gatewayRefId?: string;

  @Prop({ type: String })
  callbackUrl?: string;
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
WalletTransactionSchema.index({ walletId: 1, createdAt: -1 });
