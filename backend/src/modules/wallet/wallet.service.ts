import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { DepositDto } from './dto/deposit.dto';
import {
  PurchaseSubscriptionDto,
  SubscriptionPrices,
} from './dto/purchase-subscription.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import {
  WalletTransaction,
  WalletTransactionDocument,
  WalletTransactionStatus,
  WalletTransactionType,
} from './schemas/wallet-transaction.schema';
import { Wallet, WalletDocument } from './schemas/wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<WalletDocument>,
    @InjectModel(WalletTransaction.name)
    private readonly transactionModel: Model<WalletTransactionDocument>,
  ) {}

  async getOrCreateWallet(
    userId: string,
    dto?: CreateWalletDto,
  ): Promise<Wallet> {
    let wallet = await this.walletModel.findOne({ userId });
    if (!wallet) {
      wallet = await this.walletModel.create({
        _id: userId,
        userId,
        balance: 0,
        currency: dto?.currency,
      });
    }
    return wallet.toObject();
  }

  async getBalance(userId: string): Promise<number> {
    const wallet = await this.walletModel.findOne({ userId });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet.balance;
  }

  async createPendingDeposit(userId: string, dto: DepositDto) {
    const wallet = await this.getOrCreateWallet(userId);
    const tx = await this.transactionModel.create({
      _id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      walletId: wallet._id,
      userId,
      amount: dto.amount,
      description: dto.description,
      type: WalletTransactionType.DEPOSIT,
      status: WalletTransactionStatus.PENDING,
    });
    return tx.toObject();
  }

  async markDepositSuccess(
    transactionId: string,
    gateway: string,
    gatewayRefId?: string,
  ) {
    const tx = await this.transactionModel.findById(transactionId);
    if (!tx) throw new NotFoundException('Transaction not found');
    if (tx.status === WalletTransactionStatus.SUCCESS) return tx.toObject();
    if (tx.type !== WalletTransactionType.DEPOSIT)
      throw new BadRequestException('Only deposits can be marked as success');

    tx.status = WalletTransactionStatus.SUCCESS;
    tx.gateway = gateway;
    tx.gatewayRefId = gatewayRefId;
    await tx.save();

    await this.walletModel.updateOne(
      { _id: tx.walletId },
      { $inc: { balance: tx.amount } },
    );
    return tx.toObject();
  }

  async withdraw(userId: string, dto: WithdrawDto) {
    const wallet = await this.getOrCreateWallet(userId);
    if (wallet.balance < dto.amount)
      throw new BadRequestException('Insufficient balance');

    const tx = await this.transactionModel.create({
      _id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      walletId: wallet._id,
      userId,
      amount: dto.amount,
      description: dto.description,
      type: WalletTransactionType.WITHDRAW,
      status: WalletTransactionStatus.SUCCESS,
    });

    await this.walletModel.updateOne(
      { _id: wallet._id },
      { $inc: { balance: -dto.amount } },
    );
    return tx.toObject();
  }

  async listTransactions(userId: string, limit = 20) {
    const wallet = await this.getOrCreateWallet(userId);
    const list = await this.transactionModel
      .find({ walletId: wallet._id })
      .sort({ createdAt: -1 })
      .limit(limit);
    return list.map((d) => d.toObject());
  }

  async getTransactionById(transactionId: string) {
    const tx = await this.transactionModel.findById(transactionId);
    if (!tx) throw new NotFoundException('Transaction not found');
    return tx.toObject();
  }

  async purchaseSubscription(userId: string, dto: PurchaseSubscriptionDto) {
    const price = SubscriptionPrices[dto.plan];
    const wallet = await this.getOrCreateWallet(userId);
    if (wallet.balance < price)
      throw new BadRequestException('Insufficient balance');

    const tx = await this.transactionModel.create({
      _id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      walletId: wallet._id,
      userId,
      amount: price,
      description: `Purchase subscription ${dto.plan}`,
      type: WalletTransactionType.PURCHASE,
      status: WalletTransactionStatus.SUCCESS,
    });

    await this.walletModel.updateOne(
      { _id: wallet._id },
      { $inc: { balance: -price } },
    );
    return tx.toObject();
  }
}
