var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
  title: {type: String, required: true, trim: true},
  city : {type: String, required: true},
  address: {type: String, required: true},
  price: {type: Number, required:true},
  rule: {type: String},
  content: {type: String, required: true},
  owner: {
    username: {type: String},
    _id: {type: ObjectId}
  },
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: {virtuals: true },
  toObject: {virtuals: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;
