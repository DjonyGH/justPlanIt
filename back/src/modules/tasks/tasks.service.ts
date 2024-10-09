import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { TASKS_NOT_FOUND } from 'src/errors/error.consts';

import { TaskModel } from './tasks.model';
import { GUID } from 'src/types';
import { CreateTaskDto } from './dto/create.task.dto';
import { INewTask } from './types';
import moment from 'moment';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(TaskModel)
    private readonly tasksModel: ModelType<TaskModel>,
  ) {}

  async getAllTasksByUserId(userId: GUID): Promise<TaskModel[] | null> {
    console.log('service: getAllTasksByUserId');
    try {
      return this.tasksModel.find({ userId });
    } catch (e: any) {
      console.error('ERROR: service getAllTasksByUserId', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async completeTask(taskId: GUID, isDone: boolean): Promise<TaskModel | null> {
    console.log('service: completeTask');
    try {
      return this.tasksModel.findByIdAndUpdate(
        taskId,
        { isDone },
        {
          new: true,
          upsert: true,
        },
      );
    } catch (e: any) {
      console.error('ERROR: service completeTask', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async changeOrderTask(
    taskId: GUID,
    changeOrder: 1 | -1,
  ): Promise<boolean | null> {
    console.log('service: changeOrderTask ');
    try {
      const currentTask = await this.tasksModel.findById(taskId);
      const currentOrder = currentTask.order;
      const tasks = await this.tasksModel.find({
        userId: currentTask.userId,
        date: currentTask.date,
      });
      tasks.sort((a, b) =>
        changeOrder > 0 ? a.order - b.order : b.order - a.order,
      );
      const currentIndex = tasks.findIndex((i) => i.order === currentOrder);
      const nextTask = tasks[currentIndex + 1];
      const nextOrder = nextTask.order;

      await this.tasksModel.findByIdAndUpdate(
        currentTask.id,
        { order: nextOrder },
        {
          new: true,
          upsert: true,
        },
      );
      await this.tasksModel.findByIdAndUpdate(
        nextTask.id,
        { order: currentOrder },
        {
          new: true,
          upsert: true,
        },
      );

      return true;
    } catch (e: any) {
      console.error('ERROR: service changeOrderTask', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async sendTaskToNextDay(taskId: GUID): Promise<TaskModel | null> {
    console.log('service: completeTask');
    try {
      const currentTask = await this.tasksModel.findById(taskId);
      const nextDate = moment(currentTask.date)
        .add(1, 'd')
        .toISOString()
        .split('T')[0];
      return this.tasksModel.findByIdAndUpdate(
        taskId,
        { date: nextDate },
        {
          new: true,
          upsert: true,
        },
      );
    } catch (e: any) {
      console.error('ERROR: service completeTask', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async createTask(task: CreateTaskDto, userId: GUID) {
    console.log('service: createTask');
    const tasks = await this.tasksModel.find({ userId, date: task.date });
    const maxOrder = tasks.length ? Math.max(...tasks.map((i) => i.order)) : 0;
    try {
      const newTask: INewTask = {
        ...task,
        userId,
        order: maxOrder + 1,
        isDone: false,
      };
      return this.tasksModel.create(newTask);
    } catch (e: any) {
      console.error('ERROR: service createTask', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async updateTask(task: CreateTaskDto, taskId: GUID) {
    console.log('service: updateTask');
    try {
      return this.tasksModel.findByIdAndUpdate(taskId, task, {
        new: true,
        upsert: true,
      });
    } catch (e: any) {
      console.error('ERROR: service updateTask', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async removeTask(taskId: GUID) {
    console.log('service: removeTask');
    try {
      return this.tasksModel.findByIdAndDelete(taskId);
    } catch (e: any) {
      console.error('ERROR: service removeTask', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
