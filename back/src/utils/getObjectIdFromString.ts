import { mongoose } from '@typegoose/typegoose';

export const getGUIDFromString = (id: string): mongoose.Types.ObjectId => {
  return new mongoose.Types.ObjectId(id);
};
