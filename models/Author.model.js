const { Schema, model } = require('mongoose');

const authorSchema = new Schema({
  name: String,
  bio: String,
  picture: String
});

const Author = model('Author', authorSchema);

module.exports = Author;
