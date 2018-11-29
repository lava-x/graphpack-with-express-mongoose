// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: 'User is required',
    autopopulate: true,
  },
  title: { type: String, require: 'Title is required' },
  body: { type: String, require: 'Body is required' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ================================ DATA
ArticleSchema.statics.getData = function(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid article id:${id}`);
  }
  return this.model('article')
    .findById(id)
    .then(function(data) {
      if (!data) {
        throw new Error(`Article not found`);
      }
      return data;
    });
};

// ================================ MISC
const autoupdate = function(next) {
  this.updatedAt = Date.now();
  next();
};

const transform = function(doc, ret) {
  delete ret.__v;
};

ArticleSchema.set('toJSON', { transform });
ArticleSchema.set('toObject', { transform });
ArticleSchema.pre('save', autoupdate);
ArticleSchema.pre('update', autoupdate);

// ================================ PLUGIN
// for details - see https://github.com/mongodb-js/mongoose-autopopulate
ArticleSchema.plugin(autopopulate);

module.exports = mongoose.model('article', ArticleSchema);
