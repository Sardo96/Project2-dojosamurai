const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the User model to whatever makes sense in this case

const userSchema = new Schema(
  {
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
    email: {
      type: String,
      required: true,
      unique: true,
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
      enum: [
        '9th Kyu',
        '8th Kyu',
        '7th Kyu',
        '6th Kyu',
        '5th Kyu',
        '4th Kyu',
        '3rd Kyu',
        '2nd Kyu',
        '1st Kyu',
        '1st Dan',
        '2nd Dan',
        '3rd Dan',
        '4th Dan',
        '5th Dan',
        '6th Dan',
        '7th Dan'
      ]
    },
    lastGraded: {
      type: Date,
      required: true
    },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student'
    },
    dojo: {
      type: String,
      required: true,
      trim: true
    },
    senseiFeedback: {
      type: String,
      default: ''
    },
    profilePic: {
      type: String,
      default:
        'https://res.cloudinary.com/dq7uyauun/image/upload/v1614788923/P' +
        Math.floor(Math.random() * 10) +
        '.jpg',
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true
    },
    emergencyContact: {
      type: String
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true
  }
);

const User = model('User', userSchema);
module.exports = User;
