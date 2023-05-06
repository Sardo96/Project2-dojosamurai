const router = require('express').Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (username === '' || email === '' || password === '') {
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
  await User.create({
    username,
    email,
    password: hashedPassword
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

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
