import { Length } from 'class-validator';

export class SetPasswordUserDto {
  @Length(4, 12, { message: 'Пароль должен быть от 4 до 12 символов' })
  password: string;
}
