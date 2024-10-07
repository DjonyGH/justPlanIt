import { Body, Controller, Get, Session } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { getGUIDFromString } from 'src/utils/getObjectIdFromString';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksSevice: TasksService) {}

  // Возвращает все задачи для юзера
  @Get()
  async getTasks(@Session() session: Record<string, any>) {
    // console.log('controller: getTasks');
    const userId = getGUIDFromString(session.userId);
    return this.tasksSevice.getAllTasksByUserId(userId);
  }
}
