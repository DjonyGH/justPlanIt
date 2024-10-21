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
import { GoalsService } from './goals.service';
import { getGUIDFromString } from 'src/utils/getObjectIdFromString';
import { CreateGoalDto } from './dto/create.goal.dto';
import { CompleteGoalDto } from './dto/update.goal.dto';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsSevice: GoalsService) {}

  // Возвращает все цели для юзера
  @Get()
  async getGoals(@Session() session: Record<string, any>) {
    // console.log('controller: getGoals');
    const userId = getGUIDFromString(session.userId);
    return this.goalsSevice.getAllGoalsByUserId(userId);
  }

  // Обновляет статус цели
  @Put(':id/complete')
  async completeGoal(@Param('id') _id: string, @Body() goal: CompleteGoalDto) {
    console.log('controller: completeGoal');
    const goalId = getGUIDFromString(_id);
    return this.goalsSevice.completeGoal(goalId, goal.isDone);
  }

  // Обновляет цель
  @Put(':id')
  async updateGoal(@Param('id') _id: string, @Body() goal: CreateGoalDto) {
    console.log('controller: updateGoal');
    const goalId = getGUIDFromString(_id);
    return this.goalsSevice.updateGoal(goal, goalId);
  }

  // Создает новую цель
  @Post()
  async createGoal(
    @Session() session: Record<string, any>,
    @Body() goal: CreateGoalDto,
  ) {
    console.log('controller: createGoal', goal);
    const userId = getGUIDFromString(session.userId);
    return this.goalsSevice.createGoal(goal, userId);
  }

  // Удаляет цель
  @Delete(':id')
  async removeGoal(@Param('id') _id: string) {
    console.log('controller: removeGoal');
    const goalId = getGUIDFromString(_id);
    return this.goalsSevice.removeGoal(goalId);
  }
}
