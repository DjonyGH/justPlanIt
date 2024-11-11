import { IsString } from 'class-validator';

export class CheckData {
  @IsString()
  hash: string;

  @IsString()
  checkData: string;
}

export class UserData {
  tgId: string;

  login?: string;

  userName?: string;
}

export class loginDto {
  checkData: CheckData;
  userData: UserData;
}
