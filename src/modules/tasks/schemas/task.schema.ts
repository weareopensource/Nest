import { Moment } from 'moment';
import { Schema, model } from 'mongoose';

export const taskSchema = new Schema({
  title: String,
  description: String,
  createdDate: String,
  updatedDate: String,
  user: { type: Schema.Types.ObjectId, ref: 'user' },
});
