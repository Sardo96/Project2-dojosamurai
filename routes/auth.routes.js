const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, email, password, bio, belt, dojo, firstName, lastName } =
    req.body;
  let isSensei;
  let isStudent;

  if (
    username === '' ||
    email === '' ||
    password === '' ||
    belt === '' ||
    firstName === '' ||
    lastName === ''
  ) {
    res.render('auth/signup', { errorMessage: 'Fill in all fields' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  if (regex.test(password) === false) {
    res.render('auth/signup', { errorMessage: 'Password is too weak' });
    return;
  }

  const user = await User.findOne({ username });

  if (user !== null) {
    res.render('auth/signup', { errorMessage: 'User already exists' });
    return;
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  if (
    belt === '1st Dan' ||
    belt === '2nd Dan' ||
    belt === '3rd Dan' ||
    belt === '4th Dan' ||
    belt === '5th Dan' ||
    belt === '6th Dan' ||
    belt === '7th Dan'
  ) {
    (isSensei = true), (isStudent = false);
  } else {
    (isSensei = false), (isStudent = true);
  }

  await User.create({
    username,
    email,
    password: hashedPassword,
    belt,
    firstName,
    lastName,
    dojo,
    bio,
    isSensei,
    isStudent
  });

  res.redirect('/');
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'IOnvalid login' });
    return;
  }

  const user = await User.findOne({ username });
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

router.get('/history', requireLogin, async (req, res) => {
  res.render('./history');
});
router.get('/mestres', requireLogin, async (req, res) => {
  res.render('./masters');
});

router.get('/horarios', requireLogin, async (req, res) => {
  res.render('./timetable');
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
