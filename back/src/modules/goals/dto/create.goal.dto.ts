import { Length } from 'class-validator';

export class CreateGoalDto {
  @Length(3, 50, { message: 'Title must be between 3 and 50 symbols' })
  title: string;

  date: string;
}
