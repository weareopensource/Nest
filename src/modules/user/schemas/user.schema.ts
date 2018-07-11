import { Moment } from 'moment';
import { Schema } from 'mongoose';
// import { User } from '../interfaces/user.interface';
// import { hash } from 'bcrypt';
// import * as ac from 'accesscontrol';

/*
userSchema.pre('save', (next) => {

//  this.populate('roles', () => next());
});

userSchema.post('save', (_err, doc, next) => {
  doc.populate('roles', () => next());
});

userSchema.post('find', (err: MongoError, doc, next) => {
  doc.populate('roles', () => next());
});
*/

/*
userSchema.pre('findByIdAndUpdate', (res) => {
  this.populate('roles');
});

userSchema.post('findByIdAndUpdate', (err: MongoError, doc, next) => {
  doc.populate('roles', () => next());
});
*/

/*

export const UserSchemaProvider = {
  provide: 'user',
  useFactory: (access: ac.AccessControl): any => {
//    const roles = access.getRoles();

    const UserSchema = new mongoose.Schema({
      sub: { type: String, unique: true, required: false },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      userName: { type: String, required: true },
      email: { type: String, unique: true, required: true },
      passwordDigest: String,
      provider: String,
      profileImageURL: String,
      createdDate: String,
      updatedDate: String,
      roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role' }],
    });

    UserSchema.pre<any>('save', (next) => {
      const user = this;
      if (user.password) {
        hash(user.password, 10, (err, hashed) => {
          if (err) {
            return next(err);
          }
          user.password = hashed;
          next();
        });
      }
    });

    UserSchema.post('findOne', (_err, doc, next) => {
      console.log('??????');
      doc.populate('roles').execPopulate().then(() => {
        this.roles = this.roles.map(role => role.name);
        next();
      });
    });

    return mongoose.model('User', UserSchema);
  },
  inject: ['AccessControl'],
};
*/

export const UserSchema = new Schema({
  sub: { type: String, unique: true, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordDigest: String,
  provider: String,
  profileImageURL: String,
  createdDate: String,
  updatedDate: String,
  roles: [{ type: Schema.Types.ObjectId, ref: 'role' }],
});
