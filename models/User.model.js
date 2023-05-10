const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,

      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    belt: {
      type: String,
      required: true,
      enum: ['9th Kyu', '8th Kyu', '7th Kyu', '6th Kyu', '5th Kyu', '4th Kyu', '3rd Kyu', '2nd Kyu', '1st Kyu', '1st Dan', '2nd Dan', '3rd Dan', '4th Dan', '5th Dan', '6th Dan', '7th Dan']
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      require: true,
      trim: true
    },
    isSensei: {
      type: Boolean,
      default: false,
      required: true
    },
    isStudent: {
      type: Boolean,
      default: true,
      required: true
    }

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true
  }
);

const User = model('User', userSchema);
module.exports = User;
