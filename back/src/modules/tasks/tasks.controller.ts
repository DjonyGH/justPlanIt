import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { getGUIDFromString } from 'src/utils/getObjectIdFromString';
import {
  ChangeOrderTaskDto,
  CompleteTaskDto,
  CurrentDateDto,
} from './dto/update.task.dto';
import { CreateTaskDto } from './dto/create.task.dto';
import { JWTGuard } from 'src/jwt/jwt.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksSevice: TasksService) {}

  // Возвращает все задачи для юзера
  @Get()
  @UseGuards(JWTGuard)
  async getTasks(
    @Query() query: { goalId?: string },
    @Session() session: Record<string, any>,
  ) {
    console.log('controller: getTasks');
    const userId = getGUIDFromString(session.userId);

    const goalId = query.goalId && getGUIDFromString(query.goalId);
    if (goalId) {
      return this.tasksSevice.getAllTasksByGoalId(goalId);
    }
    return this.tasksSevice.getAllTasksByUserId(userId);
  }

  // Обновляет статус задачи
  @Put(':id/complete')
  @UseGuards(JWTGuard)
  async completeTask(@Param('id') _id: string, @Body() task: CompleteTaskDto) {
    console.log('controller: completeTask');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.completeTask(taskId, task.isDone);
  }

  // Изменяет порядок задач
  @Put(':id/order')
  @UseGuards(JWTGuard)
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
  @UseGuards(JWTGuard)
  async sendTaskToNextDay(@Param('id') _id: string) {
    console.log('controller: sendTaskToNextDay');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.sendTaskToNextDay(taskId);
  }

  // Переносит задачу на текущий день
  @Put(':id/current-day')
  @UseGuards(JWTGuard)
  async sendTaskToCurrentDay(
    @Param('id') _id: string,
    @Body() data: CurrentDateDto,
  ) {
    console.log('controller: sendTaskToCurrentDay');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.sendTaskToCurrentDay(taskId, data.currentDate);
  }

  // Обновляет новую задачу
  @Put(':id')
  @UseGuards(JWTGuard)
  async updateTask(@Param('id') _id: string, @Body() task: CreateTaskDto) {
    console.log('controller: updateTask');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.updateTask(task, taskId);
  }

  // Создает новую задачу
  @Post()
  @UseGuards(JWTGuard)
  async createTask(
    @Session() session: Record<string, any>,
    @Body() task: CreateTaskDto,
  ) {
    console.log('controller: createTask', task);
    const userId = getGUIDFromString(session.userId);
    return this.tasksSevice.createTask(task, userId);
  }

  // Удаляет задачу
  @Delete(':id')
  @UseGuards(JWTGuard)
  async removeTask(@Param('id') _id: string) {
    console.log('controller: completeTask');
    const taskId = getGUIDFromString(_id);
    return this.tasksSevice.removeTask(taskId);
  }
}
