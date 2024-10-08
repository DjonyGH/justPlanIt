import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { TASKS_NOT_FOUND } from 'src/errors/error.consts';

import { TaskModel } from './tasks.model';
import { GUID } from 'src/types';

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
      console.error('ERROR: service getAllTasksByUserId', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async createTask() {}

  async updateTask() {}

  async deleteTask() {}
}
