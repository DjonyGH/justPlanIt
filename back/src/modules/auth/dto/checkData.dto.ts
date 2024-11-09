import { IsString } from 'class-validator';

export class CheckDataDto {
  @IsString()
  hash: string;

  @IsString()
  checkData: string;
}
