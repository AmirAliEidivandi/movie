import { GetUser } from '@auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { DepositDto } from './dto/deposit.dto';
import { PurchaseSubscriptionDto } from './dto/purchase-subscription.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { ZarinpalGateway } from './gateways/zarinpal.gateway';
import { WalletService } from './wallet.service';

@Controller({
  path: 'wallet',
  version: '1',
})
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly zarinpalGateway: ZarinpalGateway,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('init')
  async init(@GetUser() user: any, @Body() dto: CreateWalletDto) {
    return this.walletService.getOrCreateWallet(user._id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('balance')
  async balance(@GetUser() user: any) {
    const balance = await this.walletService.getBalance(user._id);
    return { balance };
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async deposit(@GetUser() user: any, @Body() dto: DepositDto) {
    return this.walletService.createPendingDeposit(user._id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit/:id/success')
  @HttpCode(HttpStatus.OK)
  async markSuccess(@Param('id') id: string) {
    return this.walletService.markDepositSuccess(id, 'manual');
  }

  @UseGuards(JwtAuthGuard)
  @Post('withdraw')
  async withdraw(@GetUser() user: any, @Body() dto: WithdrawDto) {
    return this.walletService.withdraw(user._id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async transactions(@GetUser() user: any) {
    return this.walletService.listTransactions(user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase/subscription')
  async purchaseSubscription(
    @GetUser() user: any,
    @Body() dto: PurchaseSubscriptionDto,
  ) {
    return this.walletService.purchaseSubscription(user._id, dto);
  }

  // Zarinpal payment request for deposit
  @UseGuards(JwtAuthGuard)
  @Post('deposit/zarinpal')
  async depositZarinpal(
    @GetUser() user: any,
    @Body() dto: DepositDto,
  ): Promise<any> {
    const tx = await this.walletService.createPendingDeposit(user._id, dto);
    const description = dto.description || 'Wallet deposit';
    const res = await this.zarinpalGateway.requestPayment(
      dto.amount,
      description,
      `/api/v1/wallet/deposit/zarinpal/callback?transactionId=${tx._id}`,
    );
    const redirect_url = this.zarinpalGateway.getStartPayUrl(
      res.data.authority,
    );
    return { ...res, redirect_url };
  }

  // Zarinpal callback endpoint (public)
  @Get('deposit/zarinpal/callback')
  async zarinpalCallback(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
    @Query('transactionId') transactionId: string,
    @Query('amount') amount: string | undefined,
    @Res() res: Response,
  ): Promise<any> {
    if (status !== 'OK') {
      const redirect = `${this.configService.get('FRONTEND_URL')}/payment/result?status=failed&message=Payment%20canceled`;
      return res.redirect(302, redirect);
    }
    const tx = await this.walletService.getTransactionById(transactionId);
    const verify = await this.zarinpalGateway.verifyPayment(
      authority,
      tx.amount,
    );
    if (verify.data.code === 100 || verify.data.code === 101) {
      const updated = await this.walletService.markDepositSuccess(
        transactionId,
        'zarinpal',
        String(verify.data.ref_id),
      );
      const redirect = `${this.configService.get('FRONTEND_URL')}/payment/result?status=ok&refId=${verify.data.ref_id}&amount=${tx.amount}`;
      return res.redirect(302, redirect);
    }
    const redirect = `${this.configService.get('FRONTEND_URL')}/payment/result?status=failed&message=${encodeURIComponent(
      verify.data.message,
    )}`;
    return res.redirect(302, redirect);
  }
}
