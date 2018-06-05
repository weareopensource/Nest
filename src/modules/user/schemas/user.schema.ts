import { Moment } from 'moment';
import { Schema, model } from 'mongoose';

export const userSchema = new Schema({
  sub: String,
  firstName: String,
  lastName: String,
  email: String,
  passwordDigest: String,
  provider: String,
  profileImageURL: String,
  createdDate: String,
  updatedDate: String,
  roles: [{ type: Schema.Types.ObjectId, ref: 'role' }],
});
