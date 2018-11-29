// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, trim: true, require: 'Name is required' },
  email: {
    type: String,
    unique: true,
    trim: true,
    require: 'Email is required',
  },
  password: { type: String, require: 'Password is required' },
  roles: {
    type: [String],
    enum: ['admin', 'user'],
    default: 'user',
    require: 'Role is required',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ================================ MISC
const autoupdate = function(next) {
  this.updatedAt = Date.now();
  next();
};

const transform = function(doc, ret) {
  delete ret.__v;
};

UserSchema.set('toJSON', { transform });
UserSchema.set('toObject', { transform });
UserSchema.pre('save', autoupdate);
UserSchema.pre('update', autoupdate);

// ================================ PLUGIN
UserSchema.plugin(uniqueValidator, {
  message: 'Error, expected {PATH} to be unique.',
});

module.exports = mongoose.model('user', UserSchema);
