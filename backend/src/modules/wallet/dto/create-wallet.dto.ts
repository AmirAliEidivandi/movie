import { IsEnum, IsOptional } from 'class-validator';
import { WalletCurrency } from '../schemas/wallet.schema';

export class CreateWalletDto {
  @IsOptional()
  @IsEnum(WalletCurrency)
  currency?: WalletCurrency;
}
