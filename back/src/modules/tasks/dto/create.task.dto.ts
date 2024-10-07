import { Length, IsEmail } from 'class-validator';

export class CreateTaskDto {
  @Length(3, 50, { message: 'Login must be between 3 and 50 symbols' })
  login: string;

  @IsEmail()
  email: string;

  @Length(4, 12, { message: 'Login must be between 4 and 12 symbols' })
  password: string;
}