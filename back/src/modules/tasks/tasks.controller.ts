import { Body, Controller, Get, Param, Put, Session } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { getGUIDFromString } from 'src/utils/getObjectIdFromString';
import { CompleteTaskDto } from './dto/update.task.dto';

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

  // Возвращает все задачи для юзера
  @Put(':id')
  async completeTask(@Param('id') _id: string, @Body() task: CompleteTaskDto) {
    console.log('controller: completeTask');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.completeTask(taskId, task.isDone);
  }
}
