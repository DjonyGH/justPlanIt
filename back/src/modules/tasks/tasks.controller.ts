import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Session,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { getGUIDFromString } from 'src/utils/getObjectIdFromString';
import { ChangeOrderTaskDto, CompleteTaskDto } from './dto/update.task.dto';
import { CreateTaskDto } from './dto/create.task.dto';
import { INewTask } from './types';

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

  // Обновляет статус задачи
  @Put(':id/complete')
  async completeTask(@Param('id') _id: string, @Body() task: CompleteTaskDto) {
    console.log('controller: completeTask');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.completeTask(taskId, task.isDone);
  }

  // Изменяет порядок задач
  @Put(':id/order')
  async changeOrderTask(
    @Param('id') _id: string,
    @Body() data: ChangeOrderTaskDto,
  ) {
    console.log('controller: changeOrderTask');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.changeOrderTask(taskId, data.changeOrder);
  }

  // Переносит задачу на след день
  @Put(':id/next-day')
  async sendTaskToNextDay(@Param('id') _id: string) {
    console.log('controller: sendTaskToNextDay');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.sendTaskToNextDay(taskId);
  }

  // Обновляет новую задачу
  @Put(':id')
  async updateTask(@Param('id') _id: string, @Body() task: CreateTaskDto) {
    console.log('controller: updateTask');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.updateTask(task, taskId);
  }

  // Создает новую задачу
  @Post()
  async createTask(
    @Session() session: Record<string, any>,
    @Body() task: CreateTaskDto,
  ) {
    console.log('controller: completeTask');
    const userId = getGUIDFromString(session.userId);
    return this.tasksSevice.createTask(task, userId);
  }

  // Удаляет задачу
  @Delete(':id')
  async removeTask(@Param('id') _id: string) {
    console.log('controller: completeTask');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.removeTask(taskId);
  }
}
