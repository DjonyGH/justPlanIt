import { GoalModel } from './goals.model';

export type INewGoal = Omit<GoalModel, 'id' | '_id'>;
