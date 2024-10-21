import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { TASKS_NOT_FOUND } from 'src/errors/error.consts';

import { GoalModel } from './goals.model';
import { GUID } from 'src/types';
import { CreateGoalDto } from './dto/create.goal.dto';
import { INewGoal } from './types';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(GoalModel)
    private readonly goalsModel: ModelType<GoalModel>,
  ) {}

  async getAllGoalsByUserId(userId: GUID): Promise<GoalModel[] | null> {
    console.log('service: getAllGoalsByUserId');
    try {
      return this.goalsModel.find({ userId });
    } catch (e: any) {
      console.error('ERROR: service getAllGoalsByUserId', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async completeGoal(goalId: GUID, isDone: boolean): Promise<GoalModel | null> {
    console.log('service: completeGoal');
    try {
      return this.goalsModel.findByIdAndUpdate(
        goalId,
        { isDone },
        {
          new: true,
          upsert: true,
        },
      );
    } catch (e: any) {
      console.error('ERROR: service completeGoal', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async createGoal(goal: CreateGoalDto, userId: GUID) {
    console.log('service: createGoal', goal);
    try {
      const newGoal: INewGoal = {
        ...goal,
        userId,
        isDone: false,
      };
      console.log('newGoal', newGoal);
      return this.goalsModel.create(newGoal);
    } catch (e: any) {
      console.error('ERROR: service createGoal', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async updateGoal(goal: CreateGoalDto, goalId: GUID) {
    console.log('service: updateGoal');
    try {
      return this.goalsModel.findByIdAndUpdate(goalId, goal, {
        new: true,
        upsert: true,
      });
    } catch (e: any) {
      console.error('ERROR: service updateGoal', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  async removeGoal(goalId: GUID) {
    console.log('service: removeGoal');
    try {
      return this.goalsModel.findByIdAndDelete(goalId);
    } catch (e: any) {
      console.error('ERROR: service removeGoal', e);
      throw new HttpException(TASKS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
