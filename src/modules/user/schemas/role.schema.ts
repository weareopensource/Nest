import { Moment } from 'moment';
import { model, Schema } from 'mongoose';

export const RoleSchema = new Schema({
  name: String,
  createdDate: String,
  updatedDate: String,
  user: { type: Schema.Types.ObjectId, ref: 'user' },
});
