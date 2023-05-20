const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password, bio, profilePic, belt, lastGraded, dojo, dateOfBirth, address, contactNumber, emergencyContact } =
    req.body;
  let role = 'student';

  if (
    firstName === '' ||
    lastName === '' ||
    email === '' ||
    password === '' ||
    bio === '' ||
    belt === '' ||
    lastGraded === '' ||
    dojo === '' ||
    dateOfBirth === '' ||
    address === '' ||
    contactNumber === '' ||
    emergencyContact === '' 
    ) {
    res.render('auth/signup', { errorMessage: 'Fill in all fields' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (regex.test(password) === false) {
    res.render('auth/signup', { errorMessage: 'Password is too weak' });
    return;
  }

  const user = await User.findOne({ email });

  if (user !== null) {
    res.render('auth/signup', { errorMessage: 'User already exists' });
    return;
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    belt,
    lastGraded,
    role,
    dojo,
    bio,
    profilePic,
    dateOfBirth,
    address,
    contactNumber,
    emergencyContact
  });

  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.render('auth/signup', { errorMessage: 'Invalid login' });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.render('auth/signup', { errorMessage: 'Invalid Login' });
  }

  //check for password
  if (bcrypt.compareSync(password, user.password)) {
    //password match
    req.session.currentUser = user;
    res.redirect('/');
  } else {
    res.render('auth/signup', { errorMessage: 'invalid login' });
    return;
  }
});

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
