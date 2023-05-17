const express = require('express');
const router = express.Router();

const User = require('../models/User.model');

function requireLogin(req, res, next) {
  if (req.session.currentUser) {
    next();
  } else {
    res.redirect('/login');
  }
}

/* GET home page */
router.get('/', (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('index', { currentUser });
});

router.get('/profile', requireLogin, async (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('profile', { currentUser });
});

router.get('/history', requireLogin, async (req, res) => {
  res.render('./history');
});
router.get('/mestres', requireLogin, async (req, res) => {
  res.render('./masters');
});

router.get('/horarios', requireLogin, async (req, res) => {
  res.render('./timetable');
});

router.get('/katas', requireLogin, async (req, res) => {
  const currentUser = req.session.currentUser;
  const user = await User.findById(currentUser._id);
  const belt = user.belt;
  const branco = user.belt.includes('9th Kyu');
  const amarelo = user.belt.includes('8th Kyu');
  const laranja = user.belt.includes('7th Kyu');
  const verde = user.belt.includes('6th Kyu');
  const azul = user.belt.includes('5th Kyu');
  const roxo = user.belt.includes('4th Kyu');
  const castanho3 = user.belt.includes('3rd Kyu');
  const castanho2 = user.belt.includes('2nd Kyu');
  const castanho1 = user.belt.includes('1st Kyu');
  const isSensei = user.isSensei;
  res.render('./katas', {
    branco,
    amarelo,
    laranja,
    verde,
    azul,
    roxo,
    castanho3,
    castanho2,
    castanho1,
    isSensei
  });
});
router.get('/edit', requireLogin, async (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render('./edit', { currentUser });
});
router.post('/edit', requireLogin, async (req, res, next) => {
  const currentUser = req.session.currentUser;
  const { firstName, lastName, email, belt } = req.body;

  try {
    await User.findByIdAndUpdate(currentUser._id, {
      firstName,
      lastName,
      email,
      belt
    });
    res.redirect('/profile');
  } catch (error) {
    next(error);
  }
});
module.exports = router;
