// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');
const { Schema } = mongoose;

var PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: 'User is required',
    autopopulate: true,
  },
  title: { type: String },
  content: { type: String },
});

// ================================ PLUGIN
// for details - see https://github.com/mongodb-js/mongoose-autopopulate
PostSchema.plugin(autopopulate);

module.exports = mongoose.model('post', PostSchema);
