import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class WithdrawDto {
  @IsInt()
  @Min(1000)
  @Max(100000000)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
