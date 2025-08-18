import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ZarinpalGateway } from './gateways/zarinpal.gateway';
import {
  WalletTransaction,
  WalletTransactionSchema,
} from './schemas/wallet-transaction.schema';
import { Wallet, WalletSchema } from './schemas/wallet.schema';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: WalletTransaction.name, schema: WalletTransactionSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService, ZarinpalGateway],
  exports: [WalletService],
})
export class WalletModule {}
