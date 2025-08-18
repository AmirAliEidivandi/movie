import { IsEnum } from 'class-validator';

export enum SubscriptionPlan {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export const SubscriptionPrices: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.MONTHLY]: 150000,
  [SubscriptionPlan.QUARTERLY]: 400000,
  [SubscriptionPlan.YEARLY]: 1400000,
};

export class PurchaseSubscriptionDto {
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;
}
