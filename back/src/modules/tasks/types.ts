import { TaskModel } from './tasks.model';

export type INewTask = Omit<TaskModel, 'id' | '_id'>;
