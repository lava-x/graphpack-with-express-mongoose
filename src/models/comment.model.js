// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const { Schema } = mongoose;

var CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: 'User is required',
    autopopulate: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'post',
    required: 'Post is required',
  },
  content: { type: String },
});

// ================================ PLUGIN
// for details - see https://github.com/mongodb-js/mongoose-autopopulate
CommentSchema.plugin(autopopulate);

module.exports = mongoose.model('comment', CommentSchema);
